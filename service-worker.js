const CACHE_NAME = "eien-nikki-cache-v4";

const urlsToCache = [
  "./",
  "./index.html",
  "./top.js",
  "./top.css",
  "./manifest.json"
];

// インストール
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

// ファイル取得
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).then(response => {

      if (
        event.request.method === "GET" &&
        new URL(event.request.url).origin === self.location.origin
      ) {
        const responseCopy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseCopy);
        });
      }

      return response;

    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
