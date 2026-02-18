/**
 * Service Worker for Web Push (VAPID).
 * Handles push events and notificationclick; only used by the web app.
 */

// Take control of open pages as soon as this SW activates so they receive postMessage when push arrives.
self.addEventListener("install", function () {
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  if (!event.data) return;
  let payload = { title: "Notification", body: "", data: {} };
  try {
    payload = event.data.json();
  } catch (_) {
    payload.body = event.data.text();
  }
  const title = payload.title || "Notification";
  // So you can confirm in DevTools > Application > Service Workers that push was received
  if (typeof self.clients !== "undefined") {
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      console.log("[sw] Push received, notifying", list.length, "client(s). Title:", title);
    });
  }
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
          if (typeof client.navigate === "function") {
            return client.navigate(fullUrl).then(function () { return client.focus(); });
          }
          client.focus();
          return Promise.resolve();
        }
      }
      if (clients.openWindow) return clients.openWindow(fullUrl);
      return Promise.resolve();
    })
  );
});
