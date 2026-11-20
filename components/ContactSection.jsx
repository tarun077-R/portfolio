'use client';

import React, { useState } from 'react';
import { PERSONA } from '../data/portfolio';

export default function ContactSection() {
  const [copyStatus, setCopyStatus] = useState('');
  const [copyStatusType, setCopyStatusType] = useState('idle');

  const currentYear = new Date().getFullYear();

  const handleCopyEmail = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyStatusType('manual');
      setCopyStatus(`Please select and copy ${PERSONA.email} manually.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(PERSONA.email);
      setCopyStatusType('success');
      setCopyStatus('Email address copied to clipboard.');
      setTimeout(() => {
        setCopyStatus('');
        setCopyStatusType('idle');
      }, 4000);
    } catch {
      setCopyStatusType('manual');
      setCopyStatus(`Copy failed. Please copy ${PERSONA.email} manually.`);
    }
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    const topEl = document.getElementById('top');
    if (topEl) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      topEl.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      topEl.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="contact-section container-inset">
      <div className="section-divider" aria-hidden="true" />

      <div className="contact-header">
        <span className="section-kicker">Contact</span>
      </div>

      <div className="contact-title-wrap">
        <h2 className="contact-title">
          <span className="title-line-1">LET’S MAKE</span>
          <span className="title-line-2">SOMETHING MATTER.</span>
        </h2>
      </div>

      <div className="contact-body-grid">
        <div className="contact-left-col">
          <p className="contact-prompt-text">
            Have a web application, platform, or digital experience in mind? Tell me what you’re
            building and where you want to take it.
          </p>
          <p className="contact-sub-tags">
            Full-stack web apps / E-commerce platforms / Digital interfaces
          </p>
        </div>

        <div className="contact-right-col">
          <div className="email-actions-block">
            <a
              href={`mailto:${PERSONA.email}`}
              className="email-anchor"
              aria-label={`Send email to ${PERSONA.email}`}
            >
              {PERSONA.email}
            </a>

            <button
              type="button"
              className="copy-email-btn"
              onClick={handleCopyEmail}
              aria-label="Copy email address to clipboard"
            >
              Copy email
            </button>
          </div>

          <div
            className={`copy-live-status ${copyStatusType}`}
            aria-live="polite"
            role="status"
          >
            {copyStatus}
          </div>

          <div className="social-links-row">
            <a
              href={PERSONA.resume || '/resume/Mern_developer.pdf'}
              download="Tarun_Rawat_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Download Tarun Rawat's Resume (PDF)"
            >
              <span>Resume</span>
              <span className="social-arrow" aria-hidden="true">↓</span>
            </a>
            {PERSONA.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <span>{link.label}</span>
                <span className="social-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="portfolio-footer">
        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-top-row">
          <span className="footer-copyright">
            © {currentYear} {PERSONA.firstName} {PERSONA.lastName}
          </span>

          <a
            href="#top"
            onClick={handleBackToTop}
            className="footer-top-link"
            aria-label="Back to top of the page"
          >
            Back to top ↑
          </a>
        </div>

        <div className="footer-disclosure">
          Portfolio — {PERSONA.firstName} {PERSONA.lastName} — {PERSONA.role}.
        </div>
      </footer>
    </section>
  );
}
