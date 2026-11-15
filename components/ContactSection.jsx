'use client';

import React, { useState } from 'react';
import { PERSONA } from '../data/portfolio';

export default function ContactSection() {
  const [copyStatus, setCopyStatus] = useState('');
  const [copyStatusType, setCopyStatusType] = useState('idle'); // idle | success | manual

  const currentYear = new Date().getFullYear();

  const handleCopyEmail = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyStatusType('manual');
      setCopyStatus('Please select and copy tarunrawat8350@gmail.com manually.');
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
      setCopyStatus('Copy failed. Please copy tarunrawat8350@gmail.com manually.');
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
      {/* 1px Top Border */}
      <div className="section-divider" aria-hidden="true" />

      {/* Kicker */}
      <div className="contact-header">
        <span className="section-kicker">// Contact</span>
      </div>

      {/* Large Two-Line Heading */}
      <div className="contact-title-wrap">
        <h2 className="contact-title">
          <span className="title-line-1">LET’S MAKE</span>
          <span className="title-line-2">SOMETHING MATTER.</span>
        </h2>
      </div>

      {/* Two-Column Arrangement */}
      <div className="contact-body-grid">
        {/* Left Column */}
        <div className="contact-left-col">
          <p className="contact-prompt-text">
            Have a web application, platform, or digital experience in mind? Tell me what you’re
            building and where you want to take it.
          </p>
          <p className="contact-sub-tags">
            Full-stack web apps / E-commerce platforms / Digital interfaces
          </p>
        </div>

        {/* Right Column: Email Controls & Social Links */}
        <div className="contact-right-col">
          {/* Email Row */}
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

          {/* Polite live region for screen readers and visual copy confirmation */}
          <div
            className={`copy-live-status ${copyStatusType}`}
            aria-live="polite"
            role="status"
          >
            {copyStatus}
          </div>

          {/* Configured Social Links */}
          <div className="social-links-row">
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

      {/* Bottom Footer Area (~100px below contact details) */}
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
          Portfolio — {PERSONA.firstName} {PERSONA.lastName} // {PERSONA.role}.
        </div>
      </footer>

      <style jsx>{`
        .contact-section {
          position: relative;
          width: 100%;
          padding-top: 110px;
          padding-bottom: 36px;
          background-color: #000000;
          display: flex;
          flex-direction: column;
          container-type: inline-size;
        }

        .section-divider {
          width: 100%;
          height: 1px;
          background-color: var(--divider-dark);
          margin-bottom: 40px;
        }

        .contact-header {
          display: flex;
          align-items: center;
          margin-bottom: 42px;
        }

        .contact-title-wrap {
          margin-bottom: 70px;
        }

        .contact-title {
          display: flex;
          flex-direction: column;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(38px, 8.5cqw, 116px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .title-line-1 {
          color: #ffffff;
        }

        .title-line-2 {
          color: var(--accent);
        }

        /* Two Column Grid */
        .contact-body-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 60px;
          align-items: flex-start;
          width: 100%;
        }

        .contact-left-col {
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-prompt-text {
          font-family: var(--font-body);
          font-size: 20px;
          line-height: 1.5;
          color: #e2e0d8;
        }

        .contact-sub-tags {
          font-family: var(--font-utility);
          font-size: 13px;
          color: var(--muted-text);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Right Column */
        .contact-right-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .email-actions-block {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .email-anchor {
          font-family: var(--font-display);
          font-size: clamp(22px, 3.2cqw, 36px);
          font-weight: 500;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: -0.02em;
          transition: color 0.2s;
        }

        .email-anchor:hover {
          color: var(--accent);
        }

        .copy-email-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          background-color: transparent;
          border: 1px solid var(--divider-subtle);
          border-radius: 999px;
          font-family: var(--font-utility);
          font-size: 14px;
          color: #ffffff;
          cursor: pointer;
          transition: border-color 0.25s, background-color 0.25s, color 0.25s;
        }

        .copy-email-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background-color: rgba(255, 99, 15, 0.08);
        }

        .copy-live-status {
          min-height: 20px;
          font-family: var(--font-utility);
          font-size: 13px;
          color: var(--muted-mid);
        }

        .copy-live-status.success {
          color: #4ade80;
        }

        .copy-live-status.manual {
          color: var(--accent-light);
        }

        /* Social Links */
        .social-links-row {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 12px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-utility);
          font-size: 16px;
          color: var(--muted-light);
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s, transform 0.2s;
        }

        .social-link:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .social-arrow {
          font-size: 14px;
          color: var(--accent);
        }

        /* Footer Block */
        .portfolio-footer {
          margin-top: 100px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-divider {
          width: 100%;
          height: 1px;
          background-color: var(--divider-dark);
          margin-bottom: 12px;
        }

        .footer-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-mid);
        }

        .footer-top-link {
          color: #ffffff;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-top-link:hover {
          color: var(--accent);
        }

        .footer-disclosure {
          font-family: var(--font-utility);
          font-size: 13px;
          color: var(--muted-text);
          letter-spacing: 0.02em;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .contact-section {
            padding-top: 80px;
          }
          .contact-body-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 560px) {
          .contact-section {
            padding-top: 65px;
          }
          .contact-title {
            font-size: 11.4cqw;
          }
          .contact-prompt-text {
            font-size: 17px;
          }
          .email-actions-block {
            flex-direction: column;
            align-items: flex-start;
          }
          .social-links-row {
            gap: 20px;
          }
          .portfolio-footer {
            margin-top: 60px;
          }
          .footer-top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
