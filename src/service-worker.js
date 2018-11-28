const staticCache = 'everyday-static-v3';
const filesToCache = [
    '/',
    '/utm_source=homescreen',
    '/manifest.json',
    '/index.html',
    '/js/libs.js',
    '/js/scripts.js',
    '/css/libs.css',
    '/css/index.css',
    '/img/logo.png',
    '/img/new-project.png',
    '/img/success.png',
    '/img/icon-128x128.png',
    '/img/icon-144x144.png',
    '/img/icon-152x152.png',
    '/img/icon-192x192.png',
    '/img/icon-256x256.png',
    '/img/icon-512x512.png'
];

// Cache on install
this.addEventListener('install', (event) => {
    console.info('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(staticCache).then(cache => {
            console.info('[ServiceWorker] Caching static files');
            return cache.addAll(filesToCache);
        })
    );
});


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
});

this.addEventListener('fetch', (event) => {
    console.info('[ServiceWorker] Fetch', event.request);
    //return cached static files
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            console.log('cache', cacheResponse);
            return cacheResponse || fetch(event.request);
        }).catch((err) => {
          console.log('sw error', err);
        })
    );
});
