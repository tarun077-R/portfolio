'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [projectCursor, setProjectCursor] = useState(false);
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on fine pointer devices and when reduced motion is off
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    function onMouseMove(e) {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    }

    function onMouseLeave() {
      setVisible(false);
    }

    function onMouseEnter() {
      setVisible(true);
    }

    // Listen for custom project cursor state events
    function onProjectCursorChange(e) {
      setProjectCursor(Boolean(e.detail?.active));
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('project-cursor-toggle', onProjectCursorChange);

    // Smooth cursor interpolation loop
    function updateCursor() {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.25;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(updateCursor);
    }

    rafId.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('project-cursor-toggle', onProjectCursorChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (!enabled || !visible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-root ${projectCursor ? 'is-project' : ''}`}
      aria-hidden="true"
    >
      {projectCursor ? (
        <div className="cursor-card-badge">
          <span>View</span>
          <span>case study</span>
        </div>
      ) : (
        <div className="cursor-dot" />
      )}

      <style jsx>{`
        .custom-cursor-root {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999;
          transform: translate3d(-100px, -100px, 0);
          will-change: transform;
        }

        .cursor-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.9);
          background-color: rgba(255, 255, 255, 0.15);
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background-color 0.2s;
        }

        .cursor-card-badge {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: var(--accent);
          color: #000000;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-utility);
          font-size: 13px;
          font-weight: 600;
          line-height: 1.15;
          text-align: center;
          box-shadow: 0 10px 30px rgba(255, 99, 15, 0.4);
          animation: badgePop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes badgePop {
          from {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
