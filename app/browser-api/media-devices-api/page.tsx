"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MediaDevices API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
 *                https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * The MediaDevices API provides access to connected media input devices
 * like cameras and microphones, as well as screen sharing.
 */
export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    // Step 1: Check if mediaDevices is supported (secure context required)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("MediaDevices API: Not supported or not in secure context (HTTPS/localhost).");
      return;
    }
    console.log("MediaDevices API: Supported ✓");

    // Step 2: enumerateDevices — list all available media input/output devices
    // Returns: audioinput, audiooutput, videoinput devices with labels (if permission granted)
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
      console.log("MediaDevices API: Enumerated devices:");
      devices.forEach((device, index) => {
        console.log(`  [${index}] kind=${device.kind}, label="${device.label}", deviceId=${device.deviceId}`);
      });
      setDeviceList(devices);
    }).catch((err: Error) => {
      console.error("MediaDevices API: enumerateDevices error:", err);
    });

    // Step 3: Listen for device changes (plug/unplug)
    navigator.mediaDevices.addEventListener("devicechange", () => {
      console.log("MediaDevices API: Device list changed — re-enumerating");
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        console.log("MediaDevices API: Updated device list:", devices.map(d => d.label));
        setDeviceList(devices);
      });
    });

    // Step 4: getUserMedia — request camera and/or microphone access
    // Constraints configure which devices and settings to request
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user", // front camera on mobile
      },
      audio: false, // set true to also request microphone
    };
    console.log("MediaDevices API: Requesting user media with constraints:", constraints);

    navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {
      console.log("MediaDevices API: Stream obtained");
      console.log("  Stream ID:", stream.id);
      console.log("  Active:", stream.active);

      // Step 5: Enumerate tracks in the stream
      stream.getTracks().forEach((track, i) => {
        console.log(`  Track[${i}]: kind=${track.kind}, label="${track.label}", enabled=${track.enabled}`);
      });

      // Step 6: Attach stream to a video element for preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("MediaDevices API: Stream attached to video element");
      }
    }).catch((err: Error) => {
      console.error("MediaDevices API: getUserMedia error:", err.name, err.message);
    });

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`MediaDevices API: Track stopped: ${track.kind}`);
        });
      }
    };
  }, []);

  return (
    <main>
      <h1>MediaDevices API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console to see device enumeration and stream details. Camera permission is required.</p>
      </div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "448px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "16px" }}/>
      {deviceList.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Kind</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Label</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Device ID</th>
            </tr>
          </thead>
          <tbody>
            {deviceList.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{d.kind}</td>
                <td style={{ padding: "8px" }}>{d.label}</td>
                <td style={{ padding: "8px", fontSize: "12px", fontFamily: "monospace" }}>{d.deviceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices" target="_blank" rel="noopener noreferrer">MDN: MediaDevices API</a>
    </main>
  );
}