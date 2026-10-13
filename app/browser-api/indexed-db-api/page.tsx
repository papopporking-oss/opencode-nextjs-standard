"use client";

import { useEffect, useState } from "react";

/**
 * IndexedDB API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase
 *
 * IndexedDB is a low-level, transactional, NoSQL database for storing
 * significant amounts of structured data in the browser.
 * It is asynchronous and supports indexes for high-performance searches.
 */
export default function Page() {
  const [dbStatus, setDbStatus] = useState<string>("Not connected");
  const [records, setRecords] = useState<string[]>([]);

  // Step 1: Define database configuration
  const DB_NAME = "DemoDatabase";
  const DB_VERSION = 1; // Version must be incremented when schema changes
  const STORE_NAME = "users";

  useEffect(() => {
    // Step 2: Check IndexedDB support
    if (!window.indexedDB) {
      console.error("IndexedDB API: Not supported in this browser.");
      setDbStatus("Not supported");
      return;
    }
    console.log("IndexedDB API: Supported ✓");
    console.log("  indexedDB available on window");

    // Step 3: Open (or create) a database via indexedDB.open(name, version)
    // If version > current, onupgradeneeded fires for schema changes
    const openRequest: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

    // Step 4: onupgradeneeded — fired when DB is first created or version changes
    // This is where you create object stores and indexes (schema definition)
    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log(`IndexedDB API: Upgrade needed — oldVersion=${event.oldVersion}, newVersion=${event.newVersion}`);

      // Step 5: Create an object store (like a table in SQL)
      // Options: autoIncrement (generate keys), keyPath (property to use as key)
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id", // Property of stored objects to use as primary key
          autoIncrement: true, // Auto-generate incremented keys
        });
        console.log(`IndexedDB API: Object store "${STORE_NAME}" created ✓`);
        console.log("  keyPath: 'id', autoIncrement: true");

        // Step 6: Create indexes on the object store for efficient queries
        // createIndex(indexName, keyPath, options)
        objectStore.createIndex("name_idx", "name", { unique: false });
        objectStore.createIndex("email_idx", "email", { unique: true }); // unique = no duplicate emails
        console.log("IndexedDB API: Indexes created — name_idx, email_idx (unique)");
      }
    };

    // Step 7: onsuccess — database opened successfully
    openRequest.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log(`IndexedDB API: Database "${DB_NAME}" opened successfully ✓`);
      console.log(`  Version: ${db.version}`);
      console.log(`  Object store names: [${Array.from(db.objectStoreNames).join(", ")}]`);
      setDbStatus(`Connected — ${DB_NAME} v${db.version}`);

      // Step 8: Listen for unexpected close (e.g., disk quota exceeded)
      db.onclose = () => {
        console.warn("IndexedDB API: Database closed unexpectedly");
      };

      // Step 9: onversionchange — another tab updated the DB version
      db.onversionchange = () => {
        console.log("IndexedDB API: Version changed in another tab — closing this connection");
        db.close();
        setDbStatus("Closed (version changed elsewhere)");
      };
    };

    // Step 10: onerror — database open failed
    openRequest.onerror = (event: Event) => {
      console.error("IndexedDB API: Failed to open database:", (event.target as IDBOpenDBRequest).error);
      setDbStatus("Error opening database");
    };

    return () => {
      // Cleanup not strictly needed as connections auto-close,
      // but good practice for long-lived connections
      if (openRequest.readyState === "done") {
        console.log("IndexedDB API: Component unmounted");
      }
    };
  }, []);

  // Step 11: Add a record using a transaction
  const addRecord = () => {
    console.log("IndexedDB API: Starting add record transaction...");

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Step 12: Create a transaction
      // transaction(storeNames, mode): mode = "readonly" or "readwrite"
      const transaction = db.transaction([STORE_NAME], "readwrite");
      console.log(`IndexedDB API: Transaction created — mode: readwrite`);

      // Step 13: Get the object store from the transaction
      const objectStore = transaction.objectStore(STORE_NAME);

      // Step 14: Prepare data to add
      const user = {
        name: `User_${Date.now().toString(36)}`,
        email: `user_${Date.now().toString(36)}@example.com`,
        createdAt: new Date().toISOString(),
      };
      console.log("IndexedDB API: Adding record:", user);

      // Step 15: add() — insert a new record (key will be auto-generated)
      const addRequest = objectStore.add(user);

      addRequest.onsuccess = (e: Event) => {
        const key = (e.target as IDBRequest).result;
        console.log(`IndexedDB API: Record added successfully ✓ — key: ${key}`);
        console.log("  Data:", user);
        readAllRecords(); // Refresh display
      };

      addRequest.onerror = (e: Event) => {
        console.error("IndexedDB API: Failed to add record:", (e.target as IDBRequest).error);
      };

      // Step 16: Transaction lifecycle events
      transaction.oncomplete = () => {
        console.log("IndexedDB API: Transaction completed ✓");
      };

      transaction.onerror = () => {
        console.error("IndexedDB API: Transaction error:", transaction.error);
      };
    };
  };

  // Step 17: Read all records using a cursor
  const readAllRecords = () => {
    console.log("IndexedDB API: Reading all records...");

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);

      // Step 18: getAll() — retrieve all objects (modern approach)
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (e: Event) => {
        const allRecords = (e.target as IDBRequest).result;
        console.log(`IndexedDB API: Retrieved ${allRecords.length} record(s)`);
        allRecords.forEach((rec: Record<string, unknown>, i: number) => {
          console.log(`  Record[${i}]:`, rec);
        });
        setRecords(allRecords.map((r: Record<string, unknown>) => JSON.stringify(r)));
      };

      // Step 19: Alternative: Cursor-based iteration for large datasets
      // openCursor() iterates one record at a time — better for huge datasets
      const cursorRequest = objectStore.openCursor();
      cursorRequest.onsuccess = (e: Event) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          console.log(`IndexedDB API: Cursor at key=${cursor.key}, value:`, cursor.value);
          cursor.continue(); // Move to next record
        } else {
          console.log("IndexedDB API: Cursor iteration complete — no more records");
        }
      };
    };
  };

  // Step 20: Delete a record by key
  const deleteRecord = (id: number) => {
    console.log(`IndexedDB API: Deleting record with key=${id}...`);

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const objectStore = transaction.objectStore(STORE_NAME);

      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = () => {
        console.log(`IndexedDB API: Record ${id} deleted ✓`);
        readAllRecords();
      };

      deleteRequest.onerror = (e: Event) => {
        console.error("IndexedDB API: Delete failed:", (e.target as IDBRequest).error);
      };
    };
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">IndexedDB API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Open DevTools Console to see database operations. Data persists in browser storage.</span>
      </div>
      <div className="space-y-4">
        <p>DB Status: <span className="badge badge-outline">{dbStatus}</span></p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={addRecord}>Add Random Record</button>
          <button className="btn btn-secondary" onClick={readAllRecords}>Read All Records</button>
        </div>
        {records.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Records ({records.length}):</p>
            {records.map((rec, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="mockup-code flex-1"><pre className="px-4 py-2 text-xs">{rec}</pre></div>
                <button className="btn btn-error btn-xs" onClick={() => {
                  const obj = JSON.parse(rec);
                  deleteRecord(obj.id);
                }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: IndexedDB API</a>
    </main>
  );
}