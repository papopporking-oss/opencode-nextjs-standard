"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Web Audio API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 *
 * The Web Audio API provides powerful audio processing and synthesis
 * capabilities. It works with audio nodes connected into an audio graph.
 *
 * ⚠️ AudioContext requires a user gesture to start (autoplay policy).
 */
export default function Page() {
  const [status, setStatus] = useState<string>("Not started");
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Step 1: Check Web Audio API support
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      console.error("Web Audio API: Not supported in this browser.");
      setStatus("Not supported");
      return;
    }
    console.log("Web Audio API: Supported ✓");

    // Step 2: Create an AudioContext — the central object for all audio operations
    // AudioContextOptions: sampleRate, latencyHint
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass({
      sampleRate: 44100,    // Standard CD-quality sample rate (optional, default = system default)
      latencyHint: "interactive", // "balanced", "interactive" (low latency), "playback"
    });
    audioContextRef.current = audioCtx;

    console.log("AudioContext created ✓");
    console.log("  Sample rate:", audioCtx.sampleRate, "Hz");
    console.log("  State:", audioCtx.state); // "suspended" (autoplay policy) or "running"
    console.log("  Destination:", audioCtx.destination.constructor.name);
    console.log("  Base latency:", audioCtx.baseLatency, "seconds");

    setStatus(`AudioContext: ${audioCtx.state} (click button to start)`);

    return () => {
      // Step 3: Close the AudioContext when unmounting to free resources
      if (audioCtx.state !== "closed") {
        audioCtx.close().then(() => {
          console.log("Web Audio API: AudioContext closed on unmount");
        });
      }
    };
  }, []);

  const playTone = () => {
    const audioCtx = audioContextRef.current;
    if (!audioCtx) return;

    // Step 4: Resume AudioContext if suspended (required due to autoplay policy)
    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(() => {
        console.log("Web Audio API: AudioContext resumed ✓ — state:", audioCtx.state);
      });
    }

    console.log("Web Audio API: Building audio graph for tone...");
    setStatus("Playing tone...");

    // Step 5: Create an OscillatorNode — generates a periodic waveform (sound source)
    const oscillator = audioCtx.createOscillator();
    // Configure oscillator properties
    oscillator.type = "sine";    // Waveform: "sine", "square", "sawtooth", "triangle"
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz = A4 note
    console.log("  Oscillator: type=sine, frequency=440Hz (A4 note)");

    // Step 6: Create a GainNode — controls volume (amplitude)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); // 0.3 = 30% volume
    console.log("  GainNode: gain=0.3 (30% volume)");

    // Step 7: Connect nodes in the audio graph
    // Signal flow: Oscillator -> Gain -> Destination (speakers)
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    console.log("  Audio graph: Oscillator -> Gain -> Destination ✓");

    // Step 8: Start the oscillator
    oscillator.start(audioCtx.currentTime);
    console.log("  Oscillator started ✓");

    // Step 9: Schedule stop after 1 second
    oscillator.stop(audioCtx.currentTime + 1);
    console.log("  Oscillator scheduled to stop after 1 second");

    oscillator.onended = () => {
      console.log("Web Audio API: Oscillator stopped (ended event)");
      setStatus("Tone finished");
    };
  };

  const playMelody = () => {
    const audioCtx = audioContextRef.current;
    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    console.log("Web Audio API: Playing melody...");
    setStatus("Playing melody...");

    // Step 10: Multi-note melody using scheduled frequency changes
    // Notes: C4(262), D4(294), E4(330), F4(349), G4(392), A4(440), B4(494), C5(523)
    const notes = [262, 294, 330, 349, 392, 440, 494, 523];
    const noteDuration = 0.15; // seconds per note

    const oscillator = audioCtx.createOscillator();
    oscillator.type = "triangle";

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    // Step 11: Schedule frequency changes for each note
    notes.forEach((freq, i) => {
      const startTime = audioCtx.currentTime + i * noteDuration;
      oscillator.frequency.setValueAtTime(freq, startTime);
      console.log(`  Note[${i}]: ${freq}Hz at t=${startTime.toFixed(2)}s`);
    });

    // Step 12: Schedule gain envelope (fade out at the end)
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + notes.length * noteDuration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + notes.length * noteDuration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + notes.length * noteDuration);

    console.log("Web Audio API: Melody started ✓ — total duration:", (notes.length * noteDuration).toFixed(2), "s");
    oscillator.onended = () => {
      console.log("Web Audio API: Melody finished");
      setStatus("Melody finished");
    };
  };

  const analyzeAudio = async () => {
    const audioCtx = audioContextRef.current;
    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    console.log("Web Audio API: Creating analyzer node...");
    setStatus("Analyzing...");

    // Step 13: Create an AnalyserNode for frequency/amplitude analysis
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // FFT size: must be power of 2 (32, 64, ..., 2048, ..., 32768)
    console.log("  AnalyserNode: fftSize=2048");

    // Create a test tone and connect through the analyzer
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);

    // Step 14: Read frequency data from the analyzer
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get frequency domain data
    analyser.getByteFrequencyData(dataArray);
    console.log(`  Frequency data: ${bufferLength} bins`);
    console.log(`  First 10 bins:`, Array.from(dataArray.slice(0, 10)));

    // Get time domain data (waveform)
    const timeDataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDataArray);
    console.log(`  Time domain data: first 10 samples:`, Array.from(timeDataArray.slice(0, 10)));

    // Step 15: Get additional analyzer info
    console.log("  Frequency bin count:", analyser.frequencyBinCount);
    console.log("  Min decibels:", analyser.minDecibels);
    console.log("  Max decibels:", analyser.maxDecibels);
    console.log("  Smoothing time constant:", analyser.smoothingTimeConstant);

    oscillator.stop(audioCtx.currentTime + 0.5);
    oscillator.onended = () => {
      console.log("Web Audio API: Analysis complete");
      setStatus("Analysis complete");
    };
  };

  return (
    <main>
      <h1>Web Audio API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console. Click buttons to play audio. First click resumes AudioContext (autoplay policy).</p>
      </div>
      <div>
        <p>Status: <span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}>{status}</span></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          <button onClick={playTone}>Play 440Hz Tone</button>
          <button onClick={playMelody}>Play C-Major Scale</button>
          <button onClick={analyzeAudio}>Analyze Audio</button>
        </div>
      </div>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" rel="noopener noreferrer">MDN: Web Audio API</a>
    </main>
  );
}