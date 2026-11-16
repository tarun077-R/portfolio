'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';
import { PROJECTS } from '../data/portfolio';

export default function WorkIndex({ onOpenModal }) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const openerRefs = useRef({});

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

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section container-inset-work"
    >
      <div className="work-header">
        <span className="section-kicker">// Selected Work</span>
        <span className="work-header-meta">SELECTED BUILDS / 2025–2026</span>
      </div>

      <div className="work-table-header" aria-hidden="true">
        <span className="col-idx">#</span>
        <span className="col-project">PROJECT</span>
        <span className="col-discipline">DISCIPLINE</span>
        <span className="col-year">YEAR</span>
        <span className="col-arrow" />
      </div>

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
                onClick={(e) => onOpenModal(proj, e.currentTarget)}
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                onFocus={() => setHoveredProject(proj)}
                onBlur={() => setHoveredProject(null)}
                aria-label={`Open ${proj.title} case study — ${proj.discipline}, ${proj.year}`}
              >
                <span className="row-hover-wipe" aria-hidden="true" />
                <span className="row-col-idx">{proj.id}</span>

                <div className="row-col-title-wrap">
                  <span className="row-col-title">{proj.title}</span>
                  <span className="row-col-sub-discipline">{proj.discipline}</span>
                </div>

                <span className="row-col-discipline">{proj.discipline}</span>
                <span className="row-col-year">{proj.year}</span>
                <span className="row-col-arrow" aria-hidden="true">↗</span>

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

      <div className="work-bottom-cta">
        <h3 className="cta-prompt-title">HAVE A PROJECT IN MIND?</h3>
        <a href="#contact" className="btn-pill-white work-cta-pill">
          Start a conversation ↗
        </a>
      </div>
    </section>
  );
}
