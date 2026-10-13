"use client";

import { useState } from "react";

/**
 * Clipboard API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
 *
 * The Clipboard API provides asynchronous read and write access to
 * the system clipboard. Requires secure context (HTTPS/localhost).
 */
export default function Page() {
  const [copiedText, setCopiedText] = useState<string>("");
  const [pasteText, setPasteText] = useState<string>("");

  // Step 1: Check if Clipboard API is supported
  // The API requires secure context (HTTPS) or localhost
  const checkSupport = (): boolean => {
    if (!navigator.clipboard) {
      console.error("Clipboard API: Not supported. Requires secure context (HTTPS or localhost).");
      return false;
    }
    console.log("Clipboard API: Supported ✓");
    return true;
  };

  const handleCopy = async () => {
    if (!checkSupport()) return;

    // Step 2: clipboard.writeText — copy text to clipboard
    // This is the simplest way to copy plain text
    const textToCopy = "Hello from Clipboard API! Copied at " + new Date().toISOString();
    try {
      console.log("Clipboard API: Attempting to write text to clipboard...");
      await navigator.clipboard.writeText(textToCopy);
      console.log("Clipboard API: Text written to clipboard successfully ✓");
      console.log(`  Copied content: "${textToCopy}"`);
      setCopiedText(textToCopy);
    } catch (err) {
      console.error("Clipboard API: writeText failed:", err);
    }
  };

  const handlePaste = async () => {
    if (!checkSupport()) return;

    // Step 3: clipboard.readText — read text from clipboard
    // The browser may show a permission prompt
    try {
      console.log("Clipboard API: Attempting to read text from clipboard...");
      const text = await navigator.clipboard.readText();
      console.log("Clipboard API: Text read from clipboard successfully ✓");
      console.log(`  Pasted content: "${text}"`);
      setPasteText(text);
    } catch (err) {
      console.error("Clipboard API: readText failed:", err);
      console.error("  This may be due to missing clipboard-read permission.");
    }
  };

  const handleCopyImage = async () => {
    if (!checkSupport()) return;

    // Step 4: clipboard.write — write non-text content (e.g., images)
    // Uses ClipboardItem with MIME types
    // First, fetch an image to get a Blob
    try {
      console.log("Clipboard API: Fetching image for clipboard write...");
      const response = await fetch("https://picsum.photos/200");
      const blob = await response.blob();
      console.log(`Clipboard API: Image fetched — type: "${blob.type}", size: ${blob.size} bytes`);

      // Step 5: Create ClipboardItem with the image blob
      // The MIME type key must match the blob type
      const item = new ClipboardItem({ [blob.type]: blob });
      console.log("Clipboard API: ClipboardItem created with image blob");

      await navigator.clipboard.write([item]);
      console.log("Clipboard API: Image written to clipboard successfully ✓");
    } catch (err) {
      console.error("Clipboard API: write (image) failed:", err);
    }
  };

  const handleReadClipboardContents = async () => {
    if (!checkSupport()) return;

    // Step 6: clipboard.read — read non-text content from clipboard
    try {
      console.log("Clipboard API: Reading all clipboard contents...");
      const items = await navigator.clipboard.read();
      console.log(`Clipboard API: Found ${items.length} ClipboardItem(s)`);
      items.forEach((item, i) => {
        console.log(`  ClipboardItem[${i}]: types = [${item.types.join(", ")}]`);
        // Item content can be retrieved via item.getType(mimeType) which returns a Blob
      });
    } catch (err) {
      console.error("Clipboard API: read failed:", err);
    }
  };

  return (
    <main>
      <h1>Clipboard API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Requires secure context (HTTPS or localhost). Open DevTools Console to see results. Paste may require permission.</p>
      </div>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          <button onClick={handleCopy}>Copy Text</button>
          <button onClick={handlePaste}>Paste Text</button>
          <button onClick={handleCopyImage}>Copy Image</button>
          <button onClick={handleReadClipboardContents}>Read Clipboard</button>
        </div>
        {copiedText && <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>Copied: {copiedText}</pre>}
        {pasteText && <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>Pasted: {pasteText}</pre>}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API" target="_blank" rel="noopener noreferrer">MDN: Clipboard API</a>
    </main>
  );
}