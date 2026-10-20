const CACHE_NAME = 'deepdial-v2-cache-v3.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// Installation : on met les fichiers en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activation : on nettoie les anciens caches
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
    }).then(() => self.clients.claim())
  );
});

// Stratégie de fetch : Cache d'abord (pour le offline), puis réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Retourne le fichier en cache s'il existe
      }
      return fetch(event.request).then((networkResponse) => {
        // Optionnel : on pourrait mettre en cache les nouvelles requêtes ici
        return networkResponse;
      });
    }).catch(() => {
      // Si tout échoue et qu'on est hors ligne, on pourrait servir une page de fallback
    })
  );
});
