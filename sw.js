// Webull Intelligence Terminal - Progressive Web App Service Worker
// Version: 2.2.0 (Network-First Core, Stale-While-Revalidate Fallback)

const CACHE_NAME = 'webull-terminal-v2.2.0';

const PRECACHE_ASSETS = [
    '/',
    '/index.html?v=2.2.0',
    '/manifest.json',
    '/css/theme.css?v=2.2.0',
    '/css/layout.css?v=2.2.0',
    '/css/mobile.css?v=2.2.0',
    '/js/config.js?v=2.2.0',
    '/js/oracle.js?v=2.2.0',
    '/js/chart-mc.js?v=2.2.0',
    '/js/chart-tv.js?v=2.2.0',
    '/js/calculator.js?v=2.2.0',
    '/js/pwa.js?v=2.2.0',
    '/js/app.js?v=2.2.0',
    '/icons/favicon.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js',
    'https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap'
];

// Install: Precache shell and skip waiting immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`[SW] Warning: Failed to pre-cache ${url}:`, err);
                    })
                )
            );
        })
    );
});

// Activate: Immediately purge all older cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Purging deprecated cache:', cache);
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

    // 1. Live oracles & APIs (CoinGecko, OKX, Coinbase REST): Network-only with cache fallback
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

    // 2. Local app files (HTML, JS, CSS): Network-First to guarantee fresh code updates
    if (url.origin === location.origin) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        if (cached) return cached;
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html') || caches.match('/');
                        }
                        return null;
                    });
                })
        );
        return;
    }

    // 3. Third-party static libraries & Google Fonts: Stale-While-Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => null);

            return cachedResponse || fetchPromise;
        })
    );
});
