"use client";

import { useState } from "react";

/**
 * Notifications API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Notification
 *
 * The Notifications API displays system notifications outside the
 * browser window. Requires user permission.
 */
export default function Page() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const checkPermission = () => {
    // Step 1: Check current permission state
    // Possible values: "default" (not decided), "granted", "denied"
    const current = Notification.permission;
    console.log(`Notifications API: Current permission = "${current}"`);
    setPermission(current);
    return current;
  };

  const requestPermission = async () => {
    // Step 2: Request permission from the user
    // Must be triggered by a user gesture (click, keypress)
    // The promise resolves with the new permission state
    console.log("Notifications API: Requesting permission...");
    try {
      const result = await Notification.requestPermission();
      console.log(`Notifications API: Permission result = "${result}" ✓`);
      setPermission(result);
    } catch (err) {
      console.error("Notifications API: requestPermission error:", err);
    }
  };

  const showBasicNotification = () => {
    if (checkPermission() !== "granted") {
      console.warn("Notifications API: Permission not granted. Cannot show notification.");
      return;
    }

    // Step 3: Create and show a basic notification
    // The Notification constructor takes a title and optional options object
    const notification = new Notification("Hello from Notifications API!", {
      // Step 4: Configure notification options
      body: "This is the body text of the notification. Click to focus this tab.",
      icon: "https://picsum.photos/64", // 64x64 icon shown in the notification
      badge: "https://picsum.photos/32", // Small badge image
      tag: "demo-notification", // Tag groups/replaces duplicate notifications
      requireInteraction: false, // true = notification stays until user dismisses it
      silent: false, // true = no sound/vibration
      // timestamp and data are valid in browsers but not in all TS type defs
      data: { customKey: "customValue" }, // Arbitrary data accessible in event handlers
    } as NotificationOptions & { timestamp?: number });
    console.log("Notifications API: Notification created:");
    console.log(`  Title: "${notification.title}"`);
    console.log(`  Body: "${notification.body}"`);
    console.log(`  Tag: "${notification.tag}"`);

    // Step 5: Add event handlers to the notification
    notification.onclick = (event: Event) => {
      console.log("Notifications API: Notification clicked");
      console.log("  Event target:", event.target);
      window.focus(); // Focus the browser tab
      notification.close();
    };

    notification.onclose = () => {
      console.log("Notifications API: Notification closed/dismissed");
    };

    notification.onshow = () => {
      console.log("Notifications API: Notification displayed to user");
    };

    notification.onerror = (event: Event) => {
      console.error("Notifications API: Notification error:", event);
    };
  };

  const showRichNotification = () => {
    if (checkPermission() !== "granted") {
      console.warn("Notifications API: Permission not granted.");
      return;
    }

    // Step 6: Show a notification with actions (buttons)
    // Note: actions are only supported on some platforms (e.g., Windows, Android)
    // Both actions and vibrate are valid browser APIs but may not be typed
    const richOptions = {
      body: "This notification has action buttons.",
      icon: "https://picsum.photos/64",
      actions: [
        { action: "confirm", title: "Confirm" },
        { action: "cancel", title: "Cancel" },
      ] as Array<{ action: string; title: string }>,
      // vibration pattern for mobile: [vibrate, pause, vibrate, pause, ...] in ms
      vibrate: [200, 100, 200],
    };
    const notification = new Notification("Rich Notification", richOptions);
    console.log("Notifications API: Rich notification with actions created");
    console.log("  Actions:", (notification as any).actions?.map((a: { action: string }) => a.action));

    // Listen for notification action button clicks
    notification.addEventListener("notificationclick", (event) => {
      console.log(`Notifications API: Action clicked: "${(event as any).action}"`);
      notification.close();
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Notifications API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console to see results. Click buttons to trigger notifications. Requires permission.</p>
      </div>
      <div>
        <div>
          <span>Permission: {permission}</span>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={requestPermission}>Request Permission</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={showBasicNotification}>Show Basic Notification</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={showRichNotification}>Show Rich Notification</button>
        </div>
      </div>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" target="_blank" rel="noopener noreferrer">MDN: Notifications API</a>
    </main>
  );
}