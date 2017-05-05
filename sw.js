let log = console.log.bind(console);
let err = console.error.bind(console);

let version = '1';
let cacheName = 'pwa-client-v' + version;
let dataCacheName = 'pwa-client-data-v' + version;
let appShellFilesToCache = [
    './',
    './index.html',
    'https://spreadsheets.google.com/feeds/list/1kOA4RNBdGbcleiH8Q8yhc_YD8HHeIluH7opTzTPZYcw/od6/public/values?alt=json-in-script&callback=JSON_CALLBACK'
];

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

self.addEventListener('install', (e) => {
    e.waitUntil(self.skipWaiting());
    log('Service Worker: Installed');

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            log('Service Worker: Caching App Shell');
            return cache.addAll(appShellFilesToCache);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
    log('Service Worker: Active');

    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {

                if (key !== cacheName) {
                    log('Service Worker: Removing old cache', key);
                    return caches.delete(key);
                }

            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    log('Service Worker: Fetch URL ', e.request.url);

    // Match requests for data and handle them separately
    e.respondWith(
        caches.match(e.request.clone()).then((response) => {
           
            
   

            // respond from the cache, or the network
            var fetchPromise = fetch(e.request.clone()).then(handleErrors).then((networkResponse) => {
                
                log('Response for',e.request.url, 'was', networkResponse.ok);
                
                var theresponse = caches.open(dataCacheName).then((cache) => {
                    log('Service Worker: Fetched & Cached URL ', e.request.url);
                    cache.put(e.request.url, networkResponse.clone());
                    return networkResponse.clone();
                });
                return theresponse;
            }).catch(){
            log('Bad Response from' + e.request.url + '?');
            }
            
            ;
            return response || fetchPromise;
        })
    );
});
