'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';
import { PROJECTS } from '../data/portfolio';

function renderChars(text, offset = 0) {
  return text.split('').map((ch, idx) => (
    <span
      key={idx}
      className="title-char is-revealed"
      style={{ '--char-delay': `${(offset + idx) * 50}ms` }}
    >
      {ch}
    </span>
  ));
}

export default function FeaturedProject({ onOpenModal }) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const projectData = PROJECTS.find((p) => p.slug === 'student-e-library') || PROJECTS[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e) => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || reducedMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({ rx: (y - 0.5) * -7.5, ry: (x - 0.5) * 9.5 });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="featured-section container-inset"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="section-divider" aria-hidden="true" />

      <div className="featured-header">
        <span className="section-kicker">Featured Project</span>
        <span className="featured-header-meta">LIVE WEB APPLICATION — 2026</span>
      </div>

      <div className="featured-title-wrap">
        <h2 className="sr-only">Student E-Library Featured Project</h2>

        <div className="featured-title" aria-hidden="true">
          <div className="title-row-1">
            <span className="letters-chunk">{renderChars('STUDENT', 0)}</span>
            <span className="title-marker">[01]</span>
          </div>

          <div className="title-row-2">
            <span className="letters-chunk">{renderChars('E-LIBRARY', 7)}</span>
          </div>
        </div>
      </div>

      {/* Grid Band Behind the Card */}
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
      <button
        type="button"
        className="featured-card-container"
        data-cursor="project"
        style={{
          transform: `translateX(-50%) perspective(850px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.025)`,
        }}
        onClick={() => onOpenModal(projectData)}
        aria-label="View Student E-Library case study"
      >
        <div className="featured-card-inner">
          {!inView && <div className="featured-card-skeleton skeleton-shimmer" aria-hidden="true" />}
          <ProjectArtwork variant="elibrary" className="featured-artwork-svg" />
        </div>
      </button>

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
          {projectData.liveUrl && (
            <a
              href={projectData.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-live-link"
            >
              Visit live site ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
