'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import WebGLPortrait from './WebGLPortrait';
import NavigationOverlay from './NavigationOverlay';
import { PERSONA } from '../data/portfolio';

const JR_LETTERS = ['J', 'R'];
const TARUN_LETTERS = ['T', 'a', 'r', 'u', 'n'];
const RAWAT_LETTERS = ['R', 'a', 'w', 'a', 't'];

const JR_DELAYS = [0.38, 0.46];
const TARUN_DELAYS = [0.54, 0.62, 0.70, 0.78, 0.86];
const RAWAT_DELAYS = [0.94, 1.02, 1.10, 1.18, 1.26];

export default function HeroSection({ onOpenNav, isNavOpen }) {
  const heroRef = useRef(null);
  const [timeString, setTimeString] = useState('--:--:--');
  const [gmtString, setGmtString] = useState('GMT+00:00 // LOCAL');
  const [isClient, setIsClient] = useState(false);

  // Motion & Animation state
  const [animating, setAnimating] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [hasLeftViewport, setHasLeftViewport] = useState(false);
  const [webglReady, setWebGLReady] = useState(false);

  // Parallax & Hover zoom
  const [isFaceHovered, setIsFaceHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fallback radial glow coordinates when WebGL isn't active
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, visible: false });

  // Clock Hydration & updates
  useEffect(() => {
    setIsClient(true);

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);

      // Offset handling for half/quarter-hour timezones (e.g. India +05:30)
      const offsetMinutes = -now.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absMinutes = Math.abs(offsetMinutes);
      const offH = String(Math.floor(absMinutes / 60)).padStart(2, '0');
      const offM = String(absMinutes % 60).padStart(2, '0');
      setGmtString(`GMT${sign}${offH}:${offM} // LOCAL`);
    }

    updateClock();
    let intervalId = setInterval(updateClock, 1000);

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        updateClock();
        clearInterval(intervalId);
        intervalId = setInterval(updateClock, 1000);
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Entrance letter animation triggers
  const startLetterAnimation = useCallback(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setAnimationDone(true);
      setAnimating(false);
      return;
    }

    setAnimating(true);
    setAnimationDone(false);

    // Remove animation classes once the entire sequence completes
    const timer = setTimeout(() => {
      setAnimationDone(true);
      setAnimating(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        timer = setTimeout(startLetterAnimation, 80);
      });
    } else {
      timer = setTimeout(startLetterAnimation, 200);
    }

    // Safety fallback: maximum 1.8s timeout
    const fallbackTimer = setTimeout(() => {
      if (!animationDone) {
        startLetterAnimation();
      }
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [startLetterAnimation, animationDone]);

  // Replay letter entrance when hero has completely left the viewport and >= 20% visible again
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setHasLeftViewport(true);
          } else if (hasLeftViewport && entry.intersectionRatio >= 0.2) {
            setHasLeftViewport(false);
            startLetterAnimation();
          }
        });
      },
      { threshold: [0, 0.2] }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [hasLeftViewport, startLetterAnimation]);

  // Scroll parallax calculation: clamp(-heroRect.top / heroRect.height, 0, 1)
  useEffect(() => {
    function onScroll() {
      const heroEl = heroRef.current;
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Face hover detection: x: 0.40–0.79, y: 0.075–0.86
  const handlePointerMove = useCallback((e) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFine || isNavOpen) {
      setIsFaceHovered(false);
      return;
    }

    // Ignore if target is a button or link
    const target = e.target;
    if (target.closest('a') || target.closest('button')) {
      setIsFaceHovered(false);
      return;
    }

    const heroEl = heroRef.current;
    if (!heroEl) return;

    const rect = heroEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setGlowPos({ x: x * 100, y: y * 100, visible: true });

    // Center-cover normalized face region
    const inFace = x >= 0.40 && x <= 0.79 && y >= 0.075 && y <= 0.75;
    setIsFaceHovered(inFace);
  }, [isNavOpen]);

  const handlePointerLeave = useCallback(() => {
    setIsFaceHovered(false);
    setGlowPos((prev) => ({ ...prev, visible: false }));
  }, []);

  // Reset face hover on blur or nav open
  useEffect(() => {
    if (isNavOpen) setIsFaceHovered(false);

    function onBlur() {
      setIsFaceHovered(false);
    }
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [isNavOpen]);

  // Smooth scroll down to #about
  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      aboutSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      aboutSection.setAttribute('tabindex', '-1');
      aboutSection.focus({ preventScroll: true });
    }
  };

  // Compute background transforms with minimal, refined hover scale
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
        <div className="hero-portrait-css" />

        {/* WebGL Canvas */}
        <WebGLPortrait
          imageUrl="/images/hero-portrait.webp"
          onReady={setWebGLReady}
        />

        {/* Fine pointer fallback radial glow (hidden when WebGL is active) */}
        {!webglReady && glowPos.visible && (
          <div
            className="hero-fallback-glow"
            style={{
              left: `${glowPos.x}%`,
              top: `${glowPos.y}%`
            }}
          />
        )}
      </div>

      {/* Layer 1: Full-Hero Gradient Overlay */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Navigation Layer */}
      <header className="hero-nav container-inset" style={{ animation: animating ? 'navDrop 0.5s ease-out forwards' : 'none' }}>
        {/* Visitor's Live Local Clock */}
        <div className="nav-clock" aria-label="Local Time">
          <div className="nav-clock-gmt">{isClient ? gmtString : 'GMT+00:00 // LOCAL'}</div>
          <div className="nav-clock-time">{isClient ? timeString : '--:--:--'}</div>
        </div>

        {/* Center Menu Button with 7-Bar Graphic */}
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

        {/* Right CTA */}
        <a href="#contact" className="btn-pill-white nav-talk-pill">
          Let’s talk ↗
        </a>
      </header>

      {/* Layer 2: Main Title & Typography Positioned at the BOTTOM */}
      <div className="hero-content-wrapper container-inset">
        {/* Hidden screen-reader accessible heading */}
        <h1 className="sr-only">Tarun Rawat — Full-Stack Web Developer &amp; Digital Designer</h1>

        {/* Subtitle Row with Down Arrow Link */}
        <div
          className={`hero-subtitle-row ${animating ? 'fade-element' : ''}`}
          style={{ '--fade-delay': '1.18s' }}
        >
          <div className="subtitle-left">
            FULL-STACK WEB DEVELOPER &amp; DIGITAL DESIGNER
          </div>

          {/* Bouncing Down-Arrow Link to #about */}
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
            [ PORTFOLIO // SELECTED WORK ]
          </div>
        </div>

        {/* Main Title Container: Anchored at the Bottom */}
        <div className="hero-title-container" aria-hidden="true">
          {/* Left Monogram: JR */}
          <div className="title-monogram">
            {JR_LETTERS.map((char, i) => (
              <span
                key={i}
                className={`letter-cell ${animating ? 'animate-letter' : ''}`}
                style={{
                  '--letter-delay': `${JR_DELAYS[i]}s`
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Right Continuous Name: TarunRawat with [01] */}
          <div className="title-fullname">
            <span className="name-tarun">
              {TARUN_LETTERS.map((char, i) => (
                <span
                  key={i}
                  className={`letter-cell ${animating ? 'animate-letter' : ''}`}
                  style={{
                    '--letter-delay': `${TARUN_DELAYS[i]}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </span>

            <span className="name-rawat">
              {RAWAT_LETTERS.map((char, i) => (
                <span
                  key={i}
                  className={`letter-cell ${animating ? 'animate-letter' : ''}`}
                  style={{
                    '--letter-delay': `${RAWAT_DELAYS[i]}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </span>

            {/* Small superscript [01] */}
            <span
              className={`name-superscript ${animating ? 'fade-element' : ''}`}
              style={{ '--fade-delay': '1.48s' }}
            >
              [01]
            </span>
          </div>
        </div>

        {/* Lower Content: Left Practice Statement & Right Explore Work CTA */}
        <div className="hero-bottom-row">
          <div
            className={`hero-bottom-statement ${animating ? 'rise-element' : ''}`}
            style={{ '--rise-delay': '1.55s' }}
          >
            <p className="statement-line-1">• Custom web applications, digital platforms, interactive interfaces.</p>
            <p className="statement-line-2">• Independent engineering. Clean architecture. Distinctive execution.</p>
          </div>

          <a
            href="#work"
            className={`btn-pill-white hero-explore-pill ${animating ? 'rise-element' : ''}`}
            style={{ '--rise-delay': '2.075s' }}
          >
            Explore work ↘
          </a>
        </div>
      </div>

      {/* Vertical Edge Label */}
      <div className="hero-vertical-label" aria-hidden="true">
        TARUN RAWAT / STRUCTURE &amp; EXPRESSION — 001
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 900px;
          height: 100svh;
          max-height: 1100px;
          background-color: #000000;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hero-bg-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          will-change: transform;
        }

        .hero-portrait-css {
          position: absolute;
          inset: 0;
          background-image: url('/images/hero-portrait.webp');
          background-size: cover;
          background-position: 60% center;
          background-repeat: no-repeat;
        }

        .hero-fallback-glow {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 99, 15, 0.08) 0%, rgba(255, 99, 15, 0) 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          mix-blend-mode: screen;
          filter: blur(20px);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0) 35%,
            rgba(0, 0, 0, 0.65) 100%
          );
          pointer-events: none;
        }

        /* Navigation Bar */
        .hero-nav {
          position: absolute;
          top: 28px;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-clock {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 140px;
        }

        .nav-clock-gmt {
          font-family: var(--font-utility);
          font-size: 11px;
          color: var(--muted-text);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .nav-clock-time {
          font-family: var(--font-utility);
          font-size: 15px;
          color: #ffffff;
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        .nav-menu-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-width: 60px;
          min-height: 48px;
          padding: 6px 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #ffffff;
        }

        .menu-bars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 14px;
        }

        .menu-bars span {
          display: block;
          width: 3px;
          background-color: #ffffff;
          border-radius: 1px;
          transition: height 0.25s var(--ease-reveal), background-color 0.25s;
        }

        .nav-menu-btn:hover .menu-bars span {
          background-color: var(--accent);
        }

        .menu-btn-label {
          font-family: var(--font-utility);
          font-size: 14px;
          letter-spacing: 0.12em;
          font-weight: 500;
          line-height: 1;
        }

        .nav-talk-pill {
          min-height: 50px;
        }

        /* Hero Content & Typography Placed at the BOTTOM */
        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-top: 100px;
          padding-bottom: 34px;
          container-type: inline-size;
        }

        /* Subtitle Row Above Title */
        .hero-subtitle-row {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-family: var(--font-utility);
          font-size: 13px;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .subtitle-right {
          color: var(--muted-mid);
        }

        /* Center Down Arrow Button in Subtitle Row */
        .hero-down-arrow-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-down-arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background-color: rgba(0, 0, 0, 0.45);
          color: #ffffff;
          text-decoration: none;
          transition: background-color 0.25s, border-color 0.25s, color 0.25s;
        }

        .hero-down-arrow-btn:hover,
        .hero-down-arrow-btn:focus-visible {
          background-color: var(--accent);
          border-color: var(--accent);
          color: #000000;
        }

        .arrow-icon {
          width: 22px;
          height: 22px;
          animation: arrowBounce 1.9s var(--ease-bounce) infinite;
        }

        .hero-down-arrow-btn:hover .arrow-icon,
        .hero-down-arrow-btn:focus .arrow-icon {
          animation-play-state: paused;
        }

        @keyframes arrowBounce {
          0%, 70%, 100% {
            transform: translateY(-3px);
          }
          35% {
            transform: translateY(5px);
          }
        }

        /* Main Title Container at Bottom */
        .hero-title-container {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
          gap: 3%;
          padding-right: 28px;
          font-family: var(--font-display);
          font-size: clamp(40px, 14.2cqw, 205px);
          line-height: 0.727;
          letter-spacing: -0.06em;
          white-space: nowrap;
          margin-bottom: 22px;
        }

        .title-monogram {
          font-weight: 500;
          color: #ffffff;
          display: inline-flex;
        }

        .title-fullname {
          position: relative;
          display: inline-flex;
          align-items: baseline;
        }

        .name-tarun {
          font-weight: 500;
          color: #ffffff;
          display: inline-flex;
        }

        .name-rawat {
          font-weight: 250;
          color: #ffffff;
          display: inline-flex;
        }

        .name-superscript {
          font-family: var(--font-utility);
          font-size: clamp(12px, 1.8cqw, 26px);
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 0;
          margin-left: 8px;
          vertical-align: super;
          display: inline-block;
          line-height: 1;
        }

        /* Letter entrance animations */
        .letter-cell {
          display: inline-block;
          will-change: transform, opacity, filter;
        }

        .letter-cell.animate-letter {
          animation: letterEntrance 0.9s var(--ease-letter) backwards;
          animation-delay: var(--letter-delay, 0s);
        }

        @keyframes letterEntrance {
          0% {
            opacity: 0;
            transform: translateY(115%) rotate(3deg) scale(0.96);
            filter: blur(32px);
          }
          65% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
            filter: blur(0px);
          }
        }

        /* Bottom Row */
        .hero-bottom-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
        }

        .hero-bottom-statement {
          max-width: 440px;
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.45;
        }

        .statement-line-1 {
          color: #ffffff;
        }

        .statement-line-2 {
          color: var(--muted-text);
          margin-top: 3px;
        }

        .hero-explore-pill {
          margin-bottom: 0;
        }

        /* Vertical Edge Label */
        .hero-vertical-label {
          position: absolute;
          right: 3%;
          top: 38%;
          transform: rotate(90deg);
          transform-origin: right top;
          font-family: var(--font-utility);
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--muted-text);
          text-transform: uppercase;
          pointer-events: none;
          white-space: nowrap;
          z-index: 10;
        }

        /* Transition animations */
        @keyframes navDrop {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-element {
          animation: elementFade 0.5s ease-out backwards;
          animation-delay: var(--fade-delay, 0s);
        }

        @keyframes elementFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .rise-element {
          animation: elementRise 0.5s ease-out backwards;
          animation-delay: var(--rise-delay, 0s);
        }

        @keyframes elementRise {
          from {
            opacity: 0;
            transform: translateY(56px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .hero-title-container {
            padding-right: 24px;
          }
        }

        @media (max-width: 900px) {
          .hero-section {
            min-height: 760px;
            height: 100svh;
          }
          .hero-subtitle-row {
            font-size: 11px;
          }
          .hero-bottom-statement {
            font-size: 15px;
          }
          .hero-vertical-label {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .hero-title-container {
            font-size: 13.5cqw;
            padding-right: 22px;
            margin-bottom: 16px;
          }
          .name-superscript {
            font-size: 12px;
          }
          .hero-subtitle-row {
            margin-bottom: 14px;
            font-size: 10px;
          }
          .subtitle-left {
            max-width: 58%;
          }
          .subtitle-right {
            max-width: 36%;
          }
        }

        @media (max-width: 560px) {
          .hero-section {
            min-height: max(720px, 100svh);
            max-height: none;
          }
          .hero-nav {
            top: 20px;
          }
          .nav-clock-gmt {
            font-size: 10px;
          }
          .nav-clock-time {
            font-size: 14px;
          }
          .nav-talk-pill {
            min-height: 44px;
            padding: 12px 16px;
            font-size: 15px;
          }
          .hero-subtitle-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .hero-down-arrow-container {
            display: none;
          }
          .hero-down-arrow-btn {
            width: 40px;
            height: 40px;
          }
          .arrow-icon {
            width: 20px;
            height: 20px;
          }
          .hero-bottom-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
          .hero-bottom-statement {
            margin-bottom: 8px;
          }
          .hero-explore-pill {
            margin-bottom: 0;
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .letter-cell,
          .fade-element,
          .rise-element,
          .arrow-icon,
          .hero-nav {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
