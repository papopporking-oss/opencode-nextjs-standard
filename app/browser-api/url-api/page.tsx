"use client";

import { useEffect, useState } from "react";

/**
 * URL API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/URL
 *                https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 *                https://developer.mozilla.org/en-US/docs/Web/API/URL_API
 *
 * The URL API provides a standardized way to parse, construct,
 * normalize, and manipulate URLs. It includes the URL constructor
 * and the URLSearchParams interface for query string handling.
 */
export default function Page() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log("URL API:", msg);
    setLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // Step 1: Check URL API support
    if (!window.URL || !window.URLSearchParams) {
      console.error("URL API: Not supported in this browser.");
      return;
    }
    console.log("URL API: Supported ✓");
    console.log("  URL and URLSearchParams available on window");
  }, []);

  const parseURL = () => {
    addLog("--- URL Parsing ---");

    // Step 2: new URL(urlString, base?) — parse a full URL
    // Throws TypeError if invalid
    const url = new URL("https://user:pass@example.com:8080/path/to/page?query=hello&lang=en#section");
    console.log("URL API: Parsed URL:", url.href);

    // Step 3: URL components (all read/write)
    console.log("URL API: URL components:");
    console.log("  protocol:", url.protocol);   // "https:"
    console.log("  username:", url.username);   // "user"
    console.log("  password:", url.password);   // "pass"
    console.log("  hostname:", url.hostname);   // "example.com"
    console.log("  port:", url.port);           // "8080"
    console.log("  host:", url.host);           // "example.com:8080" (hostname + port)
    console.log("  pathname:", url.pathname);   // "/path/to/page"
    console.log("  search:", url.search);       // "?query=hello&lang=en"
    console.log("  hash:", url.hash);           // "#section"
    console.log("  origin:", url.origin);       // "https://example.com:8080" (read-only)
    console.log("  href:", url.href);           // Full URL (computed from other parts)

    addLog(`URL: ${url.origin}${url.pathname}`);
    addLog(`Components: hostname=${url.hostname}, port=${url.port}`);

    // Step 4: Modify URL components
    url.protocol = "http:";
    url.port = "3000";
    url.pathname = "/new-path";
    console.log("URL API: Modified URL:", url.href);
    addLog(`Modified: ${url.href}`);

    // Step 5: Resolve relative URL — prefer new URL(relative, base)
    // URL.resolve is a legacy non-standard method, not in TS types
    const resolvedUrl = new URL("../other", "https://example.com/base/");
    console.log("URL API: Resolved relative URL:", resolvedUrl.href);

    // Step 6: Relative URL with base
    const relativeUrl = new URL("/api/users?page=1", "https://myapp.com");
    console.log("URL API: Relative URL with base:", relativeUrl.href);
    addLog(`Relative: ${relativeUrl.href}`);
  };

  const urlSearchParams = () => {
    addLog("--- URLSearchParams ---");

    // Step 7: new URLSearchParams() — parse/manipulate query strings
    const params = new URLSearchParams("query=hello&lang=en&page=1&sort=desc");
    console.log("URL API: URLSearchParams created:", params.toString());

    // Step 8: params.get(key) — get the first value for a key
    console.log("  get('query'):", params.get("query"));     // "hello"
    console.log("  get('lang'):", params.get("lang"));       // "en"
    console.log("  get('missing'):", params.get("missing")); // null

    // Step 9: params.getAll(key) — get ALL values for a key
    // Useful for duplicate keys: ?tag=a&tag=b&tag=c
    const multiParams = new URLSearchParams("tag=a&tag=b&tag=c");
    console.log("  getAll('tag'):", multiParams.getAll("tag")); // ["a", "b", "c"]

    // Step 10: params.has(key) — check if key exists
    console.log("  has('query'):", params.has("query"));   // true
    console.log("  has('missing'):", params.has("missing")); // false

    // Step 11: params.set(key, value) — set/replace value
    params.set("lang", "th");
    console.log("  After set('lang', 'th'):", params.toString());

    // Step 12: params.append(key, value) — add another value for same key
    params.append("tag", "featured");
    params.append("tag", "new");
    console.log("  After append('tag', 'featured') + 'new':", params.toString());
    console.log("  getAll('tag'):", params.getAll("tag"));

    // Step 13: params.delete(key) — remove a key and all its values
    params.delete("sort");
    console.log("  After delete('sort'):", params.toString());

    // Step 14: params.sort() — sort keys alphabetically
    params.sort();
    console.log("  After sort():", params.toString());

    // Step 15: Iterate over params
    console.log("URL API: Iterating params:");
    params.forEach((value, key) => {
      console.log(`  ${key} = ${value}`);
    });

    // entries() iterator
    for (const [key, value] of params.entries()) {
      console.log(`  entries: ${key} → ${value}`);
    }

    addLog(`URLSearchParams: ${params.toString()}`);

    // Step 16: URLSearchParams from a URL's search
    const url = new URL("https://api.example.com/data?page=1&limit=10&filter=active");
    const searchParams = url.searchParams; // Direct access to URL's params
    console.log("URL API: URL.searchParams:", searchParams.toString());
    addLog(`URL search: ${url.search}`);
    addLog(`Parsed params: page=${searchParams.get("page")}, limit=${searchParams.get("limit")}`);
  };

  const constructURL = () => {
    addLog("--- URL Construction ---");

    // Step 17: Build URLs programmatically
    const baseURL = "https://api.example.com/v1";

    // Build search params from an object
    const queryData = {
      search: "next.js",
      page: "1",
      limit: "20",
      sortBy: "date",
    };

    // Step 18: Construct URLSearchParams from object entries
    const params = new URLSearchParams();
    Object.entries(queryData).forEach(([key, value]) => {
      params.set(key, value);
    });

    // Step 19: Combine base URL with path and params
    const url = new URL(`${baseURL}/posts`);
    url.search = params.toString();
    // Or equivalently: url.searchParams.set(key, value) for each

    console.log("URL API: Constructed URL:", url.href);
    addLog(`Constructed: ${url.href}`);

    // Step 20: URL.createObjectURL(blob) — create blob URL
    const blob = new Blob(["Some content"], { type: "text/plain" });
    const objectUrl = URL.createObjectURL(blob);
    console.log("URL API: createObjectURL:", objectUrl);
    addLog(`Object URL: ${objectUrl.substring(0, 40)}...`);

    // Step 21: URL.revokeObjectURL(url) — free memory
    URL.revokeObjectURL(objectUrl);
    console.log("URL API: revokeObjectURL called ✓");
    addLog("Object URL revoked ✓");
  };

  const urlValidation = () => {
    addLog("--- URL Validation ---");

    // Step 22: Validate URLs with try-catch
    const testUrls = [
      "https://valid.com/page",
      "not-a-url",
      "http://missing-tld",
      "ftp://ftp.example.com/files",
      "//protocol-relative.com",
    ];

    testUrls.forEach((input) => {
      try {
        const url = new URL(input);
        console.log(`URL API: ✓ Valid: "${input}" → ${url.href}`);
        addLog(`✓ "${input}"`);
      } catch (err) {
        console.log(`URL API: ✗ Invalid: "${input}" — ${(err as Error).message}`);
        addLog(`✗ "${input}"`);
      }
    });

    // Step 23: URL.canParse(urlString, base?) — static method (newer browsers)
    // Returns boolean instead of throwing
    if (URL.canParse) {
      console.log("URL API: URL.canParse available ✓");
      console.log("  canParse('https://ok.com'):", URL.canParse("https://ok.com"));
      console.log("  canParse('not-a-url'):", URL.canParse("not-a-url"));
      addLog(`URL.canParse supported: ✓`);
    } else {
      addLog("URL.canParse not supported in this browser");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">URL API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console to see URL parsing, construction, and URLSearchParams manipulation.</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={parseURL}>Parse URL</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={urlSearchParams}>URLSearchParams</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={constructURL}>Construct URL</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={urlValidation}>Validate URLs</button>
        </div>
        {log.length > 0 && (
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm max-h-64 overflow-auto mt-3 font-mono">
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </pre>
        )}
      </div>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/URL" target="_blank" rel="noopener noreferrer">MDN: URL API</a>
    </main>
  );
}