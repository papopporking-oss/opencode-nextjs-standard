"use client";

import { useEffect, useState } from "react";

/**
 * Service Worker API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
 *
 * Service Workers act as proxy servers between web apps, the browser,
 * and the network. They enable offline support, background sync,
 * and push notifications. They run on a separate thread.
 *
 * ⚠️ Requires HTTPS (or localhost) and a separate service worker file.
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Not registered");

  useEffect(() => {
    // Step 1: Check if Service Worker is supported
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker API: Not supported in this browser.");
      setStatus("Not supported");
      return;
    }
    console.log("Service Worker API: Supported ✓");
    console.log("  navigator.serviceWorker is available");

    // Step 2: Register a Service Worker file
    // The sw.js file must be served from the same origin
    // Scope determines which pages the SW controls (defaults to sw.js directory)
    const registerSW = async () => {
      try {
        console.log("Service Worker API: Attempting to register /sw.js...");
        console.log("  Scope: '/' (entire origin)");

        // Step 3: navigator.serviceWorker.register(path, options)
        // Options: scope — restricts which pages the SW can control
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("Service Worker API: Registration successful ✓");
        console.log(`  Scope: ${registration.scope}`);
        console.log(`  State: ${registration.installing?.state || registration.waiting?.state || registration.active?.state || "unknown"}`);

        setStatus(`Registered — scope: ${registration.scope}`);

        // Step 4: Listen for updates to the service worker
        registration.addEventListener("updatefound", () => {
          console.log("Service Worker API: New service worker found (updatefound event)");
          const newWorker = registration.installing;
          if (newWorker) {
            console.log(`  New worker state: ${newWorker.state}`);

            newWorker.addEventListener("statechange", () => {
              console.log(`Service Worker API: New worker state changed to: ${newWorker.state}`);
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("Service Worker API: New content is available; refresh to activate.");
              }
              if (newWorker.state === "activated") {
                console.log("Service Worker API: New service worker activated ✓");
              }
            });
          }
        });

        // Step 5: Check for an active controller (controls this page)
        if (navigator.serviceWorker.controller) {
          console.log("Service Worker API: Page is currently controlled by a service worker");
        }

        // Step 6: Get all registrations
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`Service Worker API: Total registrations: ${registrations.length}`);

        // Step 7: Manually check for updates
        await registration.update();
        console.log("Service Worker API: Manual update check complete");

        // Step 8: Unregister (cleanup example — not executed here)
        // const unregistered = await registration.unregister();
        // console.log("Service Worker API: Unregistered:", unregistered);

      } catch (err) {
        console.error("Service Worker API: Registration failed:", err);
        setStatus(`Registration failed: ${(err as Error).message}`);
      }
    };

    registerSW();

    // Step 9: Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log("Service Worker API: Message received from SW:", event.data);
    });

    // Step 10: Listen for controller change (when a new SW takes over)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("Service Worker API: Controller changed — a new SW is controlling this page");
    });

    // Step 11: ServiceWorker container properties
    console.log("Service Worker API: ready property available:", !!navigator.serviceWorker.ready);
    navigator.serviceWorker.ready.then((reg) => {
      console.log("Service Worker API: Service worker is ready, scope:", reg.scope);
    });

    return () => {
      console.log("Service Worker API: Component unmounted (SW stays registered)");
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Service Worker API</h1>
      <div className="alert alert-warning mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>Requires HTTPS/localhost and a service worker file at <code>/public/sw.js</code>. Open DevTools Console.</span>
      </div>
      <div className="space-y-4">
        <p>Status: <span className="badge badge-outline">{status}</span></p>
        <p className="text-sm text-base-content/60">To fully test, create a <code>public/sw.js</code> file with event listeners (install, activate, fetch).</p>
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Service Worker API</a>
    </main>
  );
}