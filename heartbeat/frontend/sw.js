// Only activate the service worker if we're NOT in development
if (self.location.hostname !== 'dev.heartbeat.local') {

    const CACHE_NAME = 'heartbeat-cache-v1';
    const OFFLINE_URL = 'offline.html';
    const IMAGE_FALLBACK = '/static/img/screenshots/screenshot-store-desktop.png';

    const urlsToCache = [
        '/',
        '/offline.html',
        '/manifest.json',
        '/static/js/index.js',
        '/static/css/index.css',
        '/static/css/tooltip.css',
        '/static/css/modal.css',
        '/static/img/meta/favicon-48x48.png',
        '/static/img/meta/apple-touch-icon.png',
        IMAGE_FALLBACK
    ];

    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    console.log('Opened cache');
                    return cache.addAll(urlsToCache);
                })
                .catch((error) => {
                    console.error('Service worker install failed:', error);
                })
        );
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
        return self.clients.claim();
    });

    self.addEventListener('fetch', (event) => {
        if (event.request.method !== 'GET') return;

        if (event.request.mode === 'navigate') {
            event.respondWith(
                fetch(event.request).catch(() => caches.match(OFFLINE_URL))
            );
            return;
        }

        const requestUrl = new URL(event.request.url);
        const shouldFallbackToImage =
            event.request.destination === 'image' &&
            (requestUrl.hostname === 'images.unsplash.com' ||
             requestUrl.hostname === 'upload.wikimedia.org');

        if (shouldFallbackToImage) {
            event.respondWith(
                fetch(event.request)
                    .then((response) => {
                        if (response && response.ok) {
                            return response;
                        }
                        return caches.match(IMAGE_FALLBACK);
                    })
                    .catch(() => caches.match(IMAGE_FALLBACK))
            );
            return;
        }

        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchedResponse = fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        })
                        .catch(() => caches.match(event.request));

                    return cachedResponse || fetchedResponse;
                });
            })
        );
    });

} else {
    // Dev hostname: do nothing, bypass service worker
    console.log('Service worker bypassed for development hostname');
}
