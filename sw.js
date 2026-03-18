const CACHE_NAME = 'che-phuong-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/logo.svg',
  '/icon-512.png',
  '/hero.png',
  '/saurieng.png',
  '/xoai.png',
  '/ngocthach.png',
  '/thapcam.png',
  '/buoi.png',
  '/khoaideo.png',
  '/khucbach.png',
  '/duanon.png',
  '/bo.png',
  '/suongsao.png',
  '/doden.png',
  '/ngo.png',
  '/com.png',
  '/suachuamit.png',
  '/suachuanepcam.png',
  '/suachuahoaqua.png',
  '/suachuatranchau.png',
  '/matcha-latte.png',
  '/tra-quat-nhadam.png',
  '/tra-chanh.png',
  '/tra-tac-ximuoi.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
