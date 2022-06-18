const APP_PREFIX = `BudgetTracker-`
const VERSION = 'version_01';
const DATA_CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/index.js',
  '/assets/js/ibd.js',
  '/assets/images/icons/icon-72x72.png',
  '/assets/images/icons/icon-96x96.png',
  '/assets/images/icons/icon-128x128.png',
  '/assets/images/icons/icon-144x144.png',
  '/assets/images/icons/icon-152x152.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-384x384.png',
  '/assets/images/icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
      })
    )
  });

  self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});

// Intercept fetch requests
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url);
  e.respondWith(
      caches.match(e.request).then(function (request) {
          if (request) { // if cache is available, respond with cache
              console.log('responding with cache : ' + e.request.url);
              return request
          } else {       // if there are no cache, try fetching request
              console.log('file is not cached, fetching : ' + e.request.url);
              return fetch(e.request)
          }

      })
  )
});
