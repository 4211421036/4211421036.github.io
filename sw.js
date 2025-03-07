const CACHE_NAME = 'g4lihru-v1';
const urlsToCache = [
    './',  // Root URL
    './index.html',  // Pastikan ekstensi file sesuai, .html bukan .htm
    './345677.png',
    './manifest.json',  // Manifest file
    './sw.js',  // Service Worker sendiri
    './gnt.js',
    './theme.js',
    './swt.js',
    './sdb.js',
    './style.css',
    './logo/192x192.png',  // Logo kecil
    './logo/512x512.png',  // Logo besar
];

// Event `install`
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching files:', urlsToCache);
                // Caching files
                return cache.addAll(urlsToCache);  // Gunakan `addAll` untuk menambah file
            })
            .catch(err => {
                console.error('Error caching files during install:', err);
            })
    );
    self.skipWaiting();  // Memastikan Service Worker aktif segera
});

// Event `activate`
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Event `fetch`
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Salin respons dan simpan ke cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Jika fetch gagal, coba dari cache
                return caches.match(event.request).then(cachedResponse => {
                    return cachedResponse || caches.match('./index.html');  // Menggunakan fallback ke index.html
                });
            })
    );
});
