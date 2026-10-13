"use client";

import { useEffect, useState } from "react";

/**
 * Performance API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Performance
 *                https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
 *
 * The Performance API provides high-precision timing information
 * for measuring web application performance. It includes navigation
 * timing, resource timing, and user-defined marks/measures.
 */
export default function Page() {
  const [metrics, setMetrics] = useState<string[]>([]);

  useEffect(() => {
    // Step 1: Check Performance API support
    if (!window.performance) {
      console.error("Performance API: Not supported in this browser.");
      return;
    }
    console.log("Performance API: Supported ✓");
    console.log("  window.performance is available");

    // Step 2: performance.now() — high-resolution timestamp in milliseconds
    // Returns time since time origin with microsecond precision
    // More precise and monotonic than Date.now() (not affected by system clock changes)
    const now = performance.now();
    console.log(`Performance API: performance.now() = ${now.toFixed(4)} ms since time origin`);

    // Step 3: performance.timeOrigin — the UNIX timestamp of the time origin
    // Useful for converting relative times to absolute timestamps
    console.log(`Performance API: timeOrigin = ${performance.timeOrigin} (${new Date(performance.timeOrigin).toISOString()})`);

    // Step 4: Navigation Timing API — timing of page load
    // PerformanceNavigationTiming provides detailed page load metrics
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0) {
      const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
      console.log("Performance API: Navigation Timing:");
      console.log("  Type:", navTiming.type); // navigate, reload, back_forward, prerender
      console.log("  Redirect count:", navTiming.redirectCount);
      console.log("  DNS lookup:", (navTiming.domainLookupEnd - navTiming.domainLookupStart).toFixed(2), "ms");
      console.log("  TCP connect:", (navTiming.connectEnd - navTiming.connectStart).toFixed(2), "ms");
      console.log("  TLS handshake:", (navTiming.secureConnectionStart > 0 ? (navTiming.connectEnd - navTiming.secureConnectionStart).toFixed(2) : "N/A"), "ms");
      console.log("  Request:", (navTiming.responseStart - navTiming.requestStart).toFixed(2), "ms");
      console.log("  Response:", (navTiming.responseEnd - navTiming.responseStart).toFixed(2), "ms");
      console.log("  DOM processing:", (navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart).toFixed(2), "ms");
      console.log("  DOM complete:", (navTiming.domComplete - navTiming.domContentLoadedEventEnd).toFixed(2), "ms");
      console.log("  Load event:", (navTiming.loadEventEnd - navTiming.loadEventStart).toFixed(2), "ms");
      console.log("  Total load time:", (navTiming.loadEventEnd - navTiming.startTime).toFixed(2), "ms");
    }

    // Step 5: Resource Timing API — timing for each resource loaded
    const resourceEntries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    console.log(`Performance API: ${resourceEntries.length} resource timing entries`);
    if (resourceEntries.length > 0) {
      console.log("  Sample resources (first 3):");
      resourceEntries.slice(0, 3).forEach((entry, i) => {
        console.log(`    [${i}] ${entry.name} — duration: ${entry.duration.toFixed(2)}ms, transfer: ${entry.transferSize} bytes`);
      });
    }

    // Step 6: Paint Timing API — First Paint and First Contentful Paint
    const paintEntries = performance.getEntriesByType("paint");
    paintEntries.forEach((entry) => {
      console.log(`Performance API: Paint — ${entry.name}: ${entry.startTime.toFixed(2)} ms`);
    });

    // Step 7: User-defined marks — create named timestamps
    performance.mark("demo-start");
    console.log("Performance API: Mark 'demo-start' created ✓");

    // Simulate some work
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.sqrt(i);
    }

    performance.mark("demo-end");
    console.log("Performance API: Mark 'demo-end' created ✓");

    // Step 8: User-defined measures — calculate duration between marks
    performance.measure("demo-duration", "demo-start", "demo-end");
    const measureEntries = performance.getEntriesByName("demo-duration", "measure");
    if (measureEntries.length > 0) {
      const duration = measureEntries[0].duration;
      console.log(`Performance API: Measure 'demo-duration' = ${duration.toFixed(4)} ms`);
    }

    // Step 9: Memory info (Chrome only — non-standard)
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      console.log("Performance API: Memory info (Chrome):");
      console.log("  JS heap size limit:", (memory.jsHeapSizeLimit / 1048576).toFixed(2), "MB");
      console.log("  Total JS heap size:", (memory.totalJSHeapSize / 1048576).toFixed(2), "MB");
      console.log("  Used JS heap size:", (memory.usedJSHeapSize / 1048576).toFixed(2), "MB");
    }

    // Step 10: PerformanceObserver — watch for new performance entries
    // More efficient than polling getEntriesByType()
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`Performance API: Observer — ${entry.entryType}/${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      });
    });

    // Step 11: Configure which entry types to observe
    observer.observe({
      entryTypes: ["mark", "measure", "resource", "largest-contentful-paint", "layout-shift"],
      buffered: true, // Include entries that occurred before observer was created
    });
    console.log("Performance API: PerformanceObserver started — watching mark, measure, resource, LCP, CLS");

    // Step 12: Long Tasks API (if available) — detect tasks > 50ms
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`Performance API: Long task detected — duration: ${entry.duration.toFixed(2)}ms`);
        });
      });
      longTaskObserver.observe({ type: "longtask", buffered: true });
      console.log("Performance API: Long task observer started ✓");
    } catch {
      console.log("Performance API: Long task observer not supported in this browser");
    }

    // Step 13: Cleanup marks and measures
    return () => {
      observer.disconnect();
      performance.clearMarks("demo-start");
      performance.clearMarks("demo-end");
      performance.clearMeasures("demo-duration");
      console.log("Performance API: Marks and measures cleaned up ✓");
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Performance API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Open DevTools Console to see timing metrics, marks, measures, and resource timings.</span>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-base-content/60">Navigation, resource, paint timings + user-defined marks/measures are logged in console.</p>
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Performance API</a>
    </main>
  );
}