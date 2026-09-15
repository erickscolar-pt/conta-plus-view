const CACHE = "contaplus-pwa-v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "/",
        "/manifest.webmanifest",
        "/icon-192.png",
        "/icon-512.png",
        "/icon-512-maskable.png",
        "/apple-touch-icon.png",
      ]),
    ),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && url.pathname.match(/\.(png|ico|webmanifest)$/)) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});

function notifyClients(payload) {
  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windowClients) => {
      windowClients.forEach((client) => {
        client.postMessage({ type: "PUSH_RECEIVED", payload });
      });
      return windowClients;
    });
}

self.addEventListener("push", (event) => {
  let payload = {
    title: "Conta+",
    body: "Você tem novos avisos financeiros.",
    data: { href: "/movimentacoes" },
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = {
        title: parsed.title || payload.title,
        body: parsed.body || payload.body,
        data: { ...payload.data, ...(parsed.data || {}) },
      };
    }
  } catch {
    // usa payload padrão
  }

  const tag = payload.data?.notificationId || "contaplus-alert";

  event.waitUntil(
    (async () => {
      const windowClients = await notifyClients(payload);
      const hasVisibleClient = windowClients.some(
        (client) => client.visibilityState === "visible",
      );
      if (hasVisibleClient) return;

      const existing = await self.registration.getNotifications({ tag });
      existing.forEach((notification) => notification.close());

      await self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        data: payload.data,
        tag,
        renotify: false,
      });
    })(),
  );
});

function withNotifRead(href, notificationId) {
  const url = new URL(href || "/movimentacoes", self.location.origin);
  if (notificationId) {
    url.hash = `notifRead=${encodeURIComponent(notificationId)}`;
  }
  return url.toString();
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const notificationId = data.notificationId;
  const url = withNotifRead(data.href, notificationId);

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            client.postMessage({
              type: "NOTIFICATION_CLICKED",
              notificationId,
              href: data.href,
            });
            return client.focus().then((focused) => {
              if (focused && "navigate" in focused) {
                return focused.navigate(url);
              }
            });
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      }),
  );
});
