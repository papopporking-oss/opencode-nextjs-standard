"use client";

import { useEffect, useState } from "react";

/**
 * Storage API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Storage
 *                https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 *                https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
 *
 * The Web Storage API provides two mechanisms for storing key-value
 * pairs in the browser: localStorage (persistent) and sessionStorage
 * (per-session/tab). Both store strings only.
 */
export default function Page() {
  const [localData, setLocalData] = useState<string>("");
  const [sessionData, setSessionData] = useState<string>("");
  const [storageLog, setStorageLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log("Storage API:", msg);
    setStorageLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // Step 1: Check Storage API support
    if (!window.localStorage || !window.sessionStorage) {
      console.error("Storage API: Not supported in this browser.");
      return;
    }
    console.log("Storage API: Supported ✓");
    console.log("  localStorage and sessionStorage both available");

    // Step 2: localStorage — persistent storage (survives browser restarts)
    // Data persists indefinitely until explicitly cleared
    // Storage limit: ~5-10MB per origin (varies by browser)

    // Step 3: localStorage.setItem(key, value) — store a string
    // Non-string values are auto-converted to string
    localStorage.setItem("demo-key", "Hello from localStorage!");
    console.log("Storage API: localStorage.setItem('demo-key', 'Hello from localStorage!') ✓");

    localStorage.setItem("demo-number", "42");
    console.log("Storage API: localStorage.setItem('demo-number', '42') ✓");

    // Step 4: Store objects/arrays by JSON serialization
    const demoObject = { name: "Demo User", role: "admin", timestamp: Date.now() };
    localStorage.setItem("demo-object", JSON.stringify(demoObject));
    console.log("Storage API: Object stored in localStorage as JSON string ✓");

    // Step 5: localStorage.getItem(key) — retrieve a value
    const value = localStorage.getItem("demo-key");
    console.log(`Storage API: localStorage.getItem('demo-key') = "${value}"`);

    // Step 6: Retrieve and parse object
    const objStr = localStorage.getItem("demo-object");
    const parsedObj = objStr ? JSON.parse(objStr) : null;
    console.log("Storage API: Parsed stored object:", parsedObj);

    // Step 7: localStorage.key(index) — get key name at position
    console.log(`Storage API: localStorage.length = ${localStorage.length} items`);
    const firstKey = localStorage.key(0);
    console.log(`Storage API: localStorage.key(0) = "${firstKey}"`);

    // Step 8: Enumerate all localStorage keys and values
    console.log("Storage API: All localStorage entries:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`  [${i}] "${key}" = "${localStorage.getItem(key)}"`);
      }
    }

    // Step 9: sessionStorage — per-session/tab storage
    // Data is cleared when the tab/browser is closed
    // Each tab gets its own independent sessionStorage
    sessionStorage.setItem("session-key", "Hello from sessionStorage!");
    sessionStorage.setItem("tab-id", `tab-${Math.random().toString(36).substring(2, 8)}`);
    console.log("Storage API: sessionStorage items set ✓");
    console.log(`  sessionStorage.length = ${sessionStorage.length}`);

    // Step 10: Storage event — listen for changes in OTHER tabs/windows
    // Only fires for localStorage changes from other documents of same origin
    // Does NOT fire in the tab that made the change
    window.addEventListener("storage", (event: StorageEvent) => {
      console.log("Storage API: storage event fired (from another tab/window):");
      console.log("  key:", event.key);
      console.log("  oldValue:", event.oldValue);
      console.log("  newValue:", event.newValue);
      console.log("  url:", event.url);
      console.log("  storageArea:", event.storageArea === localStorage ? "localStorage" : "sessionStorage");
      addLog(`storage event: key="${event.key}" changed from "${event.oldValue}" to "${event.newValue}"`);
    });
    console.log("Storage API: storage event listener registered ✓");

  }, []);

  const writeToLocalStorage = () => {
    // Step 11: Write a value with timestamp
    const timestamp = new Date().toISOString();
    localStorage.setItem("user-input", `Written at ${timestamp}`);
    console.log(`Storage API: Wrote to localStorage at ${timestamp}`);
    addLog(`localStorage: "user-input" set at ${timestamp}`);
    setLocalData(localStorage.getItem("user-input") ?? "");
  };

  const readFromLocalStorage = () => {
    const val = localStorage.getItem("user-input") ?? "(not set)";
    console.log(`Storage API: Read from localStorage: "${val}"`);
    addLog(`localStorage read: "${val}"`);
    setLocalData(val);
  };

  const removeFromLocalStorage = () => {
    // Step 12: localStorage.removeItem(key) — delete a single item
    localStorage.removeItem("user-input");
    console.log("Storage API: localStorage.removeItem('user-input') ✓");
    addLog("localStorage: 'user-input' removed");
    setLocalData("");
  };

  const clearLocalStorage = () => {
    // Step 13: localStorage.clear() — delete ALL items for this origin
    // Be careful: this removes everything, not just your app's data
    const count = localStorage.length;
    localStorage.clear();
    console.log(`Storage API: localStorage.clear() — ${count} item(s) removed ✓`);
    addLog(`localStorage: clear() — all ${count} items removed`);
  };

  const writeToSessionStorage = () => {
    const timestamp = new Date().toISOString();
    sessionStorage.setItem("demo-session", `Session write at ${timestamp}`);
    console.log(`Storage API: Session write at ${timestamp}`);
    addLog(`sessionStorage: "demo-session" set at ${timestamp}`);
    setSessionData(sessionStorage.getItem("demo-session") ?? "");
  };

  const readFromSessionStorage = () => {
    const val = sessionStorage.getItem("demo-session") ?? "(not set)";
    console.log(`Storage API: Session read: "${val}"`);
    addLog(`sessionStorage read: "${val}"`);
    setSessionData(val);
  };

  const storageQuotaEstimation = async () => {
    // Step 14: Estimate available storage quota (modern browsers)
    // navigator.storage.estimate() returns usage and quota info
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      console.log("Storage API: Storage estimate:");
      console.log("  Usage:", ((estimate.usage ?? 0) / 1048576).toFixed(2), "MB");
      console.log("  Quota:", ((estimate.quota ?? 0) / 1048576).toFixed(2), "MB");
      console.log("  Percent used:", estimate.quota && estimate.usage ? ((estimate.usage / estimate.quota) * 100).toFixed(1) + "%" : "N/A");
      addLog(`Storage quota — usage: ${((estimate.usage ?? 0) / 1048576).toFixed(2)} MB, quota: ${((estimate.quota ?? 0) / 1048576).toFixed(2)} MB`);
    } else {
      addLog("Storage quota estimation not supported");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Storage API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console to see storage operations. Open a second tab to test cross-tab storage events.</p>
      </div>
      <div>
        {/* localStorage section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">localStorage (Persistent)</h2>
          <p>Data persists until explicitly cleared</p>
          <p>Value: {localData || "(empty)"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={writeToLocalStorage}>Write</button>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={readFromLocalStorage}>Read</button>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={removeFromLocalStorage}>Remove</button>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={clearLocalStorage}>Clear All</button>
          </div>
        </div>

        {/* sessionStorage section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">sessionStorage (Per-Session)</h2>
          <p>Data cleared when tab closes. Each tab is independent.</p>
          <p>Value: {sessionData || "(empty)"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={writeToSessionStorage}>Write</button>
            <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={readFromSessionStorage}>Read</button>
          </div>
        </div>
      </div>

      <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={storageQuotaEstimation}>Check Storage Quota</button>

      {storageLog.length > 0 && (
        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm max-h-64 overflow-auto mt-3 font-mono">
          {storageLog.map((l, i) => <div key={i}>{l}</div>)}
        </pre>
      )}

      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Storage" target="_blank" rel="noopener noreferrer">MDN: Storage API</a>
    </main>
  );
}