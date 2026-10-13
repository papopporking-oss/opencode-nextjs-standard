"use client";

import { useEffect, useState } from "react";

/**
 * Web Locks API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/LockManager
 *                https://developer.mozilla.org/en-US/docs/Web/API/Lock
 *
 * The Web Locks API provides a mechanism for coordinating access
 * to shared resources across tabs, windows, and workers of the
 * same origin. It prevents race conditions without polling.
 *
 * ⚠️ Requires secure context (HTTPS or localhost).
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Ready");
  const [lockLog, setLockLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log("Web Locks API:", msg);
    setLockLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // Step 1: Check Web Locks API support
    if (!navigator.locks) {
      console.error("Web Locks API: Not supported. Requires secure context (HTTPS/localhost).");
      setStatus("Not supported — requires HTTPS/localhost");
      return;
    }
    console.log("Web Locks API: Supported ✓");
    console.log("  navigator.locks is available");
  }, []);

  const basicLock = async () => {
    if (!navigator.locks) return;
    setStatus("Acquiring lock...");
    addLog("--- Basic Lock Demo ---");

    // Step 2: navigator.locks.request(name, callback) — acquire a lock
    // The callback runs when the lock is acquired and releases it when done
    await navigator.locks.request("demo-lock", async (lock) => {
      // Step 3: Inside the callback, we hold the lock
      // lock.name = the lock name
      // lock.mode = "exclusive" (default) or "shared"
      if (!lock) { addLog("Lock is null"); return; }
      addLog(`Lock acquired: name="${lock.name}", mode="${lock.mode}" ✓`);

      // Step 4: Perform work that requires exclusive access
      // For example: read shared state, modify it, write it back
      addLog("Performing critical section work...");

      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog("Critical section work completed");

      // Step 5: Lock is automatically released when the callback resolves
      // No explicit unlock needed — async callback return = release
    });

    addLog("Lock released (callback resolved) ✓");
    setStatus("Lock released");
  };

  const sharedLock = async () => {
    if (!navigator.locks) return;
    setStatus("Acquiring shared lock...");
    addLog("--- Shared Lock Demo ---");

    // Step 6: Request a shared lock — multiple readers can hold simultaneously
    // Shared locks allow concurrent access for read-only operations
    await navigator.locks.request("demo-lock", { mode: "shared" }, async (lock) => {
      if (!lock) { addLog("Lock is null"); return; }
      addLog(`Shared lock acquired: name="${lock.name}", mode="${lock.mode}" ✓`);
      addLog("Other shared lock holders can also read concurrently");

      // Step 7: Read shared state (safe because no writer can hold lock)
      await new Promise((resolve) => setTimeout(resolve, 500));
      addLog("Shared read completed");
    });

    addLog("Shared lock released ✓");
    setStatus("Shared lock released");
  };

  const exclusiveLockWithCondition = async () => {
    if (!navigator.locks) return;
    setStatus("Acquiring conditional lock...");
    addLog("--- Conditional Lock Demo ---");

    // Step 8: Request with signal — abort waiting for a lock
    // Use AbortController to cancel lock requests that take too long
    const controller = new AbortController();

    // Set a timeout: if we can't get the lock in 2 seconds, abort
    const timeoutId = setTimeout(() => {
      controller.abort();
      addLog("Abort signal sent (2s timeout)");
    }, 2000);

    // Step 9: navigator.locks.request with signal option
    // If the lock is held by another tab, this waits until released or aborted
    await navigator.locks.request(
      "demo-lock",
      { signal: controller.signal }, // AbortSignal
      async (lock) => {
        if (!lock) { addLog("Lock is null"); return; }
        addLog(`Conditional lock acquired: "${lock.name}" ✓`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    ).catch((err) => {
      // Step 10: Handle lock request failure (e.g., aborted)
      if (err.name === "AbortError") {
        addLog("Lock request aborted (timeout) ✗");
      } else {
        addLog(`Lock request error: ${err.message}`);
      }
    }).finally(() => {
      clearTimeout(timeoutId);
    });

    setStatus("Conditional lock complete");
  };

  const queryLocks = async () => {
    if (!navigator.locks) return;
    addLog("--- Query Locks ---");

    // Step 11: navigator.locks.query() — snapshot of current lock state
    const snapshot = await navigator.locks.query();
    console.log("Web Locks API: Lock state snapshot:", snapshot);

    // Step 12: Inspect held locks
    addLog(`Held locks: ${snapshot.held?.length ?? 0}`);
    if (snapshot.held) {
      snapshot.held.forEach((lockInfo) => {
        addLog(`  Held: name="${lockInfo.name}", mode="${lockInfo.mode}"`);
        console.log(`  Lock info:`, lockInfo);
      });
    }

    // Step 13: Inspect pending lock requests (waiting to acquire)
    addLog(`Pending lock requests: ${snapshot.pending?.length ?? 0}`);
    if (snapshot.pending) {
      snapshot.pending.forEach((lockInfo) => {
        addLog(`  Pending: name="${lockInfo.name}", mode="${lockInfo.mode}"`);
      });
    }
  };

  const crossTabDemo = async () => {
    if (!navigator.locks) return;
    addLog("--- Cross-Tab Sync Demo ---");

    // Step 14: Use locks to coordinate across tabs
    // Each tab locks, writes to localStorage, then unlocks
    await navigator.locks.request("cross-tab-counter", async (lock) => {
      addLog("Cross-tab lock acquired for shared counter");

      // Step 15: Read shared state (localStorage as placeholder for shared resource)
      const rawValue = localStorage.getItem("web-locks-demo-counter");
      const currentValue = rawValue ? parseInt(rawValue, 10) : 0;
      addLog(`Current counter value (shared): ${currentValue}`);

      // Step 16: Modify and write back while holding the lock
      const newValue = currentValue + 1;
      localStorage.setItem("web-locks-demo-counter", newValue.toString());
      addLog(`Counter updated: ${currentValue} → ${newValue} (atomic across tabs)`);

      // Simulate some processing time
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    addLog("Cross-tab lock released ✓");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Web Locks API</h1>
      <div className="alert alert-warning mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>Requires secure context (HTTPS/localhost). Open DevTools Console. Locks coordinate across tabs of same origin.</span>
      </div>
      <div className="space-y-4">
        <p>Status: <span className="badge badge-outline">{status}</span></p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={basicLock}>Acquire Exclusive Lock</button>
          <button className="btn btn-secondary" onClick={sharedLock}>Acquire Shared Lock</button>
          <button className="btn btn-accent" onClick={exclusiveLockWithCondition}>Conditional Lock</button>
          <button className="btn btn-ghost" onClick={queryLocks}>Query Locks</button>
          <button className="btn btn-outline" onClick={crossTabDemo}>Cross-Tab Counter</button>
        </div>
        {lockLog.length > 0 && (
          <div className="mockup-code"><pre className="px-4 py-2 text-sm max-h-64 overflow-y-auto">{lockLog.map((l, i) => <div key={i}>{l}</div>)}</pre></div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Web Locks API</a>
    </main>
  );
}