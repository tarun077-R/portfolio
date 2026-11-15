'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../data/portfolio';

const HEADING_LINE_1 = 'THOUGHTFUL SYSTEMS.';
const HEADING_LINE_2 = 'DISTINCTIVE OUTCOMES.';

export default function CapabilitiesList() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // IntersectionObserver reveal at 0.15
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleService = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="capabilities-section container-inset"
    >
      {/* 1px Top Border */}
      <div className="section-divider" aria-hidden="true" />

      {/* Top Header Block */}
      <div className="capabilities-top-header">
        <div className="capabilities-title-wrap">
          <h2 className="sr-only">Capabilities — Thoughtful Systems, Distinctive Outcomes</h2>

          <div className="capabilities-heading" aria-hidden="true">
            {/* Line 1: White */}
            <div className="heading-line line-white">
              {HEADING_LINE_1.split('').map((char, i) => (
                <span
                  key={i}
                  className={`heading-char ${inView ? 'is-revealed' : ''}`}
                  style={{ '--char-delay': `${i * 18}ms` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>

            {/* Line 2: Orange */}
            <div className="heading-line line-orange">
              {HEADING_LINE_2.split('').map((char, i) => (
                <span
                  key={i}
                  className={`heading-char ${inView ? 'is-revealed' : ''}`}
                  style={{
                    '--char-delay': `${(HEADING_LINE_1.length + i) * 18}ms`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="capabilities-kicker-wrap">
          <span className="section-kicker">// CAPABILITIES</span>
        </div>
      </div>

      {/* Services List Table */}
      <div className="capabilities-list" role="list">
        {SERVICES.map((service, idx) => {
          const isExpanded = expandedId === service.id;
          const panelId = `capability-panel-${service.id}`;
          const triggerId = `capability-trigger-${service.id}`;

          return (
            <div
              key={service.id}
              className={`capability-row ${inView ? 'is-revealed' : ''}`}
              style={{ '--row-delay': `${idx * 85}ms` }}
              role="listitem"
            >
              {/* Row Summary Bar */}
              <div className="capability-row-summary">
                <span className="cap-idx">{service.id}</span>
                <span className="cap-title">{service.title}</span>
                <span className="cap-scope">{service.scope}</span>

                <div className="cap-action">
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    className="btn-disclosure"
                    onClick={() => toggleService(service.id)}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${service.title} details`}
                  >
                    <span>{isExpanded ? 'Close −' : 'Explore +'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Panel */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isExpanded}
                className={`capability-panel ${isExpanded ? 'is-open' : ''}`}
              >
                <div className="panel-inner">
                  <p className="panel-description">{service.text}</p>
                  <div className="panel-deliverables">
                    <span className="deliverables-heading">Example deliverables:</span>
                    <span className="deliverables-text">{service.deliverables}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Notes */}
      <div className="capabilities-footer-notes">
        <span className="note-left">From a focused web application to a complete digital platform.</span>
        <span className="note-right">Independent practice / Collaborative approach</span>
      </div>

      <style jsx>{`
        .capabilities-section {
          position: relative;
          width: 100%;
          min-height: 680px;
          padding-top: 60px;
          padding-bottom: 50px;
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

        .capabilities-top-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 70px;
        }

        .capabilities-title-wrap {
          flex: 1;
        }

        .capabilities-heading {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(30px, 6.4cqw, 86px);
          line-height: 1;
          letter-spacing: -0.045em;
          text-transform: uppercase;
        }

        .heading-line {
          display: flex;
          flex-wrap: wrap;
        }

        .line-white {
          color: #ffffff;
        }

        .line-orange {
          color: var(--accent);
        }

        .heading-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(24px);
          filter: blur(8px);
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease-out;
          transition-delay: var(--char-delay, 0ms);
          will-change: transform, opacity, filter;
        }

        .heading-char.is-revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
        }

        .capabilities-kicker-wrap {
          margin-left: 24px;
        }

        /* Ruled Rows */
        .capabilities-list {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .capability-row {
          border-top: 1px solid var(--divider-mid);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--row-delay, 0ms);
        }

        .capability-row:last-child {
          border-bottom: 1px solid var(--divider-mid);
        }

        .capability-row.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .capability-row-summary {
          display: grid;
          grid-template-columns: 42px minmax(0, 1.1fr) minmax(0, 1.7fr) 140px;
          gap: 16px;
          align-items: center;
          padding: 24px 0;
        }

        .cap-idx {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-mid);
        }

        .cap-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .cap-scope {
          font-family: var(--font-body);
          font-size: 18px;
          color: var(--muted-light);
        }

        .cap-action {
          justify-self: end;
        }

        .btn-disclosure {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          background-color: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: 999px;
          font-family: var(--font-utility);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.25s, color 0.25s, transform 0.2s;
          white-space: nowrap;
          min-width: 105px;
        }

        .btn-disclosure:hover {
          background-color: var(--accent);
          color: #000000;
          transform: scale(1.03);
        }

        .btn-disclosure:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
        }

        /* Collapsible Panel */
        .capability-panel {
          overflow: hidden;
          background-color: #080808;
          border-top: 1px dashed var(--divider-dark);
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
        }

        .capability-panel[hidden] {
          display: none;
        }

        .panel-inner {
          padding: 24px 42px 32px 58px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-description {
          font-family: var(--font-body);
          font-size: 18px;
          line-height: 1.6;
          color: #d8d8d8;
          max-width: 800px;
        }

        .panel-deliverables {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-light);
          flex-wrap: wrap;
        }

        .deliverables-heading {
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .deliverables-text {
          color: #ffffff;
        }

        /* Footer Notes */
        .capabilities-footer-notes {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 60px;
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-text);
          letter-spacing: 0.02em;
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

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .capabilities-top-header {
            flex-direction: column;
            gap: 20px;
            margin-bottom: 50px;
          }
          .capabilities-kicker-wrap {
            margin-left: 0;
          }
          .capability-row-summary {
            grid-template-columns: 32px minmax(0, 1fr) 120px;
          }
          .cap-scope {
            display: none;
          }
          .panel-inner {
            padding: 20px 16px 24px 32px;
          }
        }

        @media (max-width: 560px) {
          .capabilities-section {
            min-height: auto;
            padding-top: 40px;
            padding-bottom: 40px;
          }
          .capabilities-heading {
            font-size: 9.1cqw;
          }
          .capability-row-summary {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 20px 0;
          }
          .cap-idx {
            font-size: 12px;
          }
          .cap-title {
            font-size: 20px;
          }
          .cap-scope {
            display: block;
            font-size: 15px;
          }
          .cap-action {
            justify-self: start;
            margin-top: 6px;
          }
          .panel-inner {
            padding: 16px 0 24px 0;
          }
          .panel-description {
            font-size: 16px;
          }
          .capabilities-footer-notes {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-top: 40px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .heading-char,
          .capability-row {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
