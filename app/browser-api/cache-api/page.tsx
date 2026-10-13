"use client";

import { useEffect, useState } from "react";

/**
 * Cache API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Cache
 *                https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
 *
 * The Cache API provides a storage mechanism for Request/Response
 * object pairs. It is commonly used by Service Workers but is also
 * available in the main thread via window.caches.
 *
 * ⚠️ Requires secure context (HTTPS or localhost).
 */
export default function Page() {
  const [cacheStatus, setCacheStatus] = useState<string>("Checking...");
  const [cachedUrls, setCachedUrls] = useState<string[]>([]);

  useEffect(() => {
    // Step 1: Check Cache API support
    if (!window.caches) {
      console.error("Cache API: Not supported. Requires secure context.");
      setCacheStatus("Not supported — requires HTTPS/localhost");
      return;
    }
    console.log("Cache API: Supported ✓");
    console.log("  caches available on window");

    // Step 2: caches.open(name) — open or create a named cache
    // Returns a Promise that resolves to a Cache object
    const cacheName = "demo-cache-v1";
    console.log(`Cache API: Opening cache "${cacheName}"...`);
    setCacheStatus("Opening cache...");

    window.caches.open(cacheName).then((cache: Cache) => {
      console.log(`Cache API: Cache "${cacheName}" opened successfully ✓`);
      setCacheStatus(`Cache "${cacheName}" open`);

      // Step 3: cache.add(url) — fetch a URL and add the response to cache
      // Equivalent to fetch(url) then cache.put(request, response)
      console.log("Cache API: cache.add() — Fetching and caching URL...");
      cache.add("https://jsonplaceholder.typicode.com/posts/1").then(() => {
        console.log("Cache API: URL added to cache via cache.add() ✓");
      }).catch((err: Error) => {
        console.error("Cache API: cache.add() failed:", err.message);
      });

      // Step 4: cache.put(request, response) — manually store a Request/Response pair
      const customRequest = new Request("/api/custom-endpoint");
      const customResponse = new Response(
        JSON.stringify({ cached: true, timestamp: Date.now() }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "X-Cached": "true" },
        }
      );
      cache.put(customRequest, customResponse).then(() => {
        console.log("Cache API: Custom Request/Response added via cache.put() ✓");
      });

      // Step 5: cache.match(request) — find a cached response matching a request
      console.log("Cache API: Searching cache with cache.match()...");
      cache.match("https://jsonplaceholder.typicode.com/posts/1").then((response) => {
        if (response) {
          console.log("Cache API: Match found ✓");
          console.log(`  Status: ${response.status}`);
          console.log(`  Content-Type: ${response.headers.get("Content-Type")}`);
          // Read the response body (clone first since body can only be consumed once)
          response.clone().json().then((data) => {
            console.log("Cache API: Cached response body:", data);
          });
        } else {
          console.log("Cache API: No match found for this URL.");
        }
      });

      // Step 6: cache.matchAll(request, options) — get all matching responses
      cache.matchAll().then((responses) => {
        console.log(`Cache API: cache.matchAll() found ${responses.length} total entry(s)`);
      });

      // Step 7: cache.keys() — enumerate all cached request URLs
      cache.keys().then((requests) => {
        const urls = requests.map((r) => r.url);
        console.log(`Cache API: cache.keys() returned ${urls.length} URL(s):`);
        urls.forEach((url, i) => console.log(`  [${i}] ${url}`));
        setCachedUrls(urls);
      });

      // Step 8: cache.delete(request) — remove a specific entry
      cache.delete(customRequest).then((deleted) => {
        console.log(`Cache API: Custom entry deleted: ${deleted}`);
      });

    }).catch((err: Error) => {
      console.error("Cache API: Error opening cache:", err.message);
      setCacheStatus("Error opening cache");
    });

    // Step 9: caches.has(name) — check if a named cache exists
    window.caches.has("demo-cache-v2").then((exists) => {
      console.log(`Cache API: caches.has("demo-cache-v2") = ${exists}`);
    });

    // Step 10: caches.keys() — list all cache names
    window.caches.keys().then((names) => {
      console.log(`Cache API: All cache names: [${names.join(", ")}]`);
    });

    // Step 11: caches.delete(name) — delete an entire cache
    // Uncomment to test:
    // window.caches.delete("demo-cache-v1").then((deleted) => {
    //   console.log(`Cache API: Cache "demo-cache-v1" deleted: ${deleted}`);
    // });
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Cache API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console. Requires secure context. Cache operations are logged to console.</p>
      </div>
      <div>
        <p className="mb-3">Status: <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{cacheStatus}</span></p>
        {cachedUrls.length > 0 && (
          <div>
            <p>Cached URLs:</p>
            <ul>
              {cachedUrls.map((url, i) => <li key={i}>{url}</li>)}
            </ul>
          </div>
        )}
      </div>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Cache" target="_blank" rel="noopener noreferrer">MDN: Cache API</a>
    </main>
  );
}