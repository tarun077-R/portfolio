'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';
import { PROJECTS } from '../data/portfolio';

const LINE_1_CHARS = ['S', 'T', 'U', 'D', 'E', 'N', 'T'];
const LINE_2_CHARS = ['E', '-', 'L', 'I', 'B', 'R', 'A', 'R', 'Y'];

export default function FeaturedProject({ onOpenModal }) {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const projectData = PROJECTS.find((p) => p.slug === 'student-e-library') || PROJECTS[0];

  // Scroll reveal at ~22%
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.22) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.22 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Gentle, smooth 3D perspective tilt
  const handlePointerMove = (e) => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reducedMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Minimal, refined tilt angles (max ~7-9 deg)
    const rx = (y - 0.5) * -7.5;
    const ry = (x - 0.5) * 9.5;
    setTilt({ rx, ry });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    // Ensure custom cursor toggle is turned off
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('project-cursor-toggle', { detail: { active: false } }));
    }
  };

  const handleCardMouseEnter = () => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reducedMotion) return;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('project-cursor-toggle', { detail: { active: true } }));
    }
  };

  const handleCardMouseLeave = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('project-cursor-toggle', { detail: { active: false } }));
    }
  };

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="featured-section container-inset"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 1px Top Border */}
      <div className="section-divider" aria-hidden="true" />

      {/* Header Row */}
      <div className="featured-header">
        <span className="section-kicker">// Featured Project</span>
        <span className="featured-header-meta">LIVE WEB APPLICATION // 2026</span>
      </div>

      {/* Huge Two-Line Title */}
      <div className="featured-title-wrap">
        <h2 className="sr-only">Student E-Library Featured Project</h2>

        <div className="featured-title" aria-hidden="true">
          <div className="title-row-1">
            <span className="letters-chunk">
              {LINE_1_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  className={`title-char ${inView ? 'is-revealed' : ''}`}
                  style={{ '--char-delay': `${idx * 50}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="title-marker">[01]</span>
          </div>

          <div className="title-row-2">
            <span className="letters-chunk">
              {LINE_2_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  className={`title-char ${inView ? 'is-revealed' : ''}`}
                  style={{ '--char-delay': `${(LINE_1_CHARS.length + idx) * 50}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* 90px Grid Band Behind the Card */}
      <div className="featured-grid-band" aria-hidden="true">
        <div className="grid-band-top" />
        <div className="grid-band-columns">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="grid-col-rule" />
          ))}
        </div>
        <div className="grid-band-label">01 / STRUCTURED ACCESS TO KNOWLEDGE</div>
        <div className="grid-band-bottom" />
      </div>

      {/* Centered 347px Card Artwork with 3D Tilt */}
      <div
        ref={cardRef}
        className="featured-card-container"
        style={{
          transform: `translateX(-50%) perspective(850px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.025)`,
        }}
        onClick={() => onOpenModal(projectData)}
        onMouseEnter={handleCardMouseEnter}
        onMouseLeave={handleCardMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(projectData);
          }
        }}
        aria-label="View Student E-Library case study"
      >
        <div className="featured-card-inner">
          <ProjectArtwork variant="elibrary" className="featured-artwork-svg" />
        </div>
      </div>

      {/* Desktop Caption and Action Buttons */}
      <div className="featured-caption-block">
        <div className="caption-text-main">Student E-Library — Academic Resource Platform</div>
        <div className="caption-text-sub">Full-stack web / Responsive UI / Live deployment</div>

        <div className="featured-actions">
          <button
            type="button"
            className="btn-pill-white featured-cta-pill"
            onClick={() => onOpenModal(projectData)}
          >
            View case study ↗
          </button>
          <a
            href="https://student-e-library.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="featured-live-link"
          >
            Visit live site ↗
          </a>
        </div>
      </div>

      <style jsx>{`
        .featured-section {
          position: relative;
          width: 100%;
          min-height: 960px;
          padding-top: 38px;
          padding-bottom: 80px;
          background-color: #000000;
          perspective: 850px;
          container-type: inline-size;
          overflow: hidden;
        }

        .section-divider {
          width: 100%;
          height: 1px;
          background-color: var(--divider-dark);
          margin-bottom: 38px;
        }

        .featured-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .featured-header-meta {
          font-family: var(--font-utility);
          font-size: 13px;
          letter-spacing: 0.1em;
          color: var(--muted-text);
          text-transform: uppercase;
        }

        /* Title */
        .featured-title-wrap {
          margin-top: 90px;
          display: flex;
          justify-content: center;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .featured-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(48px, 12.5cqw, 172px);
          line-height: 0.84;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .title-row-1,
        .title-row-2 {
          display: flex;
          align-items: baseline;
          justify-content: center;
          white-space: nowrap;
        }

        .letters-chunk {
          display: inline-flex;
        }

        .title-marker {
          font-family: var(--font-utility);
          font-size: clamp(14px, 2.2cqw, 32px);
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 0;
          margin-left: 12px;
          vertical-align: super;
        }

        .title-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px);
          filter: blur(12px);
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease-out;
          transition-delay: var(--char-delay, 0ms);
          will-change: transform, opacity, filter;
        }

        .title-char.is-revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
        }

        /* Grid Band Behind Card */
        .featured-grid-band {
          position: absolute;
          top: 623px;
          left: 0;
          width: 100%;
          height: 90px;
          z-index: 5;
          pointer-events: none;
        }

        .grid-band-top,
        .grid-band-bottom {
          width: 100%;
          height: 1px;
          background-color: var(--divider-dark);
        }

        .grid-band-columns {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .grid-col-rule {
          flex: 1;
          height: 100%;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .grid-band-label {
          position: absolute;
          left: var(--inset-standard);
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-utility);
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--muted-text);
        }

        /* Centered 347px Card Artwork */
        .featured-card-container {
          position: absolute;
          top: 401px;
          left: 50%;
          width: 347px;
          height: 347px;
          z-index: 15;
          mix-blend-mode: difference;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          outline: none;
        }

        .featured-card-container:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 8px;
        }

        .featured-card-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .featured-artwork-svg {
          width: 100%;
          height: 100%;
        }

        /* Caption & Buttons */
        .featured-caption-block {
          position: absolute;
          top: 788px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          z-index: 20;
          width: 100%;
          max-width: 600px;
          padding: 0 16px;
        }

        .caption-text-main {
          font-family: var(--font-body);
          font-size: 19px;
          font-weight: 500;
          color: #ffffff;
        }

        .caption-text-sub {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-text);
          margin-top: 6px;
        }

        .featured-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 24px;
        }

        .featured-live-link {
          font-family: var(--font-utility);
          font-size: 16px;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 18px;
          border: 1px solid var(--divider-subtle);
          border-radius: 999px;
          transition: border-color 0.25s, color 0.25s, background-color 0.25s;
        }

        .featured-live-link:hover {
          border-color: var(--accent);
          color: var(--accent);
          background-color: rgba(255, 99, 15, 0.08);
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
        @media (max-width: 900px) {
          .featured-section {
            min-height: 780px;
          }
          .featured-card-container {
            width: 278px;
            height: 278px;
            top: 290px;
          }
          .featured-grid-band {
            top: 443px;
          }
          .featured-caption-block {
            top: 600px;
          }
        }

        @media (max-width: 560px) {
          .featured-section {
            min-height: auto;
            padding-top: 30px;
            padding-bottom: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .featured-header-meta {
            display: none;
          }
          .featured-title-wrap {
            margin-top: 40px;
          }
          .featured-title {
            font-size: clamp(42px, 12.5cqw, 68px);
            line-height: 0.95;
          }
          .featured-grid-band {
            display: none;
          }
          .featured-card-container {
            position: relative;
            top: 0;
            left: 0;
            transform: none !important;
            width: 208px;
            height: 208px;
            margin-top: -8px;
            margin-bottom: 28px;
          }
          .featured-caption-block {
            position: relative;
            top: 0;
            left: 0;
            transform: none;
            padding: 0;
          }
          .caption-text-main {
            font-size: 17px;
          }
          .caption-text-sub {
            font-size: 13px;
          }
          .featured-actions {
            flex-direction: column;
            gap: 12px;
            width: 100%;
          }
          .featured-cta-pill,
          .featured-live-link {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .title-char {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
          .featured-card-container {
            transform: translateX(-50%) scale(1.025) !important;
          }
        }
      `}</style>
    </section>
  );
}

