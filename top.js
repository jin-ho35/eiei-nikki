const dayList = document.getElementById("day-list");
const monthTitle = document.getElementById("month-title");
const monthSelect = document.getElementById("month-select");

let currentYear = new Date().getFullYear();
const today = new Date();
let currentMonth = today.getMonth() + 1;

// 月一覧を作成（常に表示）
function createMonthSelect() {
  monthSelect.innerHTML = "";
  for (let m = 1; m <= 12; m++) {
    const item = document.createElement("div");
    item.className = "month-item";
    item.textContent = `${m}月`;
    item.onclick = () => {
      currentMonth = m;
      showMonth(currentMonth);
    };
    monthSelect.appendChild(item);
  }
}

// 指定した月のカレンダーを表示
function showMonth(m) {
  dayList.innerHTML = "";
  monthTitle.textContent = `${m}月`;

  const monthBlock = document.createElement("div");

// 当月判定（年も一致している場合のみ黄色枠）
if (currentYear === today.getFullYear() && m === today.getMonth() + 1) {
  monthBlock.classList.add("current-month-block");   // 黄色太枠＋薄黄色背景
} else {
  monthBlock.classList.add("month-block");           // 黒枠＋白背景
}

  const row = document.createElement("div");
  row.className = "day-row";

  for (let d = 1; d <= 31; d++) {
    const date = new Date(currentYear, m - 1, d);
    if (date.getMonth() + 1 !== m) continue;

    const mm = ("0" + m).slice(-2);
    const dd = ("0" + d).slice(-2);
    const key = `${currentYear}-${mm}-${dd}`;

    const item = document.createElement("div");
    item.className = "day-item";
    item.textContent = `${d}日`;

    // 今日判定
    if (m === today.getMonth() + 1 && d === today.getDate()) {
      item.classList.add("today");
    }

    // 日記がある日
    if (localStorage.getItem(key)) {
      item.classList.add("written");
    }

    item.onclick = () => {
      window.location.href = `diary.html?y=${currentYear}&md=${mm}-${dd}`;
    };

    row.appendChild(item);
  }

  monthBlock.appendChild(row);
  dayList.appendChild(monthBlock);
}

// 初期表示：当月
document.getElementById("year-title").textContent = `${currentYear}年`;

// 年の前後移動
document.getElementById("prev-year").onclick = () => {
  currentYear--;
  updateYearAndCalendar();
};

document.getElementById("next-year").onclick = () => {
  currentYear++;
  updateYearAndCalendar();
};

// 年とカレンダーを更新する
function updateYearAndCalendar() {
  document.getElementById("year-title").textContent = `${currentYear}年`;
  showMonth(currentMonth);
}

createMonthSelect();
showMonth(currentMonth);
// USB内のフォルダに直接バックアップを保存する
document.getElementById("export-btn").onclick = async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();

    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      allData[key] = value;
    }

    const fileHandle = await dirHandle.getFileHandle("diary-backup.json", { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(allData, null, 2));
    await writable.close();

    alert("USB内のフォルダにバックアップを保存しました");
  } catch (e) {
    alert("保存がキャンセルされました");
  }
};

document.getElementById("import-btn").onclick = () => {
  document.getElementById("import-file").click();
};

document.getElementById("import-file").onchange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // ★ 復元前の確認ダイアログ
  if (!confirm("バックアップ時点以降の日記は消えます。復元しますか？")) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);

    for (const key in data) {
      localStorage.setItem(key, data[key]);
    }

    alert("バックアップから復元しました");
    location.reload();
  };

  reader.readAsText(file);
};

// ★ 初期化ボタン（YYYY-MM-DD形式のキーをすべて削除）
document.getElementById("reset-btn").onclick = () => {
  if (!confirm("日記データをすべて削除して初期状態に戻します。よろしいですか？")) return;

  const keysToDelete = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // ★ 日記キーは「YYYY-MM-DD」形式なので数字で始まる
    if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => localStorage.removeItem(key));

  alert("初期化が完了しました");
  location.reload();
};

