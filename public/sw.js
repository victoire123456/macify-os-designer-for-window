const CACHE_NAME = 'macify-os-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/loge.png',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell core assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Exclude some requests from caching (e.g. Chrome Extensions, live dev websocket, hot reloading APIs)
  const url = new URL(event.request.url);
  if (url.origin.includes('chrome-extension') || url.pathname.includes('/vite/') || url.pathname.includes('/@vite/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but fetch fresh in background (stale-while-revalidate pattern for premium feel)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* Ignore offline background refresh failures */ });

        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Verify valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }

          // Cache clones of successful GET requests
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.log('[Service Worker] Network request failed. Device offline.', error);
          // Return default index.html if request is a navigation request
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          throw error;
        });
    })
  );
});
