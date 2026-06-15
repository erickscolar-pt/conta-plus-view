/* Service worker mínimo — habilita instalação PWA no Chrome/Edge Android */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  /* Rede primeiro — sem cache offline por enquanto */
});
