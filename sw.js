const CACHE_NAME = 'che-phuong-v5'; // Bump version
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/logo.svg',
  '/icon-512.webp',
  '/hero.webp',
  '/saurieng.webp',
  '/xoai.webp',
  '/ngocthach.webp',
  '/thapcam.webp',
  '/buoi.webp',
  '/khoaideo.webp',
  '/khucbach.webp',
  '/duanon.webp',
  '/bo.webp',
  '/suongsao.webp',
  '/doden.webp',
  '/ngo.webp',
  '/com.webp',
  '/suachuamit.webp',
  '/suachuanepcam.webp',
  '/suachuahoaqua.webp',
  '/suachuatranchau.webp',
  '/matcha-latte.webp',
  '/tra-quat-nhadam.webp',
  '/tra-chanh.webp',
  '/tra-tac-ximuoi.webp',
  '/tra-thai-xanh.webp',
  '/sua-chua-danh-da.webp',
  '/sua-chua-viet-quat.webp',
  '/sua-chua-chanh-leo.webp',
  '/sua-chua-dau-tay.webp',
  '/sua-chua-oi-hong.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Pre-caching all assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Stale-while-revalidate strategy for better offline experience
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for failed network requests (offline)
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
