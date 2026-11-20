'use client';

import React, { useEffect, useRef } from 'react';

export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0 && barRef.current) {
            const current = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
            barRef.current.style.transform = `scaleX(${current / 100})`;
            barRef.current.setAttribute('aria-valuenow', Math.round(current));
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'var(--accent, #ff630f)',
        zIndex: 9999,
        pointerEvents: 'none',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        willChange: 'transform'
      }}
    />
  );
}
