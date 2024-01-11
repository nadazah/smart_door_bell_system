const staticCacheName = 'site-static-v12';
const dynamicCacheName = 'site-dynamic-v2';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/login.js',
  '/js/profile.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
    ))
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        });
      });
    }).catch(error => {
      console.error('Fetch error:', error);
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('/pages/fallback.html');
      }
    })
  );
});

// Dans votre fichier sw.js
self.addEventListener('message', (event) => {
  if (event.data.action === 'clearDynamicCache') {
    caches.open(dynamicCacheName).then(cache => {
      cache.keys().then(keys => {
        keys.forEach(key => cache.delete(key));
      });
    });
  }
});
