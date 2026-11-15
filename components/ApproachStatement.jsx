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
  const statementAreaRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Floating statement follower state
  const [followerActive, setFollowerActive] = useState(false);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(performance.now());
  const rafId = useRef(null);
  const followerElRef = useRef(null);

  // IntersectionObserver to reveal text when roughly 20% visible
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

  // Pointer follower physics: 1 - exp(-deltaMs / 140)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;

    if (reducedMotion || !isFine) return;

    function animateFollower(now) {
      const deltaMs = Math.min(now - lastTime.current, 100);
      lastTime.current = now;

      const factor = 1 - Math.exp(-deltaMs / 140);
      currentPos.current.x += (targetPos.current.x - currentPos.current.currentX || targetPos.current.x - currentPos.current.x) * factor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.currentY || targetPos.current.y - currentPos.current.y) * factor;

      if (followerElRef.current) {
        followerElRef.current.style.transform = `translate3d(${currentPos.current.x - 140}px, ${currentPos.current.y - 168}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animateFollower);
    }

    rafId.current = requestAnimationFrame(animateFollower);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerMove = (e) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !isFine) return;

    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (!followerActive) {
      setFollowerActive(true);
      currentPos.current = { ...targetPos.current };
    }
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
      {/* 1px Top Divider */}
      <div className="section-divider" aria-hidden="true" />

      {/* Section Header */}
      <div className="approach-header">
        <span className="section-kicker">// Approach</span>
      </div>

      {/* 5-Line Statement Container */}
      <div
        ref={statementAreaRef}
        className="statement-wrapper"
        aria-label="Engineering & design approach statement"
      >
        <div className="statement-lines">
          {STATEMENT_LINES.map((line, index) => (
            <div key={index} className="statement-line-mask">
              <span
                className={`statement-line ${inView ? 'is-revealed' : ''}`}
                style={{
                  '--line-delay': `${index * 110}ms`
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating 280px Statement Graphic Follower on Hover */}
      <div
        ref={followerElRef}
        className={`statement-follower ${followerActive ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        <ProjectArtwork variant="statement" className="follower-svg" />
      </div>

      {/* Metadata Row: Separated by >=80px on desktop */}
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

      <style jsx>{`
        .approach-section {
          position: relative;
          width: 100%;
          min-height: 900px;
          padding-top: 40px;
          padding-bottom: 80px;
          background-color: #000000;
          display: flex;
          flex-direction: column;
          container-type: inline-size;
          overflow: hidden;
        }

        .section-divider {
          width: 100%;
          height: 1px;
          background-color: var(--divider-dark);
          margin-bottom: 40px;
        }

        .approach-header {
          display: flex;
          align-items: center;
          margin-bottom: 65px;
        }

        .statement-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
        }

        .statement-lines {
          display: flex;
          flex-direction: column;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(30px, 6.7cqw, 96px);
          line-height: 0.98;
          letter-spacing: -0.04em;
          color: #ffffff;
        }

        .statement-line-mask {
          overflow: hidden;
          display: block;
          padding-bottom: 0.08em; /* prevents font descenders clipping */
        }

        .statement-line {
          display: block;
          transform: translateY(108%);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--line-delay, 0ms);
          will-change: transform;
        }

        .statement-line.is-revealed {
          transform: translateY(0);
        }

        /* Hover Statement Graphic Follower */
        .statement-follower {
          position: absolute;
          top: 0;
          left: 0;
          width: 280px;
          pointer-events: none;
          z-index: 20;
          mix-blend-mode: difference;
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
          will-change: transform, opacity;
        }

        .statement-follower.is-active {
          opacity: 0.65;
        }

        /* Metadata Row */
        .approach-metadata-row {
          margin-top: auto;
          padding-top: 90px; /* >= 80px separation */
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
          z-index: 10;
        }

        .metadata-left {
          max-width: 520px;
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1.5;
          color: var(--muted-light);
        }

        .metadata-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .disciplines-label {
          font-family: var(--font-utility);
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--muted-text);
          text-transform: uppercase;
          font-weight: 500;
        }

        .disciplines-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .approach-section {
            min-height: 820px;
          }
        }

        @media (max-width: 900px) {
          .approach-metadata-row {
            padding-top: 70px;
          }
          .statement-follower {
            display: none !important;
          }
        }

        @media (max-width: 700px) {
          .approach-metadata-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 32px;
          }
        }

        @media (max-width: 560px) {
          .approach-section {
            min-height: auto;
            padding-top: 30px;
            padding-bottom: 60px;
          }
          .section-divider {
            margin-bottom: 24px;
          }
          .approach-header {
            margin-bottom: 45px;
          }
          .statement-lines {
            font-size: clamp(30px, 9cqw, 47px);
            line-height: 1.05;
          }
          .approach-metadata-row {
            padding-top: 55px;
          }
          .metadata-left {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .statement-line {
            transform: none !important;
            transition: none !important;
          }
          .statement-follower {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

