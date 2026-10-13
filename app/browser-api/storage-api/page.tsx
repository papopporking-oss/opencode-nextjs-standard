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
    <main>
      <h1>Storage API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console to see storage operations. Open a second tab to test cross-tab storage events.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {/* localStorage section */}
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>localStorage (Persistent)</h2>
          <p style={{ fontSize: "12px", color: "#666" }}>Data persists until explicitly cleared</p>
          <p style={{ fontSize: "14px", wordBreak: "break-all", marginTop: "8px" }}>Value: {localData || "(empty)"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "12px" }}>
            <button onClick={writeToLocalStorage}>Write</button>
            <button onClick={readFromLocalStorage}>Read</button>
            <button onClick={removeFromLocalStorage} style={{ color: "#e74c3c" }}>Remove</button>
            <button onClick={clearLocalStorage} style={{ color: "#e67e22" }}>Clear All</button>
          </div>
        </div>

        {/* sessionStorage section */}
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>sessionStorage (Per-Session)</h2>
          <p style={{ fontSize: "12px", color: "#666" }}>Data cleared when tab closes. Each tab is independent.</p>
          <p style={{ fontSize: "14px", wordBreak: "break-all", marginTop: "8px" }}>Value: {sessionData || "(empty)"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "12px" }}>
            <button onClick={writeToSessionStorage}>Write</button>
            <button onClick={readFromSessionStorage}>Read</button>
          </div>
        </div>
      </div>

      <button onClick={storageQuotaEstimation} style={{ marginBottom: "12px" }}>Check Storage Quota</button>

      {storageLog.length > 0 && (
        <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "200px", overflow: "auto" }}>
          {storageLog.map((l, i) => <div key={i}>{l}</div>)}
        </pre>
      )}

      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage" target="_blank" rel="noopener noreferrer">MDN: Storage API</a>
    </main>
  );
}