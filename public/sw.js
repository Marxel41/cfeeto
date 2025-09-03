const CACHE_NAME = 'brettspiel-palast-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Die folgenden Pfade müssen nach dem 'build'-Prozess
  // an die generierten Dateinamen angepasst werden.
  // Vite fügt Hashes zu den Dateinamen hinzu.
  // Für eine einfache Offline-Fähigkeit cachen wir die Grundlagen.
  // Eine fortgeschrittenere Methode würde das Build-Tool nutzen,
  // um diese Liste automatisch zu generieren.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
