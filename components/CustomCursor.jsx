'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState({
    visible: false,
    hovering: false,
    project: false
  });
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const stateRef = useRef(cursorState);
  stateRef.current = cursorState;

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
      const target = e.target;
      const isHovering = Boolean(target?.closest('a, button, [role="button"], input, select, textarea'));
      const isProject = Boolean(target?.closest('[data-cursor="project"]'));

      const current = stateRef.current;
      if (!current.visible || current.hovering !== isHovering || current.project !== isProject) {
        setCursorState({
          visible: true,
          hovering: isHovering,
          project: isProject
        });
      }
    }

    function onMouseLeave() {
      setCursorState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }
    function onMouseEnter() {
      setCursorState((prev) => (!prev.visible ? { ...prev, visible: true } : prev));
    }

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
  }, []);

  if (!enabled || !cursorState.visible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-root ${cursorState.project ? 'is-project' : ''} ${cursorState.hovering ? 'is-hovering' : ''}`}
      aria-hidden="true"
    >
      {cursorState.project ? (
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
