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

      const target = e.target;
      setIsHoveringLink(Boolean(target?.closest('a, button, [role="button"]')));
      setProjectCursor(Boolean(target?.closest('[data-cursor="project"]')));
    }

    function onMouseLeave() { setVisible(false); }
    function onMouseEnter() { setVisible(true); }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

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
    </div>
  );
}
