'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../data/portfolio';

function renderChars(text, inView, offset = 0) {
  return text.split('').map((char, i) => (
    <span
      key={i}
      className={`heading-char ${inView ? 'is-revealed' : ''}`}
      style={{ '--char-delay': `${(offset + i) * 18}ms` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

export default function CapabilitiesList() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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
      <div className="section-divider" aria-hidden="true" />

      <div className="capabilities-top-header">
        <div className="capabilities-title-wrap">
          <h2 className="sr-only">Capabilities — Thoughtful Systems, Distinctive Outcomes</h2>

          <div className="capabilities-heading" aria-hidden="true">
            <div className="heading-line line-white">
              {renderChars('THOUGHTFUL SYSTEMS.', inView, 0)}
            </div>
            <div className="heading-line line-orange">
              {renderChars('DISTINCTIVE OUTCOMES.', inView, 19)}
            </div>
          </div>
        </div>

        <div className="capabilities-kicker-wrap">
          <span className="section-kicker">CAPABILITIES</span>
        </div>
      </div>

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

      <div className="capabilities-footer-notes">
        <span className="note-left">From a focused web application to a complete digital platform.</span>
        <span className="note-right">Independent practice / Collaborative approach</span>
      </div>
    </section>
  );
}
