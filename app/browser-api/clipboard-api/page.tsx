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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Clipboard API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Requires secure context (HTTPS or localhost). Open DevTools Console to see results. Paste may require permission.</span>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleCopy}>Copy Text</button>
          <button className="btn btn-secondary" onClick={handlePaste}>Paste Text</button>
          <button className="btn btn-accent" onClick={handleCopyImage}>Copy Image</button>
          <button className="btn btn-ghost" onClick={handleReadClipboardContents}>Read Clipboard</button>
        </div>
        {copiedText && <div className="mockup-code"><pre className="px-4 py-2 text-sm">Copied: {copiedText}</pre></div>}
        {pasteText && <div className="mockup-code"><pre className="px-4 py-2 text-sm">Pasted: {pasteText}</pre></div>}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Clipboard API</a>
    </main>
  );
}