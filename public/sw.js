const CACHE_NAME = 'kaszy-v1';
const OFFLINE_URL = '/offline';

// Assets yang akan di-cache saat install
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/login',
    '/pos',
    '/products',
    '/transactions',
    '/reports',
    '/settings'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // API requests - Network First strategy
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Clone response and cache it
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Return cached version if network fails
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Return offline fallback for API
                        return new Response(
                            JSON.stringify({ error: 'Offline', offline: true }),
                            {
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    // Page requests - Cache First, fallback to Network
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((response) => {
                    // Cache successful responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                });
        })
    );
});

// Background Sync for pending transactions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncPendingTransactions());
    }
});

async function syncPendingTransactions() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();

        const pendingTransactions = requests.filter(
            (req) => req.url.includes('/api/transactions') && req.method === 'POST'
        );

        for (const request of pendingTransactions) {
            try {
                await fetch(request);
                await cache.delete(request);
            } catch (error) {
                console.error('Failed to sync transaction:', error);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    }
}
