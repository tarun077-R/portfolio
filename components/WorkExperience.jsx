'use client';

import React from 'react';
import { EXPERIENCE } from '../data/portfolio';

// Minimal inline SVG icons matching site theme
function BriefcaseIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CalendarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalLinkIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function WorkExperience() {
  return (
    <section id="experience" className="experience-section container-inset">
      <div className="section-divider" aria-hidden="true" />

      {/* Section Header */}
      <div className="experience-header">
        <div className="experience-header-left">
          <span className="section-kicker">Experience</span>
          <h2 className="experience-title">PROFESSIONAL WORK &amp; INTERNSHIPS.</h2>
        </div>
        <span className="experience-header-meta">PRODUCTION SYSTEMS / 2026</span>
      </div>

      {/* Experience Timeline / Cards */}
      <div className="experience-cards-wrapper">
        {EXPERIENCE.map((exp) => (
          <article key={exp.id} className="experience-card">
            {/* Top Company & Role Row */}
            <div className="experience-card-top">
              <div className="experience-role-group">
                <div className="experience-role-header">
                  <div className="company-icon-badge" aria-hidden="true">
                    <BriefcaseIcon className="badge-icon" />
                  </div>
                  <div>
                    <h3 className="experience-role-title">{exp.role}</h3>
                    <div className="experience-company-name">
                      <span>{exp.company}</span>
                      <span className="meta-bullet">•</span>
                      <span className="experience-status-badge">{exp.badge}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="experience-period-badge">
                <CalendarIcon className="calendar-icon" />
                <span>{exp.period}</span>
              </div>
            </div>

            <p className="experience-summary">{exp.summary}</p>

            {/* Projects Undertaken during Internship */}
            <div className="experience-projects-grid">
              {exp.projects.map((proj) => (
                <div key={proj.id} className="experience-project-item">
                  <div className="project-item-header">
                    <div className="project-item-title-wrap">
                      <h4 className="project-item-title">
                        {proj.title}
                      </h4>
                      <span className="project-item-category">{proj.category}</span>
                    </div>

                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-live-btn"
                        aria-label={`Visit live website for ${proj.title}`}
                      >
                        <span>Live Site</span>
                        <ExternalLinkIcon className="external-icon" />
                      </a>
                    )}
                  </div>

                  {/* Core Contributions */}
                  <ul className="project-contributions-list">
                    {proj.contributions.map((point, idx) => (
                      <li key={idx} className="contribution-item">
                        <span className="contribution-bullet" aria-hidden="true">
                          <CheckIcon className="check-icon" />
                        </span>
                        <span className="contribution-text">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Badges */}
                  <div className="project-tech-tags">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="pill-tag tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
