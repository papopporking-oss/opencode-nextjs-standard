import Link from "next/link";

const apis = [
  { href: "/browser-api/geolocation-api", name: "Geolocation API", desc: "Get user location" },
  { href: "/browser-api/media-devices-api", name: "MediaDevices API", desc: "Access camera & microphone" },
  { href: "/browser-api/file-api", name: "File API", desc: "Read files from disk" },
  { href: "/browser-api/clipboard-api", name: "Clipboard API", desc: "Copy & paste text" },
  { href: "/browser-api/notifications-api", name: "Notifications API", desc: "Desktop notifications" },
  { href: "/browser-api/service-worker-api", name: "Service Worker API", desc: "Background scripts" },
  { href: "/browser-api/push-api", name: "Push API", desc: "Push messages" },
  { href: "/browser-api/indexed-db-api", name: "IndexedDB API", desc: "Client-side database" },
  { href: "/browser-api/cache-api", name: "Cache API", desc: "Request/response caching" },
  { href: "/browser-api/web-authentication-api", name: "Web Authentication API", desc: "Biometric auth" },
  { href: "/browser-api/webgl-api", name: "WebGL API", desc: "3D graphics" },
  { href: "/browser-api/web-audio-api", name: "Web Audio API", desc: "Audio processing" },
  { href: "/browser-api/media-recorder-api", name: "MediaRecorder API", desc: "Record audio/video" },
  { href: "/browser-api/web-socket-api", name: "WebSocket API", desc: "Real-time communication" },
  { href: "/browser-api/web-rtc-api", name: "WebRTC API", desc: "Peer-to-peer connection" },
  { href: "/browser-api/performance-api", name: "Performance API", desc: "Measure performance" },
  { href: "/browser-api/web-workers-api", name: "Web Workers API", desc: "Background threads" },
  { href: "/browser-api/web-locks-api", name: "Web Locks API", desc: "Resource locking" },
  { href: "/browser-api/fetch-api", name: "Fetch API", desc: "HTTP requests" },
  { href: "/browser-api/dom-api", name: "DOM API", desc: "Document manipulation" },
  { href: "/browser-api/canvas-api", name: "Canvas API", desc: "2D drawing" },
  { href: "/browser-api/storage-api", name: "Storage API", desc: "Key-value storage" },
  { href: "/browser-api/web-crypto-api", name: "Web Crypto API", desc: "Cryptographic operations" },
  { href: "/browser-api/url-api", name: "URL API", desc: "URL parsing & building" },
  { href: "/browser-api/drag-and-drop-api", name: "Drag and Drop API", desc: "Drag & drop interactions" },
];

export default function Page() {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "12px" }}>Browser API Examples</h1>
        <p style={{ color: "#666", maxWidth: "672px", margin: "0 auto" }}>Interactive demonstrations of 25 browser APIs with detailed comments and console output. Open DevTools to see the results.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {apis.map((api) => (
          <Link key={api.href} href={api.href} style={{ display: "block", padding: "20px", border: "1px solid #e5e7eb", borderRadius: "12px", textDecoration: "none", color: "inherit", backgroundColor: "#f9fafb", transition: "background-color 0.15s" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "4px" }}>{api.name}</h2>
            <p style={{ fontSize: "0.875rem", color: "#666" }}>{api.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}