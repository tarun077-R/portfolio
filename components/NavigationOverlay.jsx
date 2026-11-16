'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export default function NavigationOverlay({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const firstLinkRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add('scroll-locked');
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.setAttribute('inert', '');

    const timer = setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 50);

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('scroll-locked');
      if (mainContent) mainContent.removeAttribute('inert');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = useCallback((e, href) => {
    e.preventDefault();
    onClose();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="nav-scrim" onClick={onClose} aria-hidden="true" />

      <nav
        id="nav-overlay"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="nav-panel"
      >
        <div className="nav-links-container">
          {NAV_LINKS.map((link, idx) => {
            const letters = link.label.split('');
            return (
              <a
                key={link.label}
                href={link.href}
                ref={idx === 0 ? firstLinkRef : null}
                className="nav-link-item"
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
              >
                <span className="sr-only">{link.label}</span>
                <span className="rolling-word" aria-hidden="true">
                  {letters.map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="rolling-char-window"
                      style={{ '--char-delay': `${charIdx * 34}ms` }}
                    >
                      <span className={`rolling-stack ${hoveredIndex === idx ? 'is-rolled' : ''}`}>
                        <span className="char-front">{char}</span>
                        <span className="char-back">{char}</span>
                      </span>
                    </span>
                  ))}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
