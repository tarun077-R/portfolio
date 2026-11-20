'use client';

import React, { useState, useEffect } from 'react';

const STATUS_MESSAGES = [
  'INITIALIZING SYSTEM',
  'LOADING ASSETS & SHADERS',
  'CONFIGURING VIEWPORT',
  'READY'
];

export default function PageLoader({ onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setIsRemoved(true);
      onComplete();
      return;
    }

    // Smooth simulated asset loading progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setStatusIdx(STATUS_MESSAGES.length - 1);

        // Pause briefly at 100% before elegant curtain reveal
        setTimeout(() => {
          setIsExiting(true);
          onComplete();
          setTimeout(() => {
            setIsRemoved(true);
          }, 850);
        }, 180);
      } else {
        setProgress(current);
        if (current > 65) setStatusIdx(2);
        else if (current > 30) setStatusIdx(1);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isRemoved) return null;

  return (
    <aside
      className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-[#000000] text-white p-6 md:p-12 transition-transform duration-800 pointer-events-auto select-none ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)'
      }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full">
        <span className="font-utility text-xs tracking-[0.2em] text-[#888888] uppercase">
          TARUN RAWAT / 2026
        </span>
        <span className="font-utility text-xs tracking-[0.15em] text-[#ff630f] uppercase">
          {STATUS_MESSAGES[statusIdx]}
        </span>
      </div>

      {/* Center Monogram / Editorial Title with Shimmer */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="relative overflow-hidden mb-4">
          <h1 className="font-display text-5xl md:text-8xl font-medium tracking-tight text-white">
            TARUN RAWAT
          </h1>
          {/* Subtle Accent Glow behind title */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff630f]/15 to-transparent -translate-x-full animate-shimmer pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <p className="font-utility text-xs md:text-sm tracking-[0.18em] text-[#888888] uppercase max-w-md">
          Full-Stack Web Developer &amp; Digital Designer
        </p>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        <div className="flex justify-between items-baseline font-utility text-xs text-[#aaaaaa]">
          <span className="tracking-widest">LOADING EXPERIENCE</span>
          <span className="font-mono text-sm font-semibold text-white tabular-nums">
            {String(progress).padStart(2, '0')}%
          </span>
        </div>

        {/* Shimmer Progress Track */}
        <div className="w-full h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#ff630f] transition-all duration-75 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer pulse across active progress */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
