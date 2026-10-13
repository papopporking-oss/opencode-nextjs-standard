"use client";

import { useEffect, useState } from "react";

/**
 * Push API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/PushManager
 *
 * The Push API gives web applications the ability to receive messages
 * pushed from a server, even when the app is not in the foreground.
 * It requires an active Service Worker.
 *
 * ⚠️ Requires HTTPS, a registered Service Worker, and VAPID keys from a server.
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Not subscribed");

  const checkSupport = (): boolean => {
    // Step 1: Check Push API support
    if (!("PushManager" in window)) {
      console.error("Push API: Not supported in this browser.");
      return false;
    }
    console.log("Push API: PushManager is available ✓");

    // Step 2: Check if serviceWorker is ready (required for Push)
    if (!("serviceWorker" in navigator)) {
      console.error("Push API: Service Worker is required but not supported.");
      return false;
    }
    console.log("Push API: Service Worker container available ✓");
    return true;
  };

  const subscribeToPush = async () => {
    if (!checkSupport()) return;

    try {
      console.log("Push API: Starting subscription process...");

      // Step 3: Get the service worker registration
      // The PushManager is only available through a service worker registration
      const registration = await navigator.serviceWorker.ready;
      console.log("Push API: Service worker is ready, scope:", registration.scope);

      // Step 4: Get the PushManager from the registration
      const pushManager = registration.pushManager;
      console.log("Push API: PushManager obtained ✓");

      // Step 5: Check current subscription state
      const existingSubscription = await pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Push API: Already subscribed ✓");
        console.log("  Endpoint:", existingSubscription.endpoint);
        console.log("  ExpirationTime:", existingSubscription.expirationTime);
        // Log keys (p256dh and auth) — these are ArrayBuffer
        const keyData = existingSubscription.toJSON();
        console.log("  Keys:", keyData.keys);
        setStatus(`Subscribed — endpoint: ${existingSubscription.endpoint.substring(0, 60)}...`);
        return;
      }

      // Step 6: Subscribe to push notifications
      // The applicationServerKey is the VAPID public key from your server (Base64 URL-encoded)
      // This example uses a placeholder — a real key from your push server is required
      const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
      console.log("Push API: Attempting to subscribe...");
      console.log("  VAPID public key (placeholder):", vapidPublicKey);

      // Step 7: pushManager.subscribe(options)
      // userVisibleOnly: MUST be true (browsers require visible notification for each push)
      // applicationServerKey: VAPID public key as Uint8Array
      const subscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      console.log("Push API: Subscription successful ✓");
      console.log("  Endpoint:", subscription.endpoint);
      console.log("  ExpirationTime:", subscription.expirationTime);

      // Step 8: Extract keys from the subscription (send these to your server)
      const subscriptionJSON = subscription.toJSON();
      console.log("  Keys (send to server):");
      console.log("    p256dh:", (subscriptionJSON.keys as Record<string, string>)?.p256dh);
      console.log("    auth:", (subscriptionJSON.keys as Record<string, string>)?.auth);

      console.log("Push API: Send the endpoint + keys to your push server to send messages.");

      setStatus(`Subscribed — endpoint: ${subscription.endpoint.substring(0, 60)}...`);

    } catch (err) {
      console.error("Push API: Subscription failed:", err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!checkSupport()) return;

    try {
      // Step 9: Unsubscribe from push notifications
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const wasUnsubscribed = await subscription.unsubscribe();
        console.log("Push API: Unsubscribed:", wasUnsubscribed);
        if (wasUnsubscribed) {
          setStatus("Unsubscribed");
        }
      } else {
        console.log("Push API: No active subscription to unsubscribe.");
      }
    } catch (err) {
      console.error("Push API: Unsubscribe failed:", err);
    }
  };

  // Step 10: Add notificationclick listener for push notification interaction
  // (This would normally be in the service worker file, shown here for reference)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "push-received") {
          console.log("Push API: Push message received:", event.data.payload);
        }
      });
    }
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Push API</h1>
      <div className="p-3 border border-amber-500 rounded-lg bg-amber-50 mb-4">
        <p><strong>⚠️</strong> Requires HTTPS, registered Service Worker, and a push server with valid VAPID keys. Open DevTools Console.</p>
      </div>
      <div>
        <p className="mb-3">Status: <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{status}</span></p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={subscribeToPush}>Subscribe</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={unsubscribeFromPush}>Unsubscribe</button>
        </div>
      </div>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API" target="_blank" rel="noopener noreferrer">MDN: Push API</a>
    </main>
  );
}

/**
 * Helper: Convert a Base64 URL-encoded VAPID public key to Uint8Array.
 * This is required for the applicationServerKey option in pushManager.subscribe.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}