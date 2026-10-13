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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">MediaDevices API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Open DevTools Console to see device enumeration & stream details. Camera permission is required.</span>
      </div>
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg border mb-4"/>
      {deviceList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Kind</th><th>Label</th><th>Device ID</th></tr></thead>
            <tbody>{deviceList.map((d, i) => (<tr key={i}><td>{d.kind}</td><td>{d.label}</td><td className="text-xs font-mono">{d.deviceId}</td></tr>))}</tbody>
          </table>
        </div>
      )}
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices" target="_blank" rel="noopener noreferrer" className="link link-primary">MDN: MediaDevices API</a>
    </main>
  );
}