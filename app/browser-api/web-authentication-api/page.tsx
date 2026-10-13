"use client";

import { useState } from "react";

/**
 * Web Authentication API (WebAuthn) Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer
 *                https://www.w3.org/TR/webauthn-2/
 *
 * The Web Authentication API enables strong authentication with
 * public-key cryptography. It supports biometrics (fingerprint, face),
 * security keys (USB/NFC/BLE), and platform authenticators.
 *
 * ⚠️ Requires secure context (HTTPS/localhost).
 *    Server-side challenge generation is needed for production use.
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Ready");

  const checkSupport = (): boolean => {
    // Step 1: Check if WebAuthn is supported via PublicKeyCredential
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn API: Not supported in this browser.");
      setStatus("Not supported");
      return false;
    }
    console.log("WebAuthn API: Supported ✓");
    console.log("  PublicKeyCredential available on window");

    // Step 2: Check if platform authenticator is available (e.g., Touch ID, Windows Hello)
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
      console.log(`WebAuthn API: Platform authenticator available = ${available}`);
      if (available) {
        console.log("  (e.g., Touch ID on Mac, Windows Hello, Android biometrics)");
      }
    });
    return true;
  };

  const registerCredential = async () => {
    if (!checkSupport()) return;

    console.log("WebAuthn API: Starting credential registration (create)...");
    setStatus("Registering...");

    try {
      // Step 3: Generate challenge — must come from server in production
      // This is a demo-only static challenge (at least 16 bytes)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      console.log("WebAuthn API: Challenge generated (should come from server in production)");

      // Step 4: Configure PublicKeyCredentialCreationOptions
      // This defines the rules for the new credential
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        // Challenge: random bytes from server to prevent replay attacks
        challenge: challenge,

        // Step 5: rp (Relying Party) — identifies your web app
        rp: {
          name: "Browser API Demo",
          id: window.location.hostname, // must match current origin's domain
        },

        // Step 6: user — identifies the user account being registered
        user: {
          id: new Uint8Array(16), // Unique user ID from your server
          name: "demo@example.com",
          displayName: "Demo User",
        },

        // Step 7: pubKeyCredParams — acceptable credential algorithms
        // ES256 (-7) and RS256 (-257) are widely supported
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256 (ECDSA w/ SHA-256)
          { type: "public-key", alg: -257 }, // RS256 (RSASSA-PKCS1-v1_5 w/ SHA-256)
        ],

        // Step 8: timeout — max time in ms for user to complete interaction
        timeout: 60000,

        // Step 9: attestation — how much authenticator info to return
        // "none" = no attestation (most common), "direct" = full attestation
        attestation: "none",

        // Step 10: authenticatorSelection — criteria for the authenticator
        authenticatorSelection: {
          authenticatorAttachment: "platform", // "platform" = built-in (Touch ID etc), "cross-platform" = USB key
          userVerification: "preferred",       // "required", "preferred", "discouraged"
          residentKey: "preferred",
        },

        // Step 11: excludeCredentials — prevent registering same device twice
        excludeCredentials: [],
      };

      console.log("WebAuthn API: Calling navigator.credentials.create()...");
      console.log("  RP name:", publicKeyCredentialCreationOptions.rp.name);
      console.log("  User:", publicKeyCredentialCreationOptions.user.name);
      console.log("  Attestation:", publicKeyCredentialCreationOptions.attestation);

      // Step 12: navigator.credentials.create() — trigger registration
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      console.log("WebAuthn API: Credential created ✓");
      console.log("  ID:", credential.id);
      console.log("  Type:", credential.type);
      console.log("  AuthenticatorAttachment:", credential.authenticatorAttachment);

      // Step 13: The response contains attestation data to verify on server
      const response = credential.response as AuthenticatorAttestationResponse;
      console.log("  ClientDataJSON:", new TextDecoder().decode(response.clientDataJSON));
      console.log("  AttestationObject length:", response.attestationObject.byteLength, "bytes");

      setStatus("Registered ✓");

    } catch (err) {
      console.error("WebAuthn API: Registration failed:", err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  const authenticate = async () => {
    if (!checkSupport()) return;

    console.log("WebAuthn API: Starting authentication (get)...");
    setStatus("Authenticating...");

    try {
      // Step 14: Generate authentication challenge (from server in production)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Step 15: Configure PublicKeyCredentialRequestOptions
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        rpId: window.location.hostname,
        userVerification: "preferred",

        // Step 16: allowCredentials — limit to specific credentials
        // Empty array = allow any credential registered with this RP
        // For production, specify allowed credential IDs here
        allowCredentials: [],
      };

      console.log("WebAuthn API: Calling navigator.credentials.get()...");
      console.log("  RP ID:", publicKeyCredentialRequestOptions.rpId);

      // Step 17: navigator.credentials.get() — trigger authentication
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      console.log("WebAuthn API: Authentication successful ✓");
      console.log("  ID:", assertion.id);
      console.log("  Type:", assertion.type);

      const response = assertion.response as AuthenticatorAssertionResponse;
      console.log("  UserHandle:", response.userHandle ? new TextDecoder().decode(response.userHandle) : "none");
      console.log("  Signature length:", response.signature.byteLength, "bytes");

      setStatus("Authenticated ✓");

    } catch (err) {
      console.error("WebAuthn API: Authentication failed:", err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Web Authentication API</h1>
      <div className="p-3 border border-amber-500 rounded-lg bg-amber-50 mb-4">
        <p><strong>⚠️</strong> Requires HTTPS/localhost. Needs platform authenticator (Touch ID, Windows Hello, etc). Server-side challenge needed for prod.</p>
      </div>
      <div>
        <p className="mb-3">Status: <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{status}</span></p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={registerCredential}>Register Credential</button>
          <button className="px-3 py-1.5 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300" onClick={authenticate}>Authenticate</button>
        </div>
      </div>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API" target="_blank" rel="noopener noreferrer">MDN: Web Authentication API</a>
    </main>
  );
}