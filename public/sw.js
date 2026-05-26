const CACHE_NAME = 'mindflow-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg'
];

// Install Event - Pre-cache core shell resources
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up deprecated legacy caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Hybrid Cache-First & Dynamic Network Hydration
self.addEventListener('fetch', (e) => {
  // Only handle local scheme origins (ignore chrome extensions etc)
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch freshly in background to update cache silently for subsequent visits
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(e.request).then((response) => {
        // Dynamically cache chunk bundle files and styles
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return response;
      });
    })
  );
});

// Background Sync - Offline Resiliency and Task Synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(
      console.log('Background Sync: Synchronizing offline tasks...')
    );
  }
});

// Periodic Background Sync - Silent Content Prefetching & Seed Hydration
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-affirmations-update') {
    event.waitUntil(
      console.log('Periodic Background Sync: Fetching new affirmations...')
    );
  }
});

// Push Notifications - Neurodivergent-Friendly Ambient Reminders
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'MindFlow', body: 'Ready to bloom your next focus session?' };
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

