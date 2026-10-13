"use client";

import { useEffect, useState } from "react";

/**
 * Web Workers API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * Web Workers run scripts in background threads separate from the
 * main UI thread. They enable heavy computation without blocking
 * the page. Communication happens via postMessage/onmessage.
 *
 * ⚠️ Workers cannot access the DOM, window, or parent page's context.
 *    They communicate only through message passing.
 */
export default function Page() {
  const [workerStatus, setWorkerStatus] = useState<string>("Not started");
  const [workerResults, setWorkerResults] = useState<string[]>([]);

  const runDedicatedWorker = () => {
    // Step 1: Check Web Worker support
    if (!window.Worker) {
      console.error("Web Workers API: Not supported in this browser.");
      setWorkerStatus("Not supported");
      return;
    }
    console.log("Web Workers API: Supported ✓");

    // Step 2: Create an inline Worker using Blob URL
    // In production, you'd use: new Worker("/worker.js")
    // Blob URL approach lets us define the worker inline for this demo
    const workerCode = `
      // ===== Worker Context (separate thread, no DOM access) =====

      // Step 3: self.onmessage — receive messages from the main thread
      self.onmessage = function(event) {
        // Step 4: Extract data from the message event
        // event.data contains whatever the main thread sent
        const data = event.data;
        console.log('[Worker] Message received from main thread:', data);

        if (data.type === 'compute') {
          // Step 5: Perform heavy computation (blocking only in this thread)
          // This would freeze the main thread if done there
          const start = performance.now();

          // Simulate CPU-intensive work: calculate prime numbers
          const primes = [];
          const limit = data.limit || 10000;
          for (let num = 2; num <= limit; num++) {
            let isPrime = true;
            for (let div = 2; div <= Math.sqrt(num); div++) {
              if (num % div === 0) { isPrime = false; break; }
            }
            if (isPrime) primes.push(num);
          }

          const elapsed = performance.now() - start;

          // Step 6: self.postMessage — send results back to main thread
          self.postMessage({
            type: 'compute-result',
            primesCount: primes.length,
            lastPrimes: primes.slice(-5), // Last 5 primes found
            elapsed: elapsed.toFixed(2),
            timestamp: Date.now(),
          });
        } else if (data.type === 'echo') {
          // Simple echo for demonstration
          self.postMessage({ type: 'echo-result', message: data.message });
        }
      };

      // Step 7: self.onerror — handle errors in the worker
      self.onerror = function(error) {
        console.error('[Worker] Error:', error.message);
        self.postMessage({ type: 'error', message: error.message });
      };

      // Worker is ready
      self.postMessage({ type: 'ready' });
    `;

    // Create Blob and URL for the inline worker
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    console.log(`Web Workers API: Worker URL created: ${workerUrl}`);

    // Step 8: Create the Worker instance
    const worker = new Worker(workerUrl);
    console.log("Web Workers API: Dedicated worker created ✓");
    setWorkerStatus("Worker created");

    // Step 9: worker.onmessage — handle messages FROM the worker
    worker.onmessage = (event: MessageEvent) => {
      console.log("Web Workers API: Message received from worker:", event.data);
      setWorkerResults((prev) => [...prev, JSON.stringify(event.data)]);

      if (event.data.type === "ready") {
        setWorkerStatus("Worker ready");
      } else if (event.data.type === "compute-result") {
        console.log(`  Found ${event.data.primesCount} primes in ${event.data.elapsed}ms`);
        console.log(`  Last 5 primes: [${event.data.lastPrimes.join(", ")}]`);
        setWorkerStatus(`Computed ${event.data.primesCount} primes in ${event.data.elapsed}ms`);
      }
    };

    // Step 10: worker.onerror — handle worker errors
    worker.onerror = (event: ErrorEvent) => {
      console.error("Web Workers API: Worker error:", event.message, "at line", event.lineno);
      setWorkerStatus("Worker error");
    };

    // Step 11: worker.onmessageerror — handle deserialization failures
    worker.onmessageerror = (event: MessageEvent) => {
      console.error("Web Workers API: Message could not be deserialized:", event);
    };

    // Step 12: Send a message TO the worker — heavy computation
    console.log("Web Workers API: Sending compute task to worker (limit=50000)...");
    worker.postMessage({ type: "compute", limit: 50000 });

    // Step 13: Send another message — echo test
    setTimeout(() => {
      console.log("Web Workers API: Sending echo message to worker...");
      worker.postMessage({ type: "echo", message: "Hello from main thread!" });
    }, 1000);

    // Step 14: Terminate the worker after tasks complete
    setTimeout(() => {
      console.log("Web Workers API: Terminating worker...");
      worker.terminate(); // Immediately stops worker execution
      // After terminate(), worker is unusable
      console.log("Web Workers API: Worker terminated ✓");
      URL.revokeObjectURL(workerUrl);
      console.log("Web Workers API: Worker URL revoked ✓");
      setWorkerStatus("Worker terminated");
    }, 5000);
  };

  const runSharedWorkerDemo = () => {
    // Step 15: Shared Worker — shared across multiple tabs/windows
    // Same origin only, accessible from multiple browsing contexts
    if (!window.SharedWorker) {
      console.log("Web Workers API: SharedWorker not supported (requires newer browser).");
      return;
    }

    const sharedWorkerCode = `
      // Shared workers can have multiple connections
      self.onconnect = function(event) {
        const port = event.ports[0];

        port.onmessage = function(msgEvent) {
          console.log('[SharedWorker] Received:', msgEvent.data);
          port.postMessage('SharedWorker echo: ' + msgEvent.data);
        };

        port.start(); // Start receiving messages on this port
      };
    `;

    const blob = new Blob([sharedWorkerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);

    const sharedWorker = new SharedWorker(url);
    console.log("Web Workers API: Shared worker created ✓");

    // Shared workers use port for communication
    sharedWorker.port.onmessage = (event: MessageEvent) => {
      console.log("Web Workers API: Shared worker response:", event.data);
      setWorkerResults((prev) => [...prev, `Shared: ${event.data}`]);
    };

    sharedWorker.port.postMessage("Ping from main thread");
    console.log("Web Workers API: Message sent to shared worker");

    // Always start the port
    sharedWorker.port.start();
  };

  return (
    <main>
      <h1>Web Workers API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console. Worker runs in a separate thread. Console.log from workers appears in browser console.</p>
      </div>
      <div>
        <p>Status: <span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}>{workerStatus}</span></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          <button onClick={runDedicatedWorker}>Run Dedicated Worker</button>
          <button onClick={runSharedWorkerDemo}>Run Shared Worker</button>
        </div>
        {workerResults.length > 0 && (
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "200px", overflow: "auto", marginTop: "12px" }}>
            {workerResults.map((r, i) => <div key={i}>{r}</div>)}
          </pre>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" rel="noopener noreferrer">MDN: Web Workers API</a>
    </main>
  );
}