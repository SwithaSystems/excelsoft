/**
 * Web Push registration (browser only).
 * Uses VAPID; does not run in React Native / mobile builds.
 * Call only after user interaction (e.g. first click on notification bell).
 */

const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const SW_PATH = "/sw.js";

function isBrowser(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * Request notification permission. Must be called from a user gesture.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowser()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Get auth token for API (e.g. from SecureStore). Caller should pass it
 * so we don't depend on SecureStore in this utility (works on web).
 */
export type GetTokenFn = () => Promise<string | null>;

/**
 * Register the service worker and subscribe to push with VAPID.
 * Sends the subscription to the backend. Requires permission and auth token.
 * IMPORTANT: API_BASE (EXPO_PUBLIC_API_URL) must be your NestJS backend URL, not the frontend app URL.
 */
export async function registerWebPush(getToken: GetTokenFn): Promise<boolean> {
  console.log("[Web Push] registerWebPush called, API_BASE:", API_BASE);
  if (!isBrowser() || !API_BASE) {
    console.warn("[Web Push] Skip: isBrowser=", isBrowser(), "API_BASE=", !!API_BASE);
    return false;
  }

  try {
    console.log("[Web Push] Registering service worker at", SW_PATH);
    const registration = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
    await navigator.serviceWorker.ready;
    console.log("[Web Push] Service worker registered and ready");
    // So push messages reach this tab: wait for this page to be controlled by the SW (after claim()).
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        const t = setTimeout(() => resolve(), 3000);
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => {
            clearTimeout(t);
            resolve();
          },
          { once: true }
        );
      });
    }
    if (navigator.serviceWorker.controller) {
      console.log("[Web Push] Page is controlled by SW; in-app notifications will work when push arrives.");
    } else {
      console.warn("[Web Push] Page not yet controlled by SW. Reload the page once to receive in-app updates.");
    }

    const vapidUrl = `${API_BASE}/web-push/vapid-public-key`;
    console.log("[Web Push] Fetching VAPID key from", vapidUrl);
    const res = await fetch(vapidUrl);
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(
          "[Web Push] 404 on /web-push/vapid-public-key. Set EXPO_PUBLIC_API_URL in .env to your **backend API** URL (where NestJS runs), not the frontend app URL."
        );
      } else {
        console.warn("[Web Push] VAPID key request failed:", res.status, res.statusText);
      }
      return false;
    }
    const { publicKey } = await res.json();
    if (!publicKey) {
      console.warn("[Web Push] No publicKey in response");
      return false;
    }
    console.log("[Web Push] Got VAPID public key, subscribing to push...");

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    console.log("[Web Push] Push subscription created");

    const token = await getToken();
    if (!token) {
      console.warn("[Web Push] No auth token (user not logged in or token missing)");
      return false;
    }

    const subUrl = `${API_BASE}/web-push/subscribe`;
    console.log("[Web Push] Sending subscription to", subUrl);
    const subRes = await fetch(subUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!subRes.ok) {
      console.warn("[Web Push] Subscribe request failed:", subRes.status, subRes.statusText, await subRes.text().catch(() => ""));
      return false;
    }
    console.log("[Web Push] Subscription saved on backend");
    return true;
  } catch (e) {
    console.warn("[Web Push] Registration failed:", e);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i);
  return output;
}

export function isWebPushSupported(): boolean {
  return isBrowser();
}
