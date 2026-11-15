'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';
import { PROJECTS } from '../data/portfolio';

export default function WorkIndex({ onOpenModal }) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const openerRefs = useRef({});

  // IntersectionObserver reveal at 0.15
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleRowClick = (project, el) => {
    onOpenModal(project, el);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section container-inset-work"
    >
      {/* Section Header */}
      <div className="work-header">
        <span className="section-kicker">// Selected Work</span>
        <span className="work-header-meta">SELECTED BUILDS / 2025–2026</span>
      </div>

      {/* Column Headers (Desktop) */}
      <div className="work-table-header" aria-hidden="true">
        <span className="col-idx">#</span>
        <span className="col-project">PROJECT</span>
        <span className="col-discipline">DISCIPLINE</span>
        <span className="col-year">YEAR</span>
        <span className="col-arrow" />
      </div>

      {/* Project Rows List */}
      <div className="work-table-body" role="list">
        {PROJECTS.map((proj, idx) => {
          const isHovered = hoveredProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              className={`work-row-item ${inView ? 'is-revealed' : ''}`}
              style={{ '--row-delay': `${idx * 85}ms` }}
              role="listitem"
            >
              <button
                type="button"
                ref={(el) => (openerRefs.current[proj.id] = el)}
                className="work-row-btn"
                onClick={(e) => handleRowClick(proj, e.currentTarget)}
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(proj)}
                onBlur={() => setHoveredProject(null)}
                aria-label={`Open ${proj.title} case study — ${proj.discipline}, ${proj.year}`}
              >
                {/* Difference Blend Wipe on hover/focus */}
                <span className="row-hover-wipe" aria-hidden="true" />

                {/* Index */}
                <span className="row-col-idx">{proj.id}</span>

                {/* Project Title and Discipline (stacked on mobile) */}
                <div className="row-col-title-wrap">
                  <span className="row-col-title">{proj.title}</span>
                  <span className="row-col-sub-discipline">{proj.discipline}</span>
                </div>

                {/* Desktop Discipline */}
                <span className="row-col-discipline">{proj.discipline}</span>

                {/* Year */}
                <span className="row-col-year">{proj.year}</span>

                {/* Arrow Glyph */}
                <span className="row-col-arrow" aria-hidden="true">
                  ↗
                </span>

                {/* 180px Floating Artwork Preview at ~62% across row */}
                <div
                  className={`row-artwork-preview ${isHovered ? 'is-active' : ''}`}
                  aria-hidden="true"
                >
                  <ProjectArtwork variant={proj.coverKey} className="preview-svg" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Block over orange gradient background */}
      <div className="work-bottom-cta">
        <h3 className="cta-prompt-title">HAVE A PROJECT IN MIND?</h3>
        <a href="#contact" className="btn-pill-white work-cta-pill">
          Start a conversation ↗
        </a>
      </div>

      <style jsx>{`
        .work-section {
          position: relative;
          width: 100%;
          min-height: 760px;
          padding-top: 40px;
          padding-bottom: 95px;
          background: linear-gradient(
            180deg,
            #000000 0%,
            #000000 48%,
            #ea4f16 78%,
            #f6af60 100%
          );
          display: flex;
          flex-direction: column;
        }

        .work-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 40px;
        }

        .work-header-meta {
          font-family: var(--font-utility);
          font-size: 13px;
          letter-spacing: 0.1em;
          color: var(--muted-mid);
          text-transform: uppercase;
        }

        /* Column Headers */
        .work-table-header {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 210px 70px 40px;
          gap: 16px;
          padding: 0 16px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          font-family: var(--font-utility);
          font-size: 14px;
          letter-spacing: 0.1em;
          color: var(--muted-mid);
          text-transform: uppercase;
        }

        /* Rows */
        .work-table-body {
          display: flex;
          flex-direction: column;
        }

        .work-row-item {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--row-delay, 0ms);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .work-row-item.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .work-row-btn {
          position: relative;
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 210px 70px 40px;
          gap: 16px;
          align-items: center;
          width: 100%;
          min-height: 72px;
          padding: 16px;
          background-color: rgba(0, 0, 0, 0.73);
          border: none;
          color: #ffffff;
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          outline: none;
          transition: background-color 0.25s;
        }

        .work-row-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: -2px;
          z-index: 20;
        }

        /* Left-to-right difference blend wipe */
        .row-hover-wipe {
          position: absolute;
          inset: 0;
          background-color: #ffffff;
          mix-blend-mode: difference;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
          z-index: 2;
        }

        .work-row-btn:hover .row-hover-wipe,
        .work-row-btn:focus-visible .row-hover-wipe {
          transform: scaleX(1);
        }

        .row-col-idx {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-mid);
          position: relative;
          z-index: 5;
        }

        .row-col-title-wrap {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 5;
        }

        .row-col-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .row-col-sub-discipline {
          display: none;
          font-family: var(--font-utility);
          font-size: 13px;
          color: var(--muted-light);
          margin-top: 4px;
        }

        .row-col-discipline {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-light);
          position: relative;
          z-index: 5;
        }

        .row-col-year {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-mid);
          position: relative;
          z-index: 5;
        }

        .row-col-arrow {
          font-family: var(--font-utility);
          font-size: 20px;
          color: #ffffff;
          justify-self: end;
          position: relative;
          z-index: 5;
          transition: transform 0.25s;
        }

        .work-row-btn:hover .row-col-arrow,
        .work-row-btn:focus-visible .row-col-arrow {
          transform: translate(3px, -3px);
        }

        /* 180px Hover Artwork Preview */
        .row-artwork-preview {
          position: absolute;
          left: 62%;
          top: 50%;
          transform: translateY(-50%) scale(0.96);
          width: 180px;
          height: 180px;
          filter: blur(8px);
          opacity: 0;
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.42s ease-out, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s ease-out;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
        }

        .row-artwork-preview.is-active {
          opacity: 1;
          filter: blur(0px);
          transform: translateY(-50%) scale(1);
        }

        .preview-svg {
          width: 100%;
          height: 100%;
        }

        /* Bottom CTA */
        .work-bottom-cta {
          margin-top: 85px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 8px;
        }

        .cta-prompt-title {
          font-family: var(--font-display);
          font-size: clamp(26px, 4.5cqw, 48px);
          font-weight: 500;
          letter-spacing: -0.04em;
          color: #111111; /* Dark text over lightening orange gradient */
        }

        .work-cta-pill {
          min-height: 50px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .work-table-header {
            display: none;
          }
          .work-row-btn {
            grid-template-columns: 36px minmax(0, 1fr) 60px 30px;
          }
          .row-col-discipline {
            display: none;
          }
          .row-col-sub-discipline {
            display: block;
          }
          .row-artwork-preview {
            display: none !important;
          }
        }

        @media (max-width: 560px) {
          .work-row-btn {
            grid-template-columns: 24px minmax(0, 1fr) 46px 24px;
            padding: 14px 8px;
            gap: 10px;
          }
          .row-col-title {
            font-size: 20px;
          }
          .row-col-sub-discipline {
            font-size: 12px;
          }
          .row-col-year {
            font-size: 13px;
          }
          .work-bottom-cta {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            margin-top: 55px;
          }
          .work-cta-pill {
            width: 100%;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .work-row-item {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .row-hover-wipe {
            transition: none !important;
          }
          .row-artwork-preview {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
