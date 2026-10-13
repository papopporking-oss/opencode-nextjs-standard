"use client";

import { useEffect, useState } from "react";

/**
 * WebSocket API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 *                https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
 *                https://tools.ietf.org/html/rfc6455
 *
 * The WebSocket API provides a persistent, full-duplex communication
 * channel between client and server over a single TCP connection.
 * It uses ws:// (or wss:// for secure/TLS) protocol.
 */
export default function Page() {
  const [socketStatus, setSocketStatus] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);

  const connectWebSocket = () => {
    // Step 1: Check WebSocket API support
    if (!window.WebSocket) {
      console.error("WebSocket API: Not supported in this browser.");
      setSocketStatus("Not supported");
      return;
    }
    console.log("WebSocket API: Supported ✓");

    // Step 2: Create a WebSocket connection
    // ws:// for unencrypted, wss:// for TLS-encrypted (WebSocket Secure)
    // Using a public echo WebSocket server for demo
    const wsUrl = "wss://echo.websocket.org";
    console.log(`WebSocket API: Connecting to ${wsUrl}...`);

    const socket = new WebSocket(wsUrl);
    setSocketStatus("Connecting...");

    // Step 3: onopen — connection established
    socket.onopen = (event: Event) => {
      console.log("WebSocket API: Connection opened ✓");
      console.log("  ReadyState:", socket.readyState, "(1 = OPEN)");
      // ReadyState values: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
      setSocketStatus("Connected ✓");

      // Step 4: send() — send data to the server
      // Data can be string, ArrayBuffer, or Blob
      const testMessage = JSON.stringify({
        type: "greeting",
        payload: "Hello from WebSocket API!",
        timestamp: Date.now(),
      });
      console.log(`WebSocket API: Sending message: ${testMessage}`);
      socket.send(testMessage);
      console.log("WebSocket API: Message sent ✓");
    };

    // Step 5: onmessage — data received from server
    socket.onmessage = (event: MessageEvent) => {
      console.log("WebSocket API: Message received:");
      console.log("  Origin:", event.origin);
      console.log("  Data type:", typeof event.data);
      console.log("  Data:", event.data);
      console.log("  Data length:", event.data.length);

      // For binary data, event.data could be Blob or ArrayBuffer
      // if (event.data instanceof Blob) { ... }
      // if (event.data instanceof ArrayBuffer) { ... }

      setMessages((prev) => [...prev, `← ${event.data}`]);
    };

    // Step 6: onerror — connection error
    socket.onerror = (event: Event) => {
      console.error("WebSocket API: Connection error:", event);
      console.log("  ReadyState:", socket.readyState);
      setSocketStatus("Error");
    };

    // Step 7: onclose — connection closed
    socket.onclose = (event: CloseEvent) => {
      console.log("WebSocket API: Connection closed");
      console.log("  Code:", event.code);
      console.log("  Reason:", event.reason);
      console.log("  Was clean:", event.wasClean);
      // Common close codes: 1000=Normal, 1001=Going Away, 1006=Abnormal (network issue)
      setSocketStatus(`Closed (code: ${event.code})`);
    };

    // Step 8: Inspect WebSocket properties
    console.log("WebSocket API: Socket properties:");
    console.log("  URL:", socket.url);
    console.log("  Protocol:", socket.protocol); // Sub-protocol (empty if none)
    console.log("  Extensions:", socket.extensions); // Negotiated extensions
    console.log("  ReadyState:", socket.readyState);
    console.log("  BufferedAmount:", socket.bufferedAmount, "bytes"); // Data queued but not sent

    // Step 9: Configure binary type for received data
    // "blob" (default) or "arraybuffer"
    socket.binaryType = "blob";
    console.log("  Binary type set to:", socket.binaryType);
  };

  const sendMessage = () => {
    // Step 10: Find existing open WebSocket connection
    // In a real app, you'd keep the socket reference in a ref
    // This demo just illustrates the send pattern
    const testSocket = new WebSocket("wss://echo.websocket.org");
    testSocket.onopen = () => {
      const newCounter = counter + 1;
      setCounter(newCounter);
      const msg = `Demo message #${newCounter} at ${new Date().toLocaleTimeString()}`;
      console.log(`WebSocket API: Sending: "${msg}"`);
      testSocket.send(msg);

      // Step 11: send() with ArrayBuffer (binary)
      const buffer = new ArrayBuffer(4);
      const view = new Uint8Array(buffer);
      view[0] = 0x48; // 'H'
      view[1] = 0x69; // 'i'
      view[2] = 0x21; // '!'
      view[3] = 0x0A; // newline
      console.log("WebSocket API: Sending binary ArrayBuffer:", Array.from(view));
      testSocket.send(buffer);

      setMessages((prev) => [...prev, `→ ${msg}`, `→ [binary 4 bytes]`]);

      // Step 12: Close connection cleanly after communication
      // socket.close(code, reason)
      setTimeout(() => {
        testSocket.close(1000, "Demo complete");
        console.log("WebSocket API: Connection closed by client with code 1000");
      }, 500);
    };
  };

  return (
    <main>
      <h1>WebSocket API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console. Uses public echo server (wss://echo.websocket.org). Messages are echoed back.</p>
      </div>
      <div>
        <p>Status: <span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}>{socketStatus}</span></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          <button onClick={connectWebSocket}>Connect</button>
          <button onClick={sendMessage}>Send Message</button>
        </div>
        {messages.length > 0 && (
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "200px", overflow: "auto" }}>
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </pre>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noopener noreferrer">MDN: WebSocket API</a>
    </main>
  );
}