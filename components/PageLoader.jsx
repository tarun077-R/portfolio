'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING SYSTEM');
  const [isExiting, setIsExiting] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setIsDestroyed(true);
      return;
    }

    const startTime = performance.now();
    const duration = 1400; // 1.4s smooth loader time

    function step(now) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - rawProgress, 2.5);
      const currentPct = Math.round(eased * 100);

      setProgress(currentPct);

      if (currentPct >= 100) {
        setStatus('READY');
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsDestroyed(true);
          }, 750);
        }, 150);
        return;
      }

      if (currentPct >= 70) {
        setStatus('CONFIGURING VIEWPORT');
      } else if (currentPct >= 30) {
        setStatus('LOADING ASSETS & SHADERS');
      }

      timerRef.current = requestAnimationFrame(step);
    }

    timerRef.current = requestAnimationFrame(step);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  if (isDestroyed) return null;

  return (
    <aside
      className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-[#000000] text-white p-6 md:p-12 transition-transform duration-700 select-none ${
        isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0 pointer-events-auto'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
        willChange: 'transform'
      }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full">
        <span className="font-utility text-xs tracking-[0.2em] text-[#888888] uppercase">
          TARUN RAWAT / 2026
        </span>
        <span className="font-utility text-xs tracking-[0.15em] text-[#ff630f] uppercase font-medium">
          {status}
        </span>
      </div>

      {/* Center Monogram / Editorial Title */}
      <div className="flex flex-col items-center justify-center my-auto text-center w-full">
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight text-white mb-4 w-full">
          TARUN RAWAT
        </h1>

        <p className="font-utility text-xs md:text-sm tracking-[0.18em] text-[#888888] uppercase max-w-lg">
          Full-Stack Web Developer &amp; Digital Designer
        </p>
      </div>

      {/* Bottom Progress Bar & Percentage (Full Width) */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-baseline font-utility text-xs text-[#aaaaaa]">
          <span className="tracking-widest">LOADING EXPERIENCE</span>
          <span className="font-mono text-sm font-semibold text-white tabular-nums">
            {String(progress).padStart(2, '0')}%
          </span>
        </div>

        {/* Shimmer Progress Track (Full Width) */}
        <div className="w-full h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#ff630f] transition-all duration-75 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer pulse across active progress */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
