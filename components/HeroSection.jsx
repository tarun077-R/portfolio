'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import WebGLPortrait from './WebGLPortrait';

function renderLetters(word, baseDelay, step = 0.08) {
  return word.split('').map((char, i) => (
    <span
      key={i}
      className="letter-cell animate-letter"
      style={{ '--letter-delay': `${(baseDelay + i * step).toFixed(2)}s` }}
    >
      {char}
    </span>
  ));
}

function HeroClock() {
  const [timeState, setTimeState] = useState({
    gmt: 'GMT+00:00 • LOCAL',
    time: '--:--:--'
  });

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const offsetMinutes = -now.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absMinutes = Math.abs(offsetMinutes);
      const offH = String(Math.floor(absMinutes / 60)).padStart(2, '0');
      const offM = String(absMinutes % 60).padStart(2, '0');
      setTimeState({
        gmt: `GMT${sign}${offH}:${offM} • LOCAL`,
        time: `${h}:${m}:${s}`
      });
    }

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="nav-clock" aria-label="Local Time">
      <div className="nav-clock-gmt">{timeState.gmt}</div>
      <div className="nav-clock-time">{timeState.time}</div>
    </div>
  );
}

export default function HeroSection({ onOpenNav, isNavOpen }) {
  const heroRef = useRef(null);
  const [webglReady, setWebGLReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFaceHovered, setIsFaceHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, visible: false });

  // Pre-decode and track portrait image loading for instant presentation
  useEffect(() => {
    const img = new Image();
    img.src = '/images/hero-portrait.webp';
    if (img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    } else {
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true); // Graceful fallback
    }
  }, []);

  // Scroll parallax calculation
  useEffect(() => {
    function onScroll() {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setScrollProgress(Math.max(0, Math.min(1, -rect.top / rect.height)));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pointer interactions on hero portrait
  const handlePointerMove = useCallback((e) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFine || isNavOpen) {
      setIsFaceHovered(false);
      return;
    }

    if (e.target.closest('a, button')) {
      setIsFaceHovered(false);
      return;
    }

    const el = heroRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setGlowPos({ x: x * 100, y: y * 100, visible: true });
    setIsFaceHovered(x >= 0.40 && x <= 0.79 && y >= 0.075 && y <= 0.75);
  }, [isNavOpen]);

  const handlePointerLeave = useCallback(() => {
    setIsFaceHovered(false);
    setGlowPos((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const about = document.getElementById('about');
    if (about) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      about.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      about.setAttribute('tabindex', '-1');
      about.focus({ preventScroll: true });
    }
  };

  const bgScale = 1 + scrollProgress * 0.15 + (isFaceHovered ? 0.015 : 0);
  const bgTranslateY = scrollProgress * -5;

  return (
    <section
      id="top"
      ref={heroRef}
      className="hero-section"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Background Layer: CSS Cover Portrait + WebGL Ripple Canvas */}
      <div
        className="hero-bg-container"
        style={{
          transform: `scale(${bgScale}) translateY(${bgTranslateY}%)`,
          transition: isFaceHovered ? 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.5s ease-out'
        }}
        aria-hidden="true"
      >
        {/* Editorial Skeleton Shimmer while WebGL and texture load */}
        <div className={`hero-portrait-skeleton skeleton-shimmer ${imageLoaded || webglReady ? 'is-hidden' : ''}`} />

        <div className="hero-portrait-css" />

        <WebGLPortrait
          imageUrl="/images/hero-portrait.webp"
          onReady={setWebGLReady}
        />

        {!webglReady && glowPos.visible && (
          <div
            className="hero-fallback-glow"
            style={{ left: `${glowPos.x}%`, top: `${glowPos.y}%` }}
          />
        )}
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="hero-nav container-inset" style={{ animation: 'navDrop 0.5s ease-out forwards' }}>
        <HeroClock />

        <button
          type="button"
          className="nav-menu-btn"
          onClick={onOpenNav}
          aria-expanded={isNavOpen}
          aria-controls="nav-overlay"
          aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <div className={`menu-bars ${isNavOpen ? 'is-flattened' : ''}`} aria-hidden="true">
            <span style={{ height: isNavOpen ? '4px' : '3px' }} />
            <span style={{ height: isNavOpen ? '4px' : '7px' }} />
            <span style={{ height: isNavOpen ? '4px' : '12px' }} />
            <span style={{ height: isNavOpen ? '4px' : '4px' }} />
            <span style={{ height: isNavOpen ? '4px' : '8px' }} />
            <span style={{ height: isNavOpen ? '4px' : '6px' }} />
            <span style={{ height: isNavOpen ? '4px' : '3px' }} />
          </div>
          <span className="menu-btn-label">{isNavOpen ? 'CLOSE' : 'MENU'}</span>
        </button>

        <a href="#contact" className="btn-pill-white nav-talk-pill">
          Let’s talk ↗
        </a>
      </header>

      {/* Main Content & Bottom Typography */}
      <div className="hero-content-wrapper container-inset">
        <h1 className="sr-only">Tarun Rawat — Full-Stack Web Developer &amp; Digital Designer</h1>

        {/* Subtitle Row with Down Arrow Link */}
        <div className="hero-subtitle-row fade-element" style={{ '--fade-delay': '1.18s' }}>
          <div className="subtitle-left">
            FULL-STACK WEB DEVELOPER &amp; DIGITAL DESIGNER
          </div>

          <div className="hero-down-arrow-container">
            <a
              href="#about"
              className="hero-down-arrow-btn"
              onClick={handleScrollToAbout}
              aria-label="Scroll down to Approach"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="arrow-icon"
                aria-hidden="true"
              >
                <line x1="12" y1="4" x2="12" y2="19" />
                <polyline points="5 12 12 19 19 12" />
              </svg>
            </a>
          </div>

          <div className="subtitle-right">
            [ PORTFOLIO — SELECTED WORK ]
          </div>
        </div>

        {/* Main Title Container */}
        <div className="hero-title-container" aria-hidden="true">
          <div className="title-monogram">
            {renderLetters('JR', 0.38, 0.08)}
          </div>

          <div className="title-fullname">
            <span className="name-tarun">
              {renderLetters('Tarun', 0.54, 0.08)}
            </span>
            <span className="name-rawat">
              {renderLetters('Rawat', 0.94, 0.08)}
            </span>
            <span className="name-superscript fade-element" style={{ '--fade-delay': '1.48s' }}>
              [01]
            </span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="hero-bottom-row">
          <div className="hero-bottom-statement rise-element" style={{ '--rise-delay': '1.55s' }}>
            <p className="statement-line-1">• Custom web applications, digital platforms, interactive interfaces.</p>
            <p className="statement-line-2">• Independent engineering. Clean architecture. Distinctive execution.</p>
          </div>

          <a
            href="#work"
            className="btn-pill-white hero-explore-pill rise-element"
            style={{ '--rise-delay': '2.0s' }}
          >
            Explore work ↘
          </a>
        </div>
      </div>

      <div className="hero-vertical-label" aria-hidden="true">
        TARUN RAWAT / STRUCTURE &amp; EXPRESSION — 001
      </div>
    </section>
  );
}
