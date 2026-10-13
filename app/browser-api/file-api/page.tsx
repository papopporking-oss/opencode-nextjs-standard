"use client";

import { useEffect, useRef, useState } from "react";

/**
 * File API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/File_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *                https://developer.mozilla.org/en-US/docs/Web/API/File
 *
 * The File API enables reading file contents and interacting with
 * file objects from file input elements or drag-and-drop.
 */
export default function Page() {
  const [fileInfo, setFileInfo] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    // Step 1: Verify File API support (File, FileReader, Blob are widely available)
    if (!window.File || !window.FileReader || !window.Blob) {
      console.error("File API: Not supported in this browser.");
      return;
    }
    console.log("File API: Supported ✓");
    console.log("File API: window.File, window.FileReader, window.Blob all available");
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log("File API: No file selected.");
      return;
    }

    // Step 2: Convert FileList to array and inspect file metadata
    const fileArray = Array.from(files);
    console.log(`File API: ${fileArray.length} file(s) selected`);
    const infoLines: string[] = [];

    fileArray.forEach((file: File, index: number) => {
      // Step 3: Read file properties — these are available without reading content
      infoLines.push(`File[${index}]: ${file.name}`);
      console.log(`File API: File[${index}] properties:`);
      console.log(`  name: "${file.name}"`);
      console.log(`  size: ${file.size} bytes (${(file.size / 1024).toFixed(2)} KB)`);
      console.log(`  type: "${file.type}"`);
      console.log(`  lastModified: ${new Date(file.lastModified).toISOString()}`);

      setFileInfo(prev => [...prev, ...infoLines]);

      // Step 4: FileReader — read file content as text
      // Available read methods: readAsText, readAsDataURL, readAsArrayBuffer, readAsBinaryString
      const reader = new FileReader();

      // Step 5: Configure reader event handlers
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        console.log(`File API: FileReader.onload — "${file.name}" read successfully`);
        console.log(`  Content length: ${result.length} characters`);

        // Step 6: Display first 500 characters in UI (and full content in console)
        const preview = result.substring(0, 500);
        setFileContent(preview);
        console.log(`File API: Content preview (first 500 chars):\n${preview}`);
      };

      reader.onerror = (e: ProgressEvent<FileReader>) => {
        console.error(`File API: FileReader error for "${file.name}":`, reader.error?.message);
      };

      reader.onprogress = (e: ProgressEvent<FileReader>) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          console.log(`File API: Reading "${file.name}" — ${percent}% (${e.loaded}/${e.total} bytes)`);
        }
      };

      // Step 7: Start reading the file
      console.log(`File API: Starting FileReader.readAsText for "${file.name}"`);
      reader.readAsText(file); // Could also use: reader.readAsDataURL(file) for previews
    });
  };

  const handleCreateBlob = () => {
    // Step 8: Blob constructor — create file-like objects in memory
    const text = "Hello from File API! This content was generated via Blob.";
    const blob = new Blob([text], { type: "text/plain" });
    console.log("File API: Blob created:");
    console.log(`  size: ${blob.size} bytes`);
    console.log(`  type: "${blob.type}"`);

    // Step 9: Create a downloadable URL from Blob using URL.createObjectURL
    const url = URL.createObjectURL(blob);
    console.log(`File API: Object URL created: ${url}`);

    // Step 10: Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "demo-blob.txt";
    link.click();
    console.log("File API: Download triggered for demo-blob.txt");

    // Step 11: Revoke object URL to free memory
    URL.revokeObjectURL(url);
    console.log("File API: Object URL revoked");
  };

  return (
    <main>
      <h1>File API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Select a text file and open DevTools Console to see file metadata and content.</p>
      </div>
      <div>
        <fieldset style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
          <legend>Choose a file</legend>
          <input type="file" onChange={handleFileSelect}/>
        </fieldset>
        <button onClick={handleCreateBlob} style={{ marginBottom: "12px" }}>Create and Download Blob</button>
        {fileInfo.length > 0 && (
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", overflow: "auto" }}>{fileInfo.join("\n")}</pre>
        )}
        {fileContent && (
          <pre style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4", padding: "12px", borderRadius: "8px", fontSize: "14px", maxHeight: "200px", overflow: "auto", whiteSpace: "pre-wrap" }}>{fileContent}</pre>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_API" target="_blank" rel="noopener noreferrer">MDN: File API</a>
    </main>
  );
}