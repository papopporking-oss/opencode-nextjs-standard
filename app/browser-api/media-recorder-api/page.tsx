"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MediaRecorder API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
 *                https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
 *
 * The MediaRecorder API records audio and/or video from a MediaStream.
 * It produces Blob data that can be played back or uploaded.
 *
 * ⚠️ Requires secure context (HTTPS/localhost) and user media permission.
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Ready");
  const [recordingUrl, setRecordingUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Step 1: Check MediaRecorder API support
    if (!window.MediaRecorder) {
      console.error("MediaRecorder API: Not supported in this browser.");
      setStatus("Not supported");
      return;
    }
    console.log("MediaRecorder API: Supported ✓");

    // Step 2: Check which MIME types are supported for recording
    // Different browsers support different codecs
    const mimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=h264,opus",
      "video/webm",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    console.log("MediaRecorder API: Checking supported MIME types:");
    mimeTypes.forEach((mime) => {
      const supported = MediaRecorder.isTypeSupported(mime);
      console.log(`  ${mime} => ${supported ? "✓" : "✗"}`);
    });

    return () => {
      // Cleanup: revoke object URL
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl]);

  const startRecording = async () => {
    console.log("MediaRecorder API: Starting recording...");
    setStatus("Requesting microphone...");

    try {
      // Step 3: Get a MediaStream from microphone (audio only)
      // Could also include video: true for screen/camera recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("MediaRecorder API: MediaStream obtained ✓");
      console.log("  Audio tracks:", stream.getAudioTracks().length);

      // Step 4: Choose a supported MIME type
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
      }
      console.log(`MediaRecorder API: Selected MIME type: ${mimeType}`);

      // Step 5: Configure MediaRecorder options
      const options: MediaRecorderOptions = {
        mimeType: mimeType,
        // audioBitsPerSecond: 128000, // 128 kbps audio quality
        // videoBitsPerSecond: 2500000, // Only for video
        // bitsPerSecond: combined bitrate (overrides individual bitrates)
      };
      console.log("MediaRecorder API: Options:", options);

      // Step 6: Create the MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      console.log("MediaRecorder API: MediaRecorder created ✓");
      console.log("  State:", mediaRecorder.state); // "inactive"

      // Step 7: ondataavailable — fired when data chunk is ready
      // The timeslice in start(timeslice) determines interval in ms
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log(`MediaRecorder API: Data chunk available — size: ${event.data.size} bytes, type: ${event.data.type}`);
        }
      };

      // Step 8: onstart — recording has begun
      mediaRecorder.onstart = () => {
        console.log("MediaRecorder API: Recording started ✓");
        console.log("  State:", mediaRecorder.state); // "recording"
        setStatus("Recording... speak now");
      };

      // Step 9: onstop — recording has stopped
      mediaRecorder.onstop = () => {
        console.log("MediaRecorder API: Recording stopped ✓");
        console.log("  State:", mediaRecorder.state); // "inactive"
        console.log(`  Total chunks collected: ${chunksRef.current.length}`);

        // Step 10: Combine all chunks into a single Blob
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log(`MediaRecorder API: Final recording Blob — size: ${blob.size} bytes, type: ${blob.type}`);

        // Step 11: Create an object URL for playback/download
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        console.log(`MediaRecorder API: Object URL created: ${url}`);

        // Step 12: Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log(`MediaRecorder API: Track stopped: ${track.kind}`);
        });

        setStatus(`Recorded: ${(blob.size / 1024).toFixed(1)} KB`);
      };

      // Step 13: onerror — recording error
      mediaRecorder.onerror = (event: Event) => {
        console.error("MediaRecorder API: Error:", (event as ErrorEvent).error || event);
        setStatus("Recording error");
      };

      // Step 14: onpause / onresume — for pause/resume functionality
      mediaRecorder.onpause = () => {
        console.log("MediaRecorder API: Recording paused");
        setStatus("Paused");
      };

      mediaRecorder.onresume = () => {
        console.log("MediaRecorder API: Recording resumed");
        setStatus("Recording...");
      };

      // Step 15: Start recording with timeslice (ms interval for dataavailable)
      // timeslice = 1000 means dataavailable fires every 1 second
      mediaRecorder.start(1000);
      console.log("MediaRecorder API: mediaRecorder.start(1000) called — timeslice 1s");

    } catch (err) {
      console.error("MediaRecorder API: Failed to start:", err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      console.warn("MediaRecorder API: No active recording to stop.");
      return;
    }

    console.log("MediaRecorder API: Stopping recording...");
    mediaRecorder.stop();
  };

  const pauseRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === "recording") {
      console.log("MediaRecorder API: Pausing recording...");
      mediaRecorder.pause();
    }
  };

  const resumeRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === "paused") {
      console.log("MediaRecorder API: Resuming recording...");
      mediaRecorder.resume();
    }
  };

  const requestDataNow = () => {
    // Step 16: requestData() — trigger ondataavailable immediately
    // Useful before stopping to get remaining data
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === "recording") {
      console.log("MediaRecorder API: Requesting data chunk now...");
      mediaRecorder.requestData();
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">MediaRecorder API</h1>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Requires secure context + microphone permission. Open DevTools Console. Speak into microphone to record.</span>
      </div>
      <div className="space-y-4">
        <p>Status: <span className="badge badge-outline">{status}</span></p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={startRecording}>Start Recording</button>
          <button className="btn btn-error" onClick={stopRecording}>Stop</button>
          <button className="btn btn-secondary" onClick={pauseRecording}>Pause</button>
          <button className="btn btn-accent" onClick={resumeRecording}>Resume</button>
          <button className="btn btn-ghost" onClick={requestDataNow}>Request Data</button>
        </div>
        {recordingUrl && (
          <div>
            <audio src={recordingUrl} controls className="w-full max-w-md"/>
            <p className="text-xs mt-1">Recorded audio playback</p>
          </div>
        )}
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder" target="_blank" rel="noopener noreferrer" className="link link-primary mt-4 inline-block">MDN: MediaRecorder API</a>
    </main>
  );
}