const ADMIN_CACHE = 'admin-portafolios-v2';
const ADMIN_ASSETS = [
  '/admin/',
  '/admin/index.html',
  '/admin/manifest.webmanifest',
  '/css/tw.css',
  '/css/app.css',
  '/js/firebase-config.js',
  '/imagenes/logo-profe-francisco-nuevo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ADMIN_CACHE)
      .then((cache) => cache.addAll(ADMIN_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== ADMIN_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // HTML/navegaciones: SIEMPRE fresco de la red (sin caché HTTP), para que los cambios se vean al instante.
  const isHTML = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
  const net = isHTML ? fetch(request.url, { cache: 'no-store' }) : fetch(request);
  event.respondWith(
    net
      .then((response) => {
        const copy = response.clone();
        caches.open(ADMIN_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/admin/')))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/admin/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/admin/') && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return null;
    })
  );
});