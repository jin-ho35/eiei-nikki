const params = new URLSearchParams(window.location.search);
const yParam = params.get("y");
const mdParam = params.get("md");

// 今日の年月日
const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = ("0" + (today.getMonth() + 1)).slice(-2);
const thisDay = ("0" + today.getDate()).slice(-2);

// 年は URL が優先、なければ今年
const year = yParam ? Number(yParam) : thisYear;

// 月日も URL が優先、なければ今日
let targetMonth = thisMonth;
let targetDay = thisDay;

if (mdParam) {
  const parts = mdParam.split("-");
  targetMonth = parts[0];
  targetDay = parts[1];
}

const md = `${targetMonth}-${targetDay}`;
const todayKey = `${year}-${md}`;

// 和暦変換
function toWareki(y) {
  if (y >= 2019) return `令和${y - 2018}年`;
  if (y >= 1989) return `平成${y - 1988}年`;
  if (y >= 1926) return `昭和${y - 1925}年`;
  return `${y}年（和暦不明）`;
}

// タイトル表示
document.getElementById("date-title").textContent =
  `${year}年${targetMonth}月${targetDay}日`;
document.getElementById("wareki").textContent = toWareki(year);

// 今日の日記を読み込む
const diaryText = document.getElementById("diary-text");
diaryText.value = localStorage.getItem(todayKey) || "";

// 保存ボタン
document.getElementById("save-btn").onclick = () => {
  localStorage.setItem(todayKey, diaryText.value);
  alert("保存しました");
};

const pastContainer = document.getElementById("past-container");

// 2000年〜今年までを「新しい年から古い年へ」見ていく
const maxYear = new Date().getFullYear();

for (let y = maxYear; y >= 2000; y--) {
  const key = `${y}-${md}`;
  const text = localStorage.getItem(key);

  if (text) {
    const preview = text.substring(0, 10);

    const card = document.createElement("div");
    card.className = "past-card";

    card.innerHTML = `
      <div class="past-year">${y}年（${toWareki(y)}）</div>
      <div class="past-preview">${preview}...</div>
      <button class="view-full-btn" data-key="${key}">全文を見る</button>
    `;

    pastContainer.appendChild(card);
  }
}

// 全文表示ボタン
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-full-btn")) {
    const key = e.target.dataset.key;
    const fullText = localStorage.getItem(key);
    alert(fullText);
  }
});

// カレンダーへ戻る
document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html";
};

// 前日へ
document.getElementById("prev-btn").onclick = () => {
  const date = new Date(year, targetMonth - 1, targetDay);
  date.setDate(date.getDate() - 1);

  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);

  window.location.href = `diary.html?y=${date.getFullYear()}&md=${mm}-${dd}`;
};

// 翌日へ
document.getElementById("next-btn").onclick = () => {
  const date = new Date(year, targetMonth - 1, targetDay);
  date.setDate(date.getDate() + 1);

  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);

  window.location.href = `diary.html?y=${date.getFullYear()}&md=${mm}-${dd}`;
};