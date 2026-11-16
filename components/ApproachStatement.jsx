'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';

const STATEMENT_LINES = [
  'Rooted in clarity, driven by curiosity,',
  'Tarun Rawat builds applications and digital',
  'experiences that bring structure to',
  'complex ideas through clean architecture',
  'and thoughtful visual systems.'
];

export default function ApproachStatement() {
  const sectionRef = useRef(null);
  const followerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [followerActive, setFollowerActive] = useState(false);

  // IntersectionObserver to reveal text when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFine) return;

    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (followerRef.current) {
      followerRef.current.style.transform = `translate3d(${x - 140}px, ${y - 168}px, 0)`;
    }
    if (!followerActive) setFollowerActive(true);
  };

  const handlePointerLeave = () => {
    setFollowerActive(false);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="approach-section container-inset"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="section-divider" aria-hidden="true" />

      <div className="approach-header">
        <span className="section-kicker">// Approach</span>
      </div>

      <div className="statement-wrapper" aria-label="Engineering & design approach statement">
        <div className="statement-lines">
          {STATEMENT_LINES.map((line, index) => (
            <div key={index} className="statement-line-mask">
              <span
                className={`statement-line ${inView ? 'is-revealed' : ''}`}
                style={{ '--line-delay': `${index * 110}ms` }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Statement Graphic Follower on Hover */}
      <div
        ref={followerRef}
        className={`statement-follower ${followerActive ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        <ProjectArtwork variant="statement" className="follower-svg" />
      </div>

      {/* Metadata Row */}
      <div className="approach-metadata-row">
        <div className="metadata-left">
          <p>
            I connect engineering precision and visual expression through full-stack web applications,
            responsive interfaces, and scalable digital platforms built to perform.
          </p>
        </div>

        <div className="metadata-right">
          <span className="disciplines-label">DISCIPLINES</span>
          <div className="disciplines-tags">
            <span className="pill-tag">Full-Stack Development</span>
            <span className="pill-tag">Frontend Architecture</span>
            <span className="pill-tag">UI / Digital Design</span>
          </div>
        </div>
      </div>
    </section>
  );
}
