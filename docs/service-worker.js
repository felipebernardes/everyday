const staticCache = 'everyday-static-v1';
const filesToCache = [
    '/',
    '/manifest.json',
    '/index.html',
    '/js/libs.js',
    '/js/scripts.js',
    '/css/libs.css',
    '/css/index.css',
    '/img/logo.png',
    '/img/new-project.png',
    '/img/success.png'
];

// Cache on install
this.addEventListener('install', event => {
    console.info('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            console.info('[ServiceWorker] Caching static files');
            return cache.addAll(filesToCache);
        })
    );
});

/* Clear cache on activate
this.addEventListener('activate', event => {
    console.info('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== staticCache) {
                    console.info('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // runs SW instantly in any existing tab previously from SW activation
    return self.clients.claim();
});*/

this.addEventListener('fetch', (event) => {
    console.info('[Service Worker] Fetch', event.request.url);

    //return cached static files
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            return cacheResponse || fetch(event.request);
        })
    );
});
