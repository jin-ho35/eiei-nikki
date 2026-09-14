const CACHE_NAME = "eien-nikki-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./top.js",
  "./style.css",
  "./manifest.json"
];

// インストール（初回）
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// オフライン対応
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
