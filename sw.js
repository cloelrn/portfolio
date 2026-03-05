const CACHE_NAME = 'cloe-portfolio-v1';
const urlsToCache = [
  '/portfolio/',
  '/portfolio/index.html',
  '/portfolio/portfolio.html',
  '/portfolio/portfolio.css',
  // Ajoute ici tes autres pages html
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});