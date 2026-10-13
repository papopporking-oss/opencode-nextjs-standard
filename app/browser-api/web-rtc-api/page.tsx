"use client";

import { useEffect, useRef, useState } from "react";

/**
 * WebRTC API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection
 *                https://www.w3.org/TR/webrtc/
 *
 * WebRTC (Web Real-Time Communication) enables peer-to-peer
 * audio, video, and data sharing between browsers without plugins.
 * It requires signaling server for peer discovery (not included here).
 *
 * ⚠️ Requires secure context (HTTPS/localhost).
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Ready");
  const [rtcInfo, setRtcInfo] = useState<string[]>([]);

  useEffect(() => {
    // Step 1: Check WebRTC API support
    // RTCPeerConnection is the core interface
    if (!window.RTCPeerConnection) {
      console.error("WebRTC API: Not supported in this browser.");
      setStatus("Not supported");
      return;
    }
    console.log("WebRTC API: Supported ✓");
    console.log("  RTCPeerConnection available on window");

    // Step 2: Check for specific WebRTC features
    console.log("WebRTC API: Feature detection:");
    console.log("  RTCDataChannel:", !!window.RTCDataChannel);
    console.log("  RTCSessionDescription:", !!window.RTCSessionDescription);
    console.log("  RTCIceCandidate:", !!window.RTCIceCandidate);
    console.log("  MediaStream:", !!window.MediaStream);

    // Step 3: Check if getUserMedia is available (for audio/video)
    const hasGetUserMedia = !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function");
    if (hasGetUserMedia) {
      console.log("  getUserMedia: ✓ (audio/video capture available)");
    } else {
      console.log("  getUserMedia: ✗ (not available)");
    }
  }, []);

  const createPeerConnection = () => {
    console.log("WebRTC API: Creating RTCPeerConnection...");
    setStatus("Creating peer connection...");

    // Step 4: Configure RTCConfiguration with ICE servers
    // ICE servers help peers discover each other through NATs/firewalls
    const configuration: RTCConfiguration = {
      // Step 5: iceServers — STUN/TURN servers for NAT traversal
      // STUN: Returns public IP (for direct connections)
      // TURN: Relays media when direct connection fails
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",           // Google public STUN server
            "stun:stun1.l.google.com:19302",
          ],
        },
        // TURN server example (requires authentication, not used in demo):
        // {
        //   urls: "turn:turn.example.com:3478",
        //   username: "user",
        //   credential: "password",
        // },
      ],
      // Step 6: iceTransportPolicy
      // "all" = try any connection (default)
      // "relay" = only use TURN relay (no direct P2P)
      iceTransportPolicy: "all",
      // Step 7: iceCandidatePoolSize — pre-gather candidates
      iceCandidatePoolSize: 2,
    };
    console.log("WebRTC API: RTCConfiguration:", configuration);
    console.log("  ICE servers:", configuration.iceServers?.map(s => s.urls).flat());

    // Step 8: Create RTCPeerConnection instance
    const pc = new RTCPeerConnection(configuration);
    console.log("WebRTC API: RTCPeerConnection created ✓");
    setStatus("Peer connection created");

    const info: string[] = [];

    // Step 9: onicecandidate — new ICE candidate discovered
    // These need to be sent to the remote peer via signaling channel
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        console.log("WebRTC API: ICE candidate found:");
        console.log("  Candidate:", event.candidate.candidate);
        console.log("  SDP Mid:", event.candidate.sdpMid);
        console.log("  SDP MLine Index:", event.candidate.sdpMLineIndex);
        console.log("  Type:", event.candidate.type); // host, srflx, relay
        console.log("  Protocol:", event.candidate.protocol); // udp, tcp
        console.log("  Address:", event.candidate.address);
        console.log("  Port:", event.candidate.port);
        info.push(`ICE candidate: ${event.candidate.type} (${event.candidate.address})`);
      } else {
        console.log("WebRTC API: ICE candidate gathering complete (null candidate)");
        info.push("ICE gathering complete");
      }
    };

    // Step 10: oniceconnectionstatechange — ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log(`WebRTC API: ICE connection state: ${pc.iceConnectionState}`);
      // States: new, checking, connected, completed, failed, disconnected, closed
      info.push(`ICE state: ${pc.iceConnectionState}`);
      setStatus(`ICE: ${pc.iceConnectionState}`);
    };

    // Step 11: onsignalingstatechange — signaling state changes
    pc.onsignalingstatechange = () => {
      console.log(`WebRTC API: Signaling state: ${pc.signalingState}`);
      // States: stable, have-local-offer, have-remote-offer, have-local-pranswer, have-remote-pranswer, closed
      info.push(`Signaling: ${pc.signalingState}`);
    };

    // Step 12: onconnectionstatechange — overall connection state
    pc.onconnectionstatechange = () => {
      console.log(`WebRTC API: Connection state: ${pc.connectionState}`);
      // States: new, connecting, connected, disconnected, failed, closed
      info.push(`Connection: ${pc.connectionState}`);
      setStatus(`Connection: ${pc.connectionState}`);
    };

    // Step 13: ondatalink — receive data channel from remote peer
    pc.ondatachannel = (event: RTCDataChannelEvent) => {
      const channel = event.channel;
      console.log(`WebRTC API: Remote data channel received: "${channel.label}"`);
      console.log("  Label:", channel.label);
      console.log("  Ordered:", channel.ordered);
      info.push(`Data channel: ${channel.label}`);

      channel.onmessage = (msgEvent: MessageEvent) => {
        console.log("WebRTC API: Data channel message:", msgEvent.data);
        info.push(`Data: ${msgEvent.data}`);
      };
    };

    // Step 14: Create a data channel for text/data exchange
    const dataChannel = pc.createDataChannel("demo-channel", {
      ordered: true,     // Guarantee message order
      maxRetransmits: 3, // Max retransmission attempts (or maxPacketLifeTime)
    });
    console.log(`WebRTC API: Data channel created: "${dataChannel.label}"`);

    dataChannel.onopen = () => {
      console.log("WebRTC API: Data channel opened ✓");
      info.push("Data channel open");
    };

    dataChannel.onclose = () => {
      console.log("WebRTC API: Data channel closed");
    };

    dataChannel.onmessage = (event: MessageEvent) => {
      console.log("WebRTC API: Data channel message received:", event.data);
    };

    dataChannel.onerror = (event: Event) => {
      console.error("WebRTC API: Data channel error:", event);
    };

    // Step 15: Get local SDP (Session Description Protocol)
    // This would be sent to the remote peer via signaling
    pc.createOffer().then((offer) => {
      console.log("WebRTC API: Local offer created:");
      console.log("  Type:", offer.type); // "offer"
      console.log("  SDP preview:", offer.sdp?.substring(0, 200) + "...");

      // Step 16: Set local description (stores our SDP locally)
      return pc.setLocalDescription(offer);
    }).then(() => {
      console.log("WebRTC API: Local description set ✓");
      info.push("Offer created & local description set");
    }).catch((err) => {
      console.error("WebRTC API: createOffer/setLocalDescription error:", err);
    });

    // Step 17: Get connection statistics for monitoring
    setTimeout(() => {
      pc.getStats().then((stats) => {
        console.log("WebRTC API: Connection statistics:");
        stats.forEach((report) => {
          console.log(`  ${report.type}:`, report);
        });
      });
    }, 2000);

    setRtcInfo(info);
  };

  const checkRTCSupport = () => {
    console.log("WebRTC API: Checking comprehensive support...");

    // Step 18: navigator.mediaDevices.getSupportedConstraints()
    // Lists all constraints the browser's getUserMedia supports
    if (navigator.mediaDevices?.getSupportedConstraints) {
      const constraints = navigator.mediaDevices.getSupportedConstraints();
      console.log("WebRTC API: Supported media constraints:", Object.keys(constraints).filter(k => (constraints as any)[k]));
    }

    // Step 19: enumerates devices (cameras, mics) via MediaDevices
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log(`WebRTC API: ${devices.length} media device(s) available:`);
        devices.forEach((d) => console.log(`  ${d.kind}: "${d.label}"`));
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">WebRTC API</h1>
      <div className="alert alert-warning mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>Requires HTTPS/localhost. Full P2P needs a signaling server. This demo shows RTCPeerConnection setup and ICE. Open DevTools Console.</span>
      </div>
      <div className="space-y-4">
        <p>Status: <span className="badge badge-outline">{status}</span></p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={createPeerConnection}>Create Peer Connection</button>
          <button className="btn btn-secondary" onClick={checkRTCSupport}>Check RTC Support</button>
        </div>
        {rtcInfo.length > 0 && (
          <div className="mockup-code"><pre className="px-4 py-2 text-sm">{rtcInfo.map((l, i) => <div key={i}>{l}</div>)}</pre></div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: WebRTC API</a>
    </main>
  );
}