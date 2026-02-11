/**
 * Service Worker for Web Push (VAPID).
 * Handles push events and notificationclick; only used by the web app.
 */

self.addEventListener("push", function (event) {
  if (!event.data) return;
  let payload = { title: "Notification", body: "", data: {} };
  try {
    payload = event.data.json();
  } catch (_) {
    payload.body = event.data.text();
  }
  const title = payload.title || "Notification";
  const body = payload.body || "";
  const data = payload.data || {};
  const options = {
    body,
    icon: "/assets/images/icon.png",
    badge: "/assets/images/icon.png",
    data: { ...data, title, body },
    tag: data.tag || "web-push",
    renotify: true,
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(function () {
      // Notify any open app windows so the in-app notification list can update
      return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin)) {
            client.postMessage({
              type: "PUSH_PAYLOAD",
              payload: { title, body, data },
            });
          }
        }
      });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const data = event.notification.data || {};
  const path = data.path || data.url || "/";
  const fullUrl = self.location.origin + (path.startsWith("/") ? path : "/" + path);
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(fullUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(fullUrl);
    })
  );
});
