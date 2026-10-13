"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL API Demo
 *
 * Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
 *                https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
 *
 * WebGL (Web Graphics Library) is a JavaScript API for rendering
 * interactive 2D and 3D graphics in the browser without plugins.
 * It is based on OpenGL ES 2.0/3.0.
 */
export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Step 1: Get the WebGL rendering context from a canvas element
    // Options: "webgl" (OpenGL ES 2.0), "webgl2" (OpenGL ES 3.0), "experimental-webgl"
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) {
      console.error("WebGL API: Not supported in this browser.");
      return;
    }
    console.log("WebGL API: Supported ✓");
    console.log(`WebGL API: Context = ${gl instanceof WebGL2RenderingContext ? "WebGL2" : "WebGL1"}`);

    // Step 2: Get context information
    console.log("WebGL API: Context info:");
    console.log("  Vendor:", gl.getParameter(gl.VENDOR));
    console.log("  Renderer:", gl.getParameter(gl.RENDERER));
    console.log("  Version:", gl.getParameter(gl.VERSION));
    console.log("  Shading Language Version:", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    console.log("  Max Texture Size:", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    console.log("  Max Viewport DIMS:", gl.getParameter(gl.MAX_VIEWPORT_DIMS));
    console.log("  Extensions:", gl.getSupportedExtensions()?.slice(0, 5), "...");

    // Step 3: Check for specific extensions
    const hasAnisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
    console.log("  EXT_texture_filter_anisotropic:", !!hasAnisotropy);

    // Step 4: Set clear color (R, G, B, A) — values from 0.0 to 1.0
    gl.clearColor(0.1, 0.2, 0.3, 1.0);
    console.log("WebGL API: clearColor set to (0.1, 0.2, 0.3, 1.0)");

    // Step 5: Clear the color buffer (fills canvas with clearColor)
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log("WebGL API: COLOR_BUFFER_BIT cleared");

    // Step 6: Vertex shader source — processes each vertex position
    // GLSL (OpenGL Shading Language) code
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    // Step 7: Fragment shader source — determines pixel colors
    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // Orange color
      }
    `;

    // Step 8: Compile shaders
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    console.log("WebGL API: Vertex shader compiled ✓");
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    console.log("WebGL API: Fragment shader compiled ✓");

    // Step 9: Create shader program and link shaders
    const program = gl.createProgram();
    if (!program) {
      console.error("WebGL API: Failed to create program");
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    console.log("WebGL API: Shader program linked ✓");

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL API: Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Step 10: Use the program
    gl.useProgram(program);

    // Step 11: Set up geometry — create a triangle
    // Positions in clip space (-1.0 to 1.0)
    const positions = new Float32Array([
      0.0,  0.5,   // Top
     -0.5, -0.5,   // Bottom-left
      0.5, -0.5,   // Bottom-right
    ]);

    // Step 12: Create and bind a buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    console.log("WebGL API: Buffer created with triangle vertex data ✓");

    // Step 13: Get attribute location and configure it
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell WebGL how to read data from the buffer
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    console.log("WebGL API: Vertex attribute configured ✓");

    // Step 14: Set viewport to match canvas size
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Step 15: Draw the triangle
    // drawArrays(mode, first, count): mode = gl.TRIANGLES, gl.LINES, gl.POINTS
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    console.log("WebGL API: Triangle drawn via drawArrays(gl.TRIANGLES, 0, 3) ✓");

    // Step 16: Error checking
    const error = gl.getError();
    console.log(`WebGL API: Final error code: ${error} (0 = NO_ERROR)`);

    // Step 17: Cleanup shaders (no longer needed after linking)
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    console.log("WebGL API: Shaders deleted (cleanup) ✓");

  }, []);

  /**
   * Helper: Compile a WebGL shader from source.
   */
  function compileShader(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    type: number,
    source: string
  ): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const infoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation error: ${infoLog}`);
    }
    return shader;
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">WebGL API</h1>
      <div className="p-3 border border-blue-500 rounded-lg bg-blue-50 mb-4">
        <p>Open DevTools Console to see GPU info and rendering steps. An orange triangle is rendered on the canvas below.</p>
      </div>
      <canvas className="border border-gray-300 rounded-lg" ref={canvasRef} width={400} height={300}/>
      <a className="text-blue-600 hover:underline text-sm mt-4 inline-block" href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" target="_blank" rel="noopener noreferrer">MDN: WebGL API</a>
    </main>
  );
}