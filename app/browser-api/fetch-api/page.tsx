"use client";

import { useState } from "react";

/**
 * Fetch API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/fetch
 *                https://developer.mozilla.org/en-US/docs/Web/API/Request
 *
 * The Fetch API provides a modern interface for making HTTP requests.
 * It replaces XMLHttpRequest with a cleaner Promise-based API.
 * The global fetch() method is available on window and in Web Workers.
 */
export default function Page() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<string>("");

  const addResult = (msg: string) => {
    console.log("Fetch API:", msg);
    setResults((prev) => [...prev, msg]);
  };

  const basicGet = async () => {
    setLoading("GET request...");
    addResult("--- Basic GET Request ---");

    // Step 1: fetch(url) — make a GET request (the default method)
    // Returns a Promise that resolves to a Response object
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    console.log("Fetch API: Response object:", response);

    // Step 2: Inspect response properties
    console.log("Fetch API: Response properties:");
    console.log("  ok:", response.ok); // true if status 200-299
    console.log("  status:", response.status); // HTTP status code
    console.log("  statusText:", response.statusText); // Status text (e.g., "OK")
    console.log("  redirected:", response.redirected); // Was the request redirected?
    console.log("  type:", response.type); // "basic", "cors", "opaque", etc.
    console.log("  url:", response.url); // Final URL after redirects

    // Step 3: Inspect response headers
    console.log("Fetch API: Response headers:");
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    addResult(`GET /posts/1 — status: ${response.status} ${response.statusText}`);

    // Step 4: Parse response body as JSON
    // Other methods: .text(), .blob(), .arrayBuffer(), .formData()
    const data = await response.json();
    console.log("Fetch API: Parsed JSON data:", data);
    addResult(`User ID: ${data.userId}, Title: "${data.title.substring(0, 40)}..."`);

    setLoading("");
  };

  const postRequest = async () => {
    setLoading("POST request...");
    addResult("--- POST Request ---");

    // Step 5: fetch with method: "POST"
    // Second argument is an init object configuring the request
    const payload = {
      title: "Fetch API Demo Post",
      body: "This post was created via the Fetch API",
      userId: 1,
    };

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // HTTP method: GET, POST, PUT, DELETE, PATCH, etc.

      // Step 6: Set request headers
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Custom headers (for CORS, server must allow these via Access-Control-Allow-Headers):
        "X-Custom-Header": "demo-value",
      },

      // Step 7: Set request body
      // Body types: string, FormData, Blob, ArrayBuffer, URLSearchParams
      body: JSON.stringify(payload),
    });

    console.log("Fetch API: POST response status:", response.status);
    console.log("Fetch API: POST request headers:", [...(response.headers as any).entries()]);
    addResult(`POST /posts — status: ${response.status}`);

    const created = await response.json();
    console.log("Fetch API: Created resource:", created);
    addResult(`Created: ID=${created.id}, Title="${created.title}"`);

    setLoading("");
  };

  const putRequest = async () => {
    setLoading("PUT request...");
    addResult("--- PUT Request ---");

    // Step 8: PUT request — replace entire resource
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 1, title: "Updated Title", body: "Updated body", userId: 1 }),
    });

    const updated = await response.json();
    console.log("Fetch API: PUT result:", updated);
    addResult(`PUT /posts/1 — status: ${response.status}, title updated to "${updated.title}"`);
    setLoading("");
  };

  const deleteRequest = async () => {
    setLoading("DELETE request...");
    addResult("--- DELETE Request ---");

    // Step 9: DELETE request — remove a resource
    const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "DELETE",
    });

    console.log("Fetch API: DELETE status:", response.status);
    addResult(`DELETE /posts/1 — status: ${response.status}`);
    setLoading("");
  };

  const errorHandling = async () => {
    setLoading("Error handling...");
    addResult("--- Error Handling ---");

    // Step 10: Proper error handling with fetch
    // fetch() ONLY rejects on network errors, NOT on HTTP error statuses
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/99999");

      // Step 11: Check response.ok to catch HTTP errors
      if (!response.ok) {
        console.error(`Fetch API: HTTP error — status ${response.status}`);
        addResult(`Error: HTTP ${response.status} — Resource not found`);
      } else {
        const data = await response.json();
        addResult(`Success: ${JSON.stringify(data).substring(0, 50)}...`);
      }
    } catch (error) {
      // Step 12: This catch only runs on network failures, CORS errors, etc.
      console.error("Fetch API: Network or CORS error:", error);
      addResult(`Network error: ${(error as Error).message}`);
    }
    setLoading("");
  };

  const abortRequest = async () => {
    setLoading("Aborting...");
    addResult("--- Abort Request ---");

    // Step 13: AbortController — cancel in-flight fetch requests
    const controller = new AbortController();

    // Set a timeout to abort after 2 seconds
    setTimeout(() => {
      console.log("Fetch API: Aborting request...");
      controller.abort(); // This triggers an AbortError
      addResult("Abort signal sent");
    }, 2000);

    // Step 14: Pass signal to fetch options
    try {
      const response = await fetch("https://httpbin.org/delay/5", {
        signal: controller.signal, // Attach the AbortSignal
      });

      // This won't execute if aborted
      const data = await response.json();
      addResult("Request completed (should not reach here)");
    } catch (error) {
      // Step 15: Handle AbortError specifically
      if ((error as Error).name === "AbortError") {
        addResult("Request aborted successfully ✓");
      } else {
        addResult(`Error: ${(error as Error).message}`);
      }
    }
    setLoading("");
  };

  const uploadFile = async () => {
    setLoading("Uploading...");
    addResult("--- File Upload ---");

    // Step 16: Upload files using FormData with fetch
    const formData = new FormData();
    formData.append("title", "Upload test");

    // Create a simple text file as Blob for demo upload
    const blob = new Blob(["This is test file content for upload."], { type: "text/plain" });
    formData.append("file", blob, "test-upload.txt");
    console.log("Fetch API: FormData prepared with file:", formData);

    // Step 17: Send multipart/form-data (Content-Type set automatically for FormData)
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      // Do NOT set Content-Type manually for FormData — browser sets with boundary
      body: formData,
    });

    addResult(`Upload — status: ${response.status}`);

    // Display result from httpbin echo service
    const result = await response.json();
    console.log("Fetch API: Upload response:", result);
    addResult(`Uploaded file: ${result.files?.["file"] ?? "echo not available"}`);

    setLoading("");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Fetch API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Open DevTools Console to see fetch requests, responses, headers, and parsed data. Uses public JSONPlaceholder API.</span>
      </div>
      <div className="space-y-4">
        {loading && <div className="loading loading-spinner"/>}
        <p className="text-sm text-base-content/60">Status: {loading || "Idle"}</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={basicGet}>GET Request</button>
          <button className="btn btn-secondary" onClick={postRequest}>POST Request</button>
          <button className="btn btn-accent" onClick={putRequest}>PUT Request</button>
          <button className="btn btn-error" onClick={deleteRequest}>DELETE Request</button>
          <button className="btn btn-warning" onClick={errorHandling}>Error Handling</button>
          <button className="btn btn-ghost" onClick={abortRequest}>Test Abort</button>
          <button className="btn btn-outline" onClick={uploadFile}>Upload File</button>
        </div>
        {results.length > 0 && (
          <div className="mockup-code"><pre className="px-4 py-2 text-sm max-h-64 overflow-y-auto">{results.map((r, i) => <div key={i}>{r}</div>)}</pre></div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Fetch API</a>
    </main>
  );
}