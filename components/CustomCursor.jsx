'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
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

      // Check if hovering interactive element
      const target = e.target;
      if (target && (target.closest('a') || target.closest('button') || target.closest('[role="button"]'))) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
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

    // Highly responsive, ultra-smooth interpolation (0.38 factor)
    function updateCursor() {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.38;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.38;

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
      className={`custom-cursor-root ${projectCursor ? 'is-project' : ''} ${isHoveringLink ? 'is-hovering' : ''}`}
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

        /* Minimal, refined 14px circular cursor */
        .cursor-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.7);
          background-color: rgba(255, 255, 255, 0.08);
          transform: translate(-50%, -50%);
          transition: width 0.22s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.22s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.22s,
                      background-color 0.22s;
        }

        /* Subtle smooth expansion when hovering links/buttons */
        .custom-cursor-root.is-hovering .cursor-dot {
          width: 22px;
          height: 22px;
          border-color: var(--accent);
          background-color: rgba(255, 99, 15, 0.12);
        }

        .cursor-card-badge {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background-color: var(--accent);
          color: #000000;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--font-utility);
          font-size: 12px;
          font-weight: 600;
          line-height: 1.15;
          text-align: center;
          box-shadow: 0 8px 24px rgba(255, 99, 15, 0.35);
          animation: badgePop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes badgePop {
          from {
            transform: translate(-50%, -50%) scale(0.7);
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
