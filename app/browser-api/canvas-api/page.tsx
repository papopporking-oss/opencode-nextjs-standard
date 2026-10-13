"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 *
 * The Canvas API provides a 2D drawing surface via the <canvas> HTML element.
 * It supports shapes, text, images, gradients, transforms, and pixel manipulation.
 */
export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Step 1: Get the 2D rendering context from the canvas element
    // Other contexts: "webgl", "webgl2", "bitmaprenderer"
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas API: 2D context not supported in this browser.");
      return;
    }
    console.log("Canvas API: 2D context obtained ✓");

    // Step 2: Canvas state properties
    console.log("Canvas API: Canvas dimensions:", canvas.width, "×", canvas.height);
    console.log("  Device pixel ratio:", window.devicePixelRatio);

    // Step 3: Fill a rectangle (filled shape)
    // fillStyle sets the fill color/paint
    ctx.fillStyle = "#4CAF50"; // Green
    // fillRect(x, y, width, height)
    ctx.fillRect(10, 10, 100, 60);
    console.log("Canvas API: fillRect(10, 10, 100, 60) — green rectangle");

    // Step 4: Stroke a rectangle (outlined shape)
    ctx.strokeStyle = "#2196F3"; // Blue
    ctx.lineWidth = 3; // Width of the stroke line in pixels
    ctx.strokeRect(130, 10, 100, 60);
    console.log("Canvas API: strokeRect(130, 10, 100, 60) — blue outlined rectangle, lineWidth=3");

    // Step 5: Clear a rectangular area (transparent hole)
    ctx.clearRect(20, 20, 50, 30); // Erase part of the green rectangle
    console.log("Canvas API: clearRect(20, 20, 50, 30) — erased section");

    // Step 6: Draw paths (lines, arcs, curves)
    // beginPath starts a new path — always call before drawing
    ctx.beginPath();
    // moveTo sets the starting point of the path
    ctx.moveTo(250, 10);
    // lineTo adds a line to the specified point
    ctx.lineTo(350, 40);
    ctx.lineTo(300, 70);
    // closePath connects the last point back to the start
    ctx.closePath();
    ctx.strokeStyle = "#FF9800"; // Orange
    ctx.lineWidth = 2;
    // stroke renders the path outline
    ctx.stroke();
    console.log("Canvas API: Path drawn — triangle via moveTo, lineTo, closePath, stroke");

    // Fill the triangle with semi-transparent color
    ctx.fillStyle = "rgba(255, 152, 0, 0.3)"; // Semi-transparent orange
    ctx.fill();
    console.log("Canvas API: Path filled with semi-transparent orange");

    // Step 7: Draw a circle / arc
    ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle, counterclockwise)
    // Angles are in radians: 0 to 2*PI = full circle
    ctx.arc(410, 40, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#E91E63"; // Pink
    ctx.fill();
    ctx.strokeStyle = "#C2185B"; // Darker pink
    ctx.stroke();
    console.log("Canvas API: arc(410, 40, 30, 0, 2*PI) — filled circle with stroke");

    // Step 8: Draw text
    ctx.font = "bold 20px sans-serif"; // CSS font string: [style] [weight] size family
    ctx.fillStyle = "#333333";
    // fillText(text, x, y, maxWidth?)
    ctx.fillText("Hello Canvas!", 10, 110);
    console.log("Canvas API: fillText('Hello Canvas!', 10, 110) — bold 20px text");

    ctx.font = "italic 14px serif";
    ctx.strokeStyle = "#000000";
    ctx.strokeText("Stroke Text", 10, 140);
    console.log("Canvas API: strokeText('Stroke Text', 10, 140)");

    // Step 9: Text measurement
    const textMetrics = ctx.measureText("Hello Canvas!");
    console.log("Canvas API: Text metrics for 'Hello Canvas!':");
    console.log("  width:", textMetrics.width);
    console.log("  actualBoundingBoxLeft:", textMetrics.actualBoundingBoxLeft);
    console.log("  actualBoundingBoxRight:", textMetrics.actualBoundingBoxRight);

    // Step 10: Draw an image (programmatically created)
    const img = new Image();
    img.onload = () => {
      // drawImage(image, x, y, width?, height?)
      ctx.drawImage(img, 160, 100, 80, 80);
      console.log("Canvas API: drawImage — image drawn at (160, 100), 80×80");
    };
    img.src = "https://picsum.photos/80";

    // Step 11: Gradients
    // Linear gradient
    const linearGrad = ctx.createLinearGradient(260, 100, 340, 180);
    // addColorStop(offset 0-1, color)
    linearGrad.addColorStop(0, "#FF0000"); // Red at start
    linearGrad.addColorStop(0.5, "#00FF00"); // Green at middle
    linearGrad.addColorStop(1, "#0000FF");   // Blue at end
    ctx.fillStyle = linearGrad;
    ctx.fillRect(260, 100, 80, 80);
    console.log("Canvas API: Linear gradient fillRect — red→green→blue");

    // Radial gradient
    const radialGrad = ctx.createRadialGradient(410, 140, 5, 410, 140, 40);
    radialGrad.addColorStop(0, "white");
    radialGrad.addColorStop(1, "#9C27B0"); // Purple
    ctx.fillStyle = radialGrad;
    ctx.fillRect(360, 100, 100, 80);
    console.log("Canvas API: Radial gradient fillRect — white center→purple edge");

    // Step 12: Transformations (save/restore context state)
    ctx.save(); // Save current state (position, rotation, styles, etc.)
    console.log("Canvas API: ctx.save() — saved transform state");

    // Translate (move origin)
    ctx.translate(20, 280);
    console.log("Canvas API: translate(20, 280)");

    // Rotate (angle in radians, 45° = PI/4)
    ctx.rotate(Math.PI / 6); // 30 degrees
    console.log("Canvas API: rotate(PI/6) — 30 degrees");

    ctx.fillStyle = "#00BCD4"; // Cyan
    ctx.fillRect(0, 0, 80, 40);
    console.log("Canvas API: Transformed rectangle drawn");

    ctx.restore(); // Restore previous state (undo translate/rotate)
    console.log("Canvas API: ctx.restore() — restored previous state");

    // Step 13: Global compositing and opacity
    ctx.globalAlpha = 0.5; // 50% transparency for all subsequent drawing
    ctx.fillStyle = "#FF5722"; // Deep orange
    ctx.fillRect(120, 260, 60, 60);
    ctx.fillStyle = "#2196F3"; // Blue
    ctx.fillRect(150, 290, 60, 60);
    console.log("Canvas API: globalAlpha=0.5 — overlapping semi-transparent squares");

    // Reset alpha
    ctx.globalAlpha = 1.0;

    // Step 14: Pixel manipulation with ImageData
    const imageData = ctx.getImageData(10, 10, 1, 1);
    console.log("Canvas API: getImageData(10, 10, 1, 1) — single pixel data:");
    console.log("  RGBA:", imageData.data[0], imageData.data[1], imageData.data[2], imageData.data[3]);

    // Step 15: Clip region — restrict drawing area
    ctx.beginPath();
    ctx.arc(250, 270, 30, 0, 2 * Math.PI);
    ctx.clip(); // Only draw inside this circle
    console.log("Canvas API: clip() — circular clipping region set");

    // Fill the entire area (only inside the clip circle will show)
    ctx.fillStyle = "#FFC107"; // Amber
    ctx.fillRect(200, 230, 100, 80);
    console.log("Canvas API: fillRect clipped to circle — only the overlapping part visible");

    // Step 16: Shadows
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10; // Blur radius
    ctx.shadowOffsetX = 5; // Horizontal offset
    ctx.shadowOffsetY = 5; // Vertical offset
    ctx.fillStyle = "#8BC34A"; // Light green
    ctx.fillRect(310, 250, 80, 60);
    console.log("Canvas API: Shadow effect — blur=10, offset=(5,5)");
    // Reset shadows
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Step 17: Hit regions / isPointInPath (detect if point is inside a path)
    ctx.beginPath();
    ctx.arc(100, 350, 30, 0, 2 * Math.PI);
    const hitPointX = 100, hitPointY = 350;
    const isInside = ctx.isPointInPath(hitPointX, hitPointY);
    console.log(`Canvas API: isPointInPath(${hitPointX}, ${hitPointY}) = ${isInside}`);

  }, []);

  return (
    <main>
      <h1>Canvas API</h1>
      <div style={{ padding: "12px", border: "1px solid #3498db", borderRadius: "8px", backgroundColor: "#eaf2f8", marginBottom: "16px" }}>
        <p>Open DevTools Console to see drawing steps. Shapes, text, gradients, transforms, and pixel data are logged.</p>
      </div>
      <canvas ref={canvasRef} width={500} height={400} style={{ border: "1px solid #ccc", borderRadius: "8px", maxWidth: "100%" }}/>
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer">MDN: Canvas API</a>
    </main>
  );
}