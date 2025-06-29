const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/images/icon-72x72.png',
    '/images/icon-96x96.png',
    '/images/icon-128x128.png',
    '/images/icon-144x144.png',
    '/images/icon-152x152.png',
    '/images/icon-192x192.png',
    '/images/icon-384x384.png',
    '/images/icon-512x512.png'
    // Aggiungi qui tutte le risorse statiche che vuoi mettere in cache
];

// Evento: Installazione del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installazione...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aperta');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Forza l'attivazione immediata del nuovo SW
            .catch(err => console.error('Service Worker: Errore durante il caching', err))
    );
});

// Evento: Attivazione del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Attivazione...');
    // Rimuovi le vecchie cache
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminazione vecchia cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim()) // Permette al nuovo SW di prendere il controllo dei client immediatamente
    );
});

// Evento: Fetch (intercetta le richieste di rete)
self.addEventListener('fetch', event => {
    // console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è nella cache, restituiscila
                if (response) {
                    console.log('Service Worker: Servendo dalla cache', event.request.url);
                    return response;
                }
                // Altrimenti, recuperala dalla rete
                console.log('Service Worker: Recuperando dalla rete', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                // Questo catch gestisce gli errori di rete in caso la risorsa non sia in cache
                console.error('Service Worker: Errore durante il fetch o nessuna corrispondenza nella cache', error);
                // Puoi qui restituire una pagina offline personalizzata
                // return caches.match('/offline.html');
            })
    );
});
