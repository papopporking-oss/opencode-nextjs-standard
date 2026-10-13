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
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Drag and Drop API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console. Drag the items below into the drop zones. Drop files from desktop onto the file zone.</p>
      </div>

      <div>
        {/* Draggable items */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold mb-3">Draggable Items</h2>
          <p>Drag these items to the drop zones (requires draggable=true)</p>
          <div>
            <div id="item-alpha" draggable={true} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p>Item Alpha</p>
              <p>Draggable card</p>
            </div>
            <div id="item-beta" draggable={true} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p>Item Beta</p>
              <p>Draggable card</p>
            </div>
            <div id="item-gamma" draggable={true} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
              <p>Item Gamma</p>
              <p>Draggable card</p>
            </div>
          </div>
        </div>

        {/* Drop zones */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold mb-3">Drop Zones</h2>
          <p>Drop draggable items here</p>
          <div>
            <div id="zone-1" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <p>Drop Zone 1</p>
              <p>Drop items here</p>
            </div>
            <div id="zone-2" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <p>Drop Zone 2</p>
              <p>Drop items here</p>
            </div>
          </div>
        </div>
      </div>

      {/* File drop zone */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-3">File Drop Zone</h2>
        <p>Drop files from your desktop here (text files will be read)</p>
        <div id="file-zone" onDragOver={handleFileDragOver} onDragLeave={handleFileDragLeave} onDrop={handleFileDrop}>
          <p>📁 Drop files from your computer here</p>
          <p>Supported: any file type</p>
        </div>
      </div>

      {/* Logs */}
      {droppedItems.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Dropped Items</h2>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm max-h-64 overflow-auto mt-3 font-mono">
            {droppedItems.map((item, i) => <div key={i}>{item}</div>)}
          </pre>
        </div>
      )}

      {dragLog.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Event Log</h2>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm max-h-64 overflow-auto mt-3 font-mono">
            {dragLog.map((l, i) => <div key={i}>{l}</div>)}
          </pre>
        </div>
      )}

      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API" target="_blank" rel="noopener noreferrer">MDN: Drag and Drop API</a>
    </main>
  );
}