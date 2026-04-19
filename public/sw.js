self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force the new service worker to become active immediately
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName); // Clear all existing caches
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control of all clients immediately
    }).then(() => {
      return self.registration.unregister(); // Unregister this service worker permanently
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Pass-through all fetch requests directly to the network without caching
});
