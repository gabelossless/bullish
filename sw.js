// Webull Intelligence Terminal - Progressive Web App Service Worker
// Version: 1.1.0 (Mobile Optimized & Touch Ready)

const CACHE_NAME = 'webull-terminal-v1.1.0';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/theme.css',
    '/css/layout.css',
    '/css/mobile.css',
    '/js/config.js',
    '/js/oracle.js',
    '/js/chart-mc.js',
    '/js/chart-tv.js',
    '/js/calculator.js',
    '/js/pwa.js',
    '/js/app.js',
    '/icons/favicon.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js',
    'https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap'
];

// Install: Cache core application shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`[SW] Warning: Failed to pre-cache ${url}:`, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old cache versions & take immediate control
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Clearing deprecated cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Smart network routing
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bypass WebSockets and non-HTTP requests
    if (url.protocol === 'ws:' || url.protocol === 'wss:') {
        return;
    }

    // Ignore non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Live oracles & APIs (CoinGecko, OKX, Coinbase REST): Network-first with cache fallback
    if (url.hostname.includes('coingecko') || url.hostname.includes('okx') || url.hostname.includes('coinbase')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // App shell, styles, scripts, fonts: Stale-While-Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch((err) => {
                    // Offline fallback for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return null;
                });

            return cachedResponse || fetchPromise;
        })
    );
});
