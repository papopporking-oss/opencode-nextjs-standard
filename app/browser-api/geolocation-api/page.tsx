"use client";

import { useEffect } from "react";

/**
 * Geolocation API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
 *
 * The Geolocation API allows accessing the user's geographical location
 * with their permission. It is available on navigator.geolocation.
 */
export default function Page() {
  useEffect(() => {
    // Step 1: Check if the Geolocation API is supported by the browser
    if (!navigator.geolocation) {
      console.error("Geolocation API: Not supported in this browser.");
      return;
    }
    console.log("Geolocation API: Supported ✓");

    // Step 2: Configure position options (optional)
    // - enableHighAccuracy: true = use GPS if available (slower, more accurate)
    // - timeout: maximum time in ms to wait for position
    // - maximumAge: accept a cached position not older than this ms value
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 0, // Always get fresh position
    };
    console.log("Geolocation API Options:", options);

    // Step 3: getCurrentPosition — one-shot position request
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position: GeolocationPosition) => {
        console.log("Geolocation API: Position obtained successfully");
        console.log("  Latitude:", position.coords.latitude);
        console.log("  Longitude:", position.coords.longitude);
        console.log("  Accuracy (meters):", position.coords.accuracy);
        console.log("  Altitude:", position.coords.altitude);
        console.log("  Altitude Accuracy:", position.coords.altitudeAccuracy);
        console.log("  Heading:", position.coords.heading);
        console.log("  Speed:", position.coords.speed);
        console.log("  Timestamp:", new Date(position.timestamp));
      },
      // Error callback
      (error: GeolocationPositionError) => {
        console.error("Geolocation API: Error getting position");
        console.error("  Code:", error.code);
        // PERMISSION_DENIED (1), POSITION_UNAVAILABLE (2), TIMEOUT (3)
        console.error("  Message:", error.message);
      },
      options
    );

    // Step 4: watchPosition — continuously track position changes
    // Returns a watch ID used to stop tracking
    const watchId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        console.log("Geolocation API: Position updated (watch)");
        console.log("  Lat:", position.coords.latitude, "Lng:", position.coords.longitude);
      },
      (error: GeolocationPositionError) => {
        console.error("Geolocation API: Watch error:", error.message);
      },
      options
    );

    // Step 5 (cleanup): Stop watching position when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
      console.log("Geolocation API: Watch cleared (component unmounted)");
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Geolocation API</h1>
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Open DevTools Console to see geolocation output. You will be prompted to allow location access.</span>
      </div>
      <div className="mt-4 space-y-2">
        <p>Uses <code>navigator.geolocation.getCurrentPosition()</code> and <code>navigator.geolocation.watchPosition()</code></p>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API" target="_blank" rel="noopener noreferrer" className="link link-primary">MDN: Geolocation API</a>
      </div>
    </main>
  );
}