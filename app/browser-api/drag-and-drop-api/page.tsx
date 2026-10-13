"use client";

import { useState } from "react";

/**
 * Drag and Drop API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
 *                https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
 *
 * The HTML Drag and Drop API enables dragging elements within a page
 * or between browser windows and the desktop. It uses event-based
 * interaction on draggable elements and drop zones.
 */
export default function Page() {
  const [dragLog, setDragLog] = useState<string[]>([]);
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log("Drag & Drop API:", msg);
    setDragLog((prev) => [...prev, msg]);
  };

  // Step 1: ondragstart — fires when drag begins (on the DRAGGABLE element)
  // This is where you set the data being transferred
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    console.log("Drag & Drop API: dragstart — drag started");
    console.log("  Source element:", element.id);
    console.log("  Mouse position:", { x: event.clientX, y: event.clientY });

    // Step 2: event.dataTransfer — the DataTransfer object
    // Stores the dragged data and controls drag appearance
    const dt = event.dataTransfer;

    // Step 3: dataTransfer.setData(format, data) — store drag data
    // Formats: "text/plain", "text/html", "text/uri-list", or custom MIME
    dt.setData("text/plain", element.id);
    dt.setData("text/html", `<b>${element.textContent}</b>`);
    console.log("  DataTransfer data set: text/plain + text/html");

    // Step 4: dataTransfer.effectAllowed — allowed drop actions
    // Values: "none", "copy", "move", "link", "copyMove", "copyLink", "linkMove", "all"
    dt.effectAllowed = "move";
    console.log("  effectAllowed: move");

    // Step 5: dataTransfer.setDragImage(imageElement, xOffset, yOffset)
    // Custom drag image (optional — defaults to element snapshot)
    // dt.setDragImage(customImage, 50, 50);

    addLog(`dragstart: ${element.id}`);
  };

  // Step 6: ondrag — fires continuously during drag (on the source element)
  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    // This fires frequently — avoid heavy work here
    console.log(`Drag & Drop API: drag — position: (${event.clientX}, ${event.clientY})`);
  };

  // Step 7: ondragend — fires when drag ends (on the source)
  // Fires even if element is dropped or drag is cancelled
  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag & Drop API: dragend — drag ended");
    console.log("  dropEffect:", event.dataTransfer.dropEffect);
    // dropEffect values: "none" (no drop), "move", "copy", "link"
    addLog(`dragend: ${event.currentTarget.id} (dropEffect: ${event.dataTransfer.dropEffect})`);
  };

  // ===== DROP ZONE EVENTS =====

  // Step 8: ondragenter — drag enters the drop zone boundary
  // Must call preventDefault() to allow a drop here
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const zone = event.currentTarget;
    console.log(`Drag & Drop API: dragenter — entered zone "${zone.id}"`);
    zone.style.outline = "2px dashed #2196F3";
    zone.style.backgroundColor = "rgba(33, 150, 243, 0.05)";
    addLog(`dragenter: ${zone.id}`);
  };

  // Step 9: ondragover — drag is hovering over the drop zone (fires every ~200ms)
  // MUST call preventDefault() to indicate this is a valid drop target
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Required! Enables drop
    event.stopPropagation();

    // Step 10: Set dropEffect to show visual feedback (cursor change)
    // This tells the browser what operation will happen on drop
    event.dataTransfer.dropEffect = "move";
    console.log(`Drag & Drop API: dragover — over zone "${event.currentTarget.id}", dropEffect=move`);
  };

  // Step 11: ondragleave — drag leaves the drop zone boundary
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    const zone = event.currentTarget;
    console.log(`Drag & Drop API: dragleave — left zone "${zone.id}"`);
    zone.style.outline = "";
    zone.style.backgroundColor = "";
    addLog(`dragleave: ${zone.id}`);
  };

  // Step 12: ondrop — element is dropped on the zone
  // This is the main event: retrieve data and process the drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const zone = event.currentTarget;
    console.log(`Drag & Drop API: drop — dropped on zone "${zone.id}"`);

    // Step 13: Get the transferred data
    const dt = event.dataTransfer;

    // Retrieve data in multiple formats
    const plainText = dt.getData("text/plain");
    const htmlText = dt.getData("text/html");

    console.log("  Data received:");
    console.log("    text/plain:", plainText);
    console.log("    text/html:", htmlText);

    // Step 14: Get list of available formats
    console.log("  Available formats:", dt.types);
    // types example: ["text/plain", "text/html"]

    // Step 15: Get files if dropped from desktop/file manager
    if (dt.files.length > 0) {
      console.log(`  Files dropped: ${dt.files.length}`);
      Array.from(dt.files).forEach((file, i) => {
        console.log(`    File[${i}]: ${file.name}, ${file.size} bytes, type="${file.type}"`);
      });
    }

    // Step 16: Handle items (more detailed than files, includes non-file drag data)
    if (dt.items) {
      console.log(`  DataTransfer items: ${dt.items.length}`);
      for (let i = 0; i < dt.items.length; i++) {
        const item = dt.items[i];
        console.log(`    Item[${i}]: kind="${item.kind}", type="${item.type}"`);
        // item.kind: "string" or "file"
        // For files: item.getAsFile() returns File object
        // For strings: item.getAsString(callback) retrieves string value
      }
    }

    // Reset zone styling
    zone.style.outline = "";
    zone.style.backgroundColor = "";

    addLog(`drop: '${plainText}' → ${zone.id}`);
    setDroppedItems((prev) => [...prev, `${plainText} → ${zone.id}`]);
  };

  // Step 17: File drop demo — accept files from desktop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Drag & Drop API: File drop event");
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        console.log(`  File: "${file.name}", ${file.size} bytes, type="${file.type}"`);

        // Read file information
        const info = `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB) [${file.type}]`;
        addLog(info);
        setDroppedItems((prev) => [...prev, info]);

        // For text files, we could use FileReader to show content
        if (file.type.startsWith("text/") || file.name.endsWith(".json") || file.name.endsWith(".txt")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            console.log(`  File content (first 200 chars):`, content.substring(0, 200));
            addLog(`Content: ${content.substring(0, 100)}...`);
          };
          reader.readAsText(file);
        }
      });
    }

    (event.currentTarget as HTMLElement).style.outline = "";
  };

  const handleFileDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    (event.currentTarget as HTMLElement).style.outline = "2px dashed #4CAF50";
  };

  const handleFileDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    (event.currentTarget as HTMLElement).style.outline = "";
  };

  return (
    <main>
      <h1>Drag and Drop API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console. Drag the items below into the drop zones. Drop files from desktop onto the file zone.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Draggable items */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>Draggable Items</h2>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>Drag these items to the drop zones (requires draggable=true)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div id="item-alpha" draggable={true} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#3498db", color: "white", cursor: "grab", userSelect: "none" }} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p style={{ fontWeight: "500" }}>Item Alpha</p>
              <p style={{ fontSize: "12px", opacity: 0.75 }}>Draggable card</p>
            </div>
            <div id="item-beta" draggable={true} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#2ecc71", color: "white", cursor: "grab", userSelect: "none" }} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p style={{ fontWeight: "500" }}>Item Beta</p>
              <p style={{ fontSize: "12px", opacity: 0.75 }}>Draggable card</p>
            </div>
            <div id="item-gamma" draggable={true} style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#e74c3c", color: "white", cursor: "grab", userSelect: "none" }} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p style={{ fontWeight: "500" }}>Item Gamma</p>
              <p style={{ fontSize: "12px", opacity: 0.75 }}>Draggable card</p>
            </div>
          </div>
        </div>

        {/* Drop zones */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>Drop Zones</h2>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>Drop draggable items here</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div id="zone-1" style={{ border: "2px dashed #999", borderRadius: "8px", padding: "24px", textAlign: "center" }} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <p style={{ fontSize: "14px", fontWeight: "500" }}>Drop Zone 1</p>
              <p style={{ fontSize: "12px", color: "#666" }}>Drop items here</p>
            </div>
            <div id="zone-2" style={{ border: "2px dashed #999", borderRadius: "8px", padding: "24px", textAlign: "center" }} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <p style={{ fontSize: "14px", fontWeight: "500" }}>Drop Zone 2</p>
              <p style={{ fontSize: "12px", color: "#666" }}>Drop items here</p>
            </div>
          </div>
        </div>
      </div>

      {/* File drop zone */}
      <div style={{ marginTop: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>File Drop Zone</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>Drop files from your desktop here (text files will be read)</p>
        <div id="file-zone" style={{ border: "2px dashed #2ecc71", borderRadius: "8px", padding: "32px", textAlign: "center" }} onDragOver={handleFileDragOver} onDragLeave={handleFileDragLeave} onDrop={handleFileDrop}>
          <p style={{ fontSize: "14px", fontWeight: "500", color: "#2ecc71" }}>📁 Drop files from your computer here</p>
          <p style={{ fontSize: "12px", color: "#666" }}>Supported: any file type</p>
        </div>
      </div>

      {/* Logs */}
      {droppedItems.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Dropped Items</h2>
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "130px", overflow: "auto" }}>
            {droppedItems.map((item, i) => <div key={i}>{item}</div>)}
          </pre>
        </div>
      )}

      {dragLog.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Event Log</h2>
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "200px", overflow: "auto" }}>
            {dragLog.map((l, i) => <div key={i}>{l}</div>)}
          </pre>
        </div>
      )}

      <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API" target="_blank" rel="noopener noreferrer">MDN: Drag and Drop API</a>
    </main>
  );
}