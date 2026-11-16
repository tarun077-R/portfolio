'use client';

import React, { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  v_uv.y = 1.0 - v_uv.y; // Top-left origin matching pointer coordinates
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_imageResolution;
uniform vec2 u_pointer;
uniform vec2 u_trail[9];
uniform float u_strength;
uniform float u_time;

void main() {
  // Center-cover aspect ratio mapping
  float canvasAspect = u_resolution.x / u_resolution.y;
  float imageAspect = u_imageResolution.x / u_imageResolution.y;

  vec2 uv = v_uv;
  if (canvasAspect > imageAspect) {
    float scale = imageAspect / canvasAspect;
    uv.y = (uv.y - 0.5) * scale + 0.5;
  } else {
    float scale = canvasAspect / imageAspect;
    uv.x = (uv.x - 0.5) * scale + 0.5;
  }

  // Minimal, silky fluid ripple and distortion
  vec2 totalDisplacement = vec2(0.0);
  float totalGlow = 0.0;

  // Ultra-subtle pointer displacement & soft warm tint
  vec2 pDiff = v_uv - u_pointer;
  pDiff.x *= canvasAspect;
  float pDist = length(pDiff);
  float pRipple = sin(pDist * 22.0 - u_time * 3.5) * exp(-pDist * 8.5);
  // Kept minimal (0.0035) so face features remain crisp and natural
  totalDisplacement += normalize(pDiff + vec2(0.0001)) * pRipple * 0.0035 * u_strength;
  totalGlow += exp(-pDist * 6.5) * 0.07 * u_strength;

  // Subtle trailing nodes
  for (int i = 0; i < 9; i++) {
    vec2 tDiff = v_uv - u_trail[i];
    tDiff.x *= canvasAspect;
    float tDist = length(tDiff);
    float weight = 1.0 - (float(i) / 9.0);
    float tRipple = sin(tDist * 18.0 - u_time * 3.0 + float(i) * 0.3) * exp(-tDist * 9.5);
    totalDisplacement += normalize(tDiff + vec2(0.0001)) * tRipple * (0.0018 * weight) * u_strength;
    totalGlow += exp(-tDist * 8.0) * (0.03 * weight) * u_strength;
  }

  vec2 distortedUv = uv + totalDisplacement;

  // Restrained, elegant chromatic separation (minimal whisper)
  vec2 chromaOffset = totalDisplacement * 0.35;
  float r = texture2D(u_image, distortedUv + chromaOffset).r;
  float g = texture2D(u_image, distortedUv).g;
  float b = texture2D(u_image, distortedUv - chromaOffset).b;
  vec3 color = vec3(r, g, b);

  // Delicate burnt-orange ambient warmth (#ff630f)
  vec3 orangeAccent = vec3(1.0, 0.388, 0.059) * totalGlow;
  color += orangeAccent;

  gl_FragColor = vec4(color, 1.0);
}
`;

const textureImageCache = new Map();

export default function WebGLPortrait({
  imageUrl = '/images/hero-portrait.webp',
  onReady = () => {},
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const isReadyRef = useRef(false);

  useEffect(() => {
    // Check width >= 769px, fine pointer, and reduced-motion off
    const isDesktop = window.innerWidth >= 769;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || !isFinePointer || prefersReducedMotion) {
      setIsSupported(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: false, depth: false, antialias: true }) ||
           canvas.getContext('experimental-webgl', { alpha: false, depth: false, antialias: true });
    } catch {
      setIsSupported(false);
      return;
    }

    if (!gl) {
      setIsSupported(false);
      return;
    }

    // Shader compilation helper
    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('WebGL Shader Error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertShader || !fragShader) {
      setIsSupported(false);
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('WebGL Program Error:', gl.getProgramInfoLog(program));
      setIsSupported(false);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uImageResolution = gl.getUniformLocation(program, 'u_imageResolution');
    const uPointer = gl.getUniformLocation(program, 'u_pointer');
    const uStrength = gl.getUniformLocation(program, 'u_strength');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uTrailLocations = [];
    for (let i = 0; i < 9; i++) {
      uTrailLocations.push(gl.getUniformLocation(program, `u_trail[${i}]`));
    }

    // Texture setup with caching and lazy loading
    const texture = gl.createTexture();
    let imageWidth = 2048;
    let imageHeight = 1152;
    let textureReady = false;
    let textureLoading = false;
    let isIntersecting = false;

    function initTexture(img) {
      if (!gl || gl.isContextLost()) return;
      imageWidth = img.naturalWidth || 2048;
      imageHeight = img.naturalHeight || 1152;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      textureReady = true;
      isReadyRef.current = true;
      setIsSupported(true);
      onReady(true);
      requestRender();
    }

    function loadTexture() {
      if (textureReady || textureLoading) return;
      textureLoading = true;

      if (textureImageCache.has(imageUrl)) {
        const cachedImg = textureImageCache.get(imageUrl);
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          initTexture(cachedImg);
          return;
        }
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.src = imageUrl;
      img.onload = () => {
        textureImageCache.set(imageUrl, img);
        initTexture(img);
      };
      img.onerror = () => {
        console.warn('Failed to load WebGL texture image:', imageUrl);
        setIsSupported(false);
        onReady(false);
      };
    }

    // Lazy load observer: only ingest texture when within 250px of viewport
    const viewportObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (entry.isIntersecting) {
            loadTexture();
            if (targetStrength > 0 || currentStrength > 0) {
              requestRender();
            }
          } else {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            isRunning = false;
          }
        });
      },
      { rootMargin: '250px' }
    );
    viewportObserver.observe(canvas);

    // Tracking state with gentle, smooth interpolation
    const currentPointer = { x: 0.5, y: 0.5 };
    const targetPointer = { x: 0.5, y: 0.5 };
    const trail = Array.from({ length: 9 }, () => ({ x: 0.5, y: 0.5 }));
    let currentStrength = 0.0;
    let targetStrength = 0.0;
    let animationFrameId = null;
    let startTime = performance.now();
    let isRunning = false;

    function render(now) {
      if (!isIntersecting || !gl || gl.isContextLost() || !textureReady) {
        isRunning = false;
        return;
      }

      const elapsed = (now - startTime) * 0.001;

      // Smooth pointer tracking (factor 0.08 for buttery smoothness)
      currentPointer.x += (targetPointer.x - currentPointer.x) * 0.08;
      currentPointer.y += (targetPointer.y - currentPointer.y) * 0.08;

      // Soft trail updates
      trail[0].x += (currentPointer.x - trail[0].x) * 0.16;
      trail[0].y += (currentPointer.y - trail[0].y) * 0.16;
      for (let i = 1; i < 9; i++) {
        const factor = 0.16 - i * 0.008;
        trail[i].x += (trail[i - 1].x - trail[i].x) * factor;
        trail[i].y += (trail[i - 1].y - trail[i].y) * factor;
      }

      // Smooth strength easing (soft ramp in and gentle fade out)
      if (targetStrength > currentStrength) {
        currentStrength += (targetStrength - currentStrength) * 0.05;
      } else {
        currentStrength += (targetStrength - currentStrength) * 0.02;
      }

      if (targetStrength === 0.0 && currentStrength < 0.001) {
        currentStrength = 0.0;
      }

      // Viewport & Uniforms
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uImageResolution, imageWidth, imageHeight);
      gl.uniform2f(uPointer, currentPointer.x, currentPointer.y);
      gl.uniform1f(uStrength, currentStrength);
      gl.uniform1f(uTime, elapsed);

      for (let i = 0; i < 9; i++) {
        gl.uniform2f(uTrailLocations[i], trail[i].x, trail[i].y);
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (currentStrength > 0.0 || targetStrength > 0.0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    }

    function requestRender() {
      if (!isRunning && textureReady) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    }

    // Pointer events on parent hero container
    const heroSection = canvas.closest('#top') || canvas.parentElement;

    function handlePointerMove(e) {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetPointer.x = Math.max(0, Math.min(1, x));
      targetPointer.y = Math.max(0, Math.min(1, y));
      targetStrength = 1.0;
      requestRender();
    }

    function handlePointerLeave() {
      targetStrength = 0.0;
      requestRender();
    }

    if (heroSection) {
      heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
      heroSection.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    // Resize handling with DPR cap of 2.25
    function updateDimensions() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.25);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const displayWidth = Math.floor(width * dpr);
      const displayHeight = Math.floor(height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        requestRender();
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(canvas);
    updateDimensions();

    // Pause on visibilitychange
    function handleVisibility() {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        isRunning = false;
      } else if (targetStrength > 0 || currentStrength > 0) {
        requestRender();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // Context loss handling
    function handleContextLost(e) {
      e.preventDefault();
      setIsSupported(false);
      onReady(false);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (heroSection) {
        heroSection.removeEventListener('pointermove', handlePointerMove);
        heroSection.removeEventListener('pointerleave', handlePointerLeave);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      resizeObserver.disconnect();
      viewportObserver.disconnect();

      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteTexture(texture);
      }
    };
  }, [imageUrl, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: isSupported ? 'block' : 'none',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
}
