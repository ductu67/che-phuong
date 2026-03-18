const CACHE_NAME = 'che-phuong-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/logo.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
