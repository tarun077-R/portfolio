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

    // Lock body scroll and mark main content inert
    document.body.classList.add('scroll-locked');
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('inert', '');
    }

    // Set focus to the first link on open
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
        const focusableElements = overlayRef.current?.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('scroll-locked');
      if (mainContent) {
        mainContent.removeAttribute('inert');
      }
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
      {/* 65% Black Scrim */}
      <div
        className="nav-scrim"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          zIndex: 80,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'opacity 0.42s cubic-bezier(0.44, 0, 0.56, 1)'
        }}
      />

      {/* Expanding Top Navigation Panel */}
      <nav
        id="nav-overlay"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#000000',
          borderBottom: '1px solid #222222',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'navPanelSlide 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
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
                {/* Accessible text for screen readers */}
                <span className="sr-only">{link.label}</span>

                {/* Decorative rolling letters */}
                <span className="rolling-word" aria-hidden="true">
                  {letters.map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="rolling-char-window"
                      style={{
                        '--char-delay': `${charIdx * 34}ms`
                      }}
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

      <style jsx>{`
        @keyframes navPanelSlide {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-panel {
          height: 507px;
          padding: 105px 40px 80px;
        }

        .nav-links-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
        }

        .nav-link-item {
          text-decoration: none;
          color: #ffffff;
          display: block;
          outline: none;
        }

        .nav-link-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 8px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .rolling-word {
          display: inline-flex;
          font-family: var(--font-display);
          font-size: 96px;
          font-weight: 500;
          line-height: 88px;
          letter-spacing: -3.84px;
        }

        .rolling-char-window {
          display: inline-block;
          height: 88px;
          overflow: hidden;
          position: relative;
        }

        .rolling-stack {
          display: flex;
          flex-direction: column;
          transition: transform 0.5s var(--ease-hover);
          transition-delay: var(--char-delay, 0ms);
        }

        .rolling-stack.is-rolled {
          transform: translateY(-88px);
        }

        .char-front {
          display: block;
          height: 88px;
          line-height: 88px;
          color: #ffffff;
        }

        .char-back {
          display: block;
          height: 88px;
          line-height: 88px;
          color: var(--accent);
        }

        @media (max-width: 700px) {
          .nav-panel {
            height: 430px;
            padding: 80px 24px 60px;
          }

          .nav-links-container {
            gap: 28px;
          }

          .rolling-word {
            font-size: 64px;
            line-height: 64px;
            letter-spacing: -2px;
          }

          .rolling-char-window {
            height: 64px;
          }

          .char-front,
          .char-back {
            height: 64px;
            line-height: 64px;
          }

          .rolling-stack.is-rolled {
            transform: translateY(-64px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rolling-stack {
            transition: none !important;
          }
          .rolling-stack.is-rolled {
            transform: none !important;
          }
          .nav-link-item:hover .char-front {
            color: var(--accent);
          }
        }
      `}</style>
    </>
  );
}

