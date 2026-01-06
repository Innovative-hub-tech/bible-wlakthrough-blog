const CACHE_NAME = 'bible-walkthrough-v2';
const urlsToCache = [
  '/'
];

// Install service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Network first, no caching for now
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
