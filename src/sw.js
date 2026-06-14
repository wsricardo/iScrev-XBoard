const CACHE_NAME = 'xboard-cache-v2';
const urlsToCache = [
  './index.html',
  './css/style.css',
  './css/modals.css',
  './js/core/canvas-engine.js',
  './js/core/history.js',
  './js/modules/ui-manager.js',
  './js/modules/media-viewer.js',
  './js/modules/recorder.js',
  './js/services/storage.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key.startsWith('xboard-cache-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso
        });
        return response || fetchPromise;
      });
    })
  );
});
