"use client";

import { useState } from "react";

/**
 * Web Crypto API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 *                https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 *
 * The Web Crypto API provides cryptographic primitives for secure
 * operations: hashing, encryption/decryption, key generation,
 * digital signatures, and random number generation.
 *
 * ⚠️ Requires secure context (HTTPS/localhost) for crypto.subtle.
 *    crypto.getRandomValues() works in any context.
 */
export default function Page() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log("Web Crypto API:", msg);
    setLog((prev) => [...prev, msg]);
  };

  const randomNumbers = () => {
    addLog("--- getRandomValues (always available) ---");

    // Step 1: crypto.getRandomValues() — cryptographically secure random numbers
    // This works in any context (no HTTPS required)
    const array = new Uint32Array(5);
    crypto.getRandomValues(array);
    console.log("Web Crypto API: crypto.getRandomValues — 5 random Uint32:", Array.from(array));
    addLog(`Random 32-bit ints: [${Array.from(array).slice(0, 3).join(", ")}...]`);

    // Step 2: Get random bytes as Uint8Array
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Convert to hex string for readable output
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(":");
    console.log("Web Crypto API: 16 random bytes (hex):", hex);
    addLog(`Random bytes (hex): ${hex.substring(0, 35)}...`);

    // Step 3: crypto.randomUUID() — generate a UUID v4
    const uuid = crypto.randomUUID();
    console.log("Web Crypto API: randomUUID() =", uuid);
    addLog(`UUID: ${uuid}`);
  };

  const hashing = async () => {
    if (!crypto.subtle) {
      addLog("crypto.subtle not available — requires secure context");
      return;
    }
    addLog("--- Hashing (SHA-256) ---");

    // Step 4: TextEncoder — convert string to Uint8Array (required for crypto.subtle)
    const encoder = new TextEncoder();
    const data = encoder.encode("Hello, Web Crypto API!");
    console.log("Web Crypto API: TextEncoder — string to Uint8Array:", data);

    // Step 5: crypto.subtle.digest(algorithm, data) — compute a hash
    // Supported algorithms: SHA-1, SHA-256, SHA-384, SHA-512
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    console.log("Web Crypto API: SHA-256 hash computed ✓");
    console.log("  Hash length:", hashBuffer.byteLength, "bytes (256 bits)");

    // Step 6: Convert ArrayBuffer hash to hex string for readability
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    console.log("Web Crypto API: SHA-256 hash (hex):", hashHex);
    addLog(`SHA-256: ${hashHex.substring(0, 40)}...`);

    // Step 7: Compare hashes (verify integrity)
    // Hashing the same data always produces the same output
    const data2 = encoder.encode("Hello, Web Crypto API!");
    const hashBuffer2 = await crypto.subtle.digest("SHA-256", data2);
    const hashHex2 = Array.from(new Uint8Array(hashBuffer2), b => b.toString(16).padStart(2, "0")).join("");
    console.log("Web Crypto API: Hash comparison — identical input = identical hash:", hashHex === hashHex2);
    addLog(`Hash match: ${hashHex === hashHex2 ? "✓ (same data = same hash)" : "✗"}`);

    // Different data produces different hash
    const data3 = encoder.encode("Different message");
    const hashBuffer3 = await crypto.subtle.digest("SHA-256", data3);
    const hashHex3 = Array.from(new Uint8Array(hashBuffer3), b => b.toString(16).padStart(2, "0")).join("");
    addLog(`Hash mismatch: ${hashHex === hashHex3 ? "✗ (unexpected)" : "✓ (different data = different hash)"}`);
  };

  const generateKey = async () => {
    if (!crypto.subtle) {
      addLog("crypto.subtle not available — requires secure context");
      return;
    }
    addLog("--- Key Generation (AES-GCM) ---");

    // Step 8: crypto.subtle.generateKey(algorithm, extractable, keyUsages)
    // Generate a symmetric AES-GCM key for encryption
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",       // Algorithm name
        length: 256,           // Key length in bits: 128, 192, or 256
      },
      true,                    // extractable: can the key be exported?
      ["encrypt", "decrypt"],  // keyUsages: what operations the key can perform
    );
    console.log("Web Crypto API: AES-GCM 256-bit key generated ✓");
    console.log("  Type:", key.type); // "secret" for symmetric keys
    console.log("  Extractable:", key.extractable);
    console.log("  Usages:", key.usages);
    console.log("  Algorithm name:", key.algorithm.name);
    addLog("AES-GCM 256-bit key generated ✓");

    // Step 9: Export the key in raw format for storage/sharing
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const exportedKeyHex = Array.from(new Uint8Array(exportedKey), b => b.toString(16).padStart(2, "0")).join("");
    console.log("Web Crypto API: Key exported (raw format, hex):", exportedKeyHex);
    addLog(`Key exported (hex): ${exportedKeyHex.substring(0, 40)}...`);

    return key;
  };

  const encryptDecrypt = async () => {
    if (!crypto.subtle) {
      addLog("crypto.subtle not available — requires secure context");
      return;
    }
    addLog("--- Encrypt/Decrypt (AES-GCM) ---");

    try {
      // Step 10: Generate the key (reuse key generation function)
      const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );

      // Step 11: Prepare data to encrypt
      const encoder = new TextEncoder();
      const plaintext = "This is a secret message!";
      const encodedData = encoder.encode(plaintext);
      console.log(`Web Crypto API: Plaintext: "${plaintext}"`);

      // Step 12: Generate initialization vector (IV) for AES-GCM
      // IV should be unique per encryption (but not secret)
      // Recommended size: 12 bytes (96 bits) for GCM
      const iv = crypto.getRandomValues(new Uint8Array(12));
      console.log("Web Crypto API: Random IV generated:", Array.from(iv, b => b.toString(16).padStart(2, "0")).join(""));

      // Step 13: crypto.subtle.encrypt(algorithm, key, data) — encrypt data
      // AES-GCM requires additional data and tag length
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,                       // Initialization vector
          additionalData: undefined,    // Optional: authenticated but not encrypted data
          tagLength: 128,               // Authentication tag length in bits: 32,64,96,104,112,120,128
        },
        key,
        encodedData,
      );
      console.log("Web Crypto API: Encryption complete ✓");
      console.log("  Encrypted data length:", encrypted.byteLength, "bytes");
      console.log("  Encrypted (hex):", Array.from(new Uint8Array(encrypted), b => b.toString(16).padStart(2, "0")).join(""));
      addLog(`Encrypted ${encodedData.length} bytes → ${encrypted.byteLength} bytes`);

      // Step 14: crypto.subtle.decrypt — decrypt back to plaintext
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,                       // Must use the SAME IV as encryption
          tagLength: 128,               // Must match encryption tagLength
        },
        key,
        encrypted,
      );

      // Step 15: Decode the decrypted buffer back to string
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decrypted);
      console.log(`Web Crypto API: Decrypted text: "${decryptedText}"`);
      console.log("Web Crypto API: Decryption matches original:", decryptedText === plaintext);
      addLog(`Decrypted: "${decryptedText}" ✓`);

    } catch (err) {
      console.error("Web Crypto API: Encryption error:", err);
      addLog(`Error: ${(err as Error).message}`);
    }
  };

  const generateRSAKeyPair = async () => {
    if (!crypto.subtle) {
      addLog("crypto.subtle not available");
      return;
    }
    addLog("--- RSA Key Pair Generation ---");

    // Step 16: Generate RSA key pair for signing/verification
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5", // Algorithm for signing/verification
        modulusLength: 2048,        // Key size in bits
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 (common choice)
        hash: "SHA-256",            // Hash algorithm to use with RSA
      },
      true,                         // Extractable
      ["sign", "verify"],           // Key usages
    );

    console.log("Web Crypto API: RSA key pair generated ✓");
    console.log("  Public key type:", keyPair.publicKey.type);
    console.log("  Private key type:", keyPair.privateKey.type);
    addLog("RSA 2048-bit key pair generated ✓");

    // Step 17: Export public key as SPKI (SubjectPublicKeyInfo) for sharing
    const exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
    console.log("Web Crypto API: Public key (Base64, first 50 chars):", publicKeyBase64.substring(0, 50) + "...");
    addLog(`Public key exported (${publicKeyBase64.length} chars Base64)`);

    // Step 18: Sign data with the private key
    const encoder = new TextEncoder();
    const data = encoder.encode("Message to sign");
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      keyPair.privateKey,
      data,
    );
    console.log("Web Crypto API: Data signed ✓ — signature length:", signature.byteLength, "bytes");
    addLog(`Signed — signature: ${signature.byteLength} bytes`);

    // Step 19: Verify the signature with the public key
    const isValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      keyPair.publicKey,
      signature,
      data,
    );
    console.log("Web Crypto API: Signature verified:", isValid);
    addLog(`Signature verified: ${isValid ? "✓ valid" : "✗ invalid"}`);
  };

  const hmacSigning = async () => {
    if (!crypto.subtle) {
      addLog("crypto.subtle not available");
      return;
    }
    addLog("--- HMAC Signing ---");

    // Step 20: HMAC (Hash-based Message Authentication Code)
    // Uses a shared secret key + hash to verify message authenticity
    const encoder = new TextEncoder();

    // Step 21: Generate HMAC key
    const hmacKey = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign", "verify"],
    );

    const message = encoder.encode("Important transaction data");
    console.log("Web Crypto API: HMAC key generated ✓");

    // Step 22: Sign (create HMAC)
    const mac = await crypto.subtle.sign("HMAC", hmacKey, message);
    const macHex = Array.from(new Uint8Array(mac), b => b.toString(16).padStart(2, "0")).join("");
    console.log("Web Crypto API: HMAC created:", macHex.substring(0, 48) + "...");
    addLog(`HMAC: ${macHex.substring(0, 32)}...`);

    // Step 23: Verify HMAC
    const isValid = await crypto.subtle.verify("HMAC", hmacKey, mac, message);
    console.log("Web Crypto API: HMAC verified:", isValid);
    addLog(`HMAC verified: ${isValid ? "✓ valid" : "✗ invalid"}`);

    // Tamper detection: modified message should fail verification
    const tamperedMessage = encoder.encode("Tampered transaction data");
    const isTamperValid = await crypto.subtle.verify("HMAC", hmacKey, mac, tamperedMessage);
    console.log("Web Crypto API: Tampered message HMAC verification:", isTamperValid);
    addLog(`Tampered HMAC: ${isTamperValid ? "✗ (should be invalid!)" : "✓ correctly rejected"}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Web Crypto API</h1>
      <div className="alert alert-warning mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>Requires HTTPS/localhost for crypto.subtle. getRandomValues works in any context. Open DevTools Console.</span>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={randomNumbers}>Random Numbers & UUID</button>
          <button className="btn btn-secondary" onClick={hashing}>SHA-256 Hashing</button>
          <button className="btn btn-accent" onClick={encryptDecrypt}>AES-GCM Encrypt/Decrypt</button>
          <button className="btn btn-info" onClick={generateKey}>Generate AES Key</button>
          <button className="btn btn-success" onClick={generateRSAKeyPair}>RSA Key Pair & Sign</button>
          <button className="btn btn-warning" onClick={hmacSigning}>HMAC Sign/Verify</button>
        </div>
        {log.length > 0 && (
          <div className="mockup-code"><pre className="px-4 py-2 text-sm max-h-64 overflow-y-auto">{log.map((l, i) => <div key={i}>{l}</div>)}</pre></div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: Web Crypto API</a>
    </main>
  );
}