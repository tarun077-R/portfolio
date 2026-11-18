'use client';

import React from 'react';
import { SKILL_CATEGORIES } from '../data/portfolio';

// Minimal inline SVG icons for categories
function LayoutIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function ServerIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function DatabaseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function WorkflowIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  );
}

function renderCategoryIcon(iconType) {
  switch (iconType) {
    case 'layout':
      return <LayoutIcon className="category-icon" />;
    case 'server':
      return <ServerIcon className="category-icon" />;
    case 'database':
      return <DatabaseIcon className="category-icon" />;
    case 'workflow':
    default:
      return <WorkflowIcon className="category-icon" />;
  }
}

export default function TechnicalSkills() {
  return (
    <section id="skills" className="skills-section container-inset">
      <div className="section-divider" aria-hidden="true" />

      {/* Section Header */}
      <div className="skills-header">
        <div className="skills-header-left">
          <span className="section-kicker">Technical Skills</span>
          <h2 className="skills-title">STACK, ARCHITECTURE &amp; TOOLING.</h2>
        </div>
        <span className="skills-header-meta">CORE COMPETENCIES</span>
      </div>

      {/* Grid of Skill Categories */}
      <div className="skills-grid">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={cat.id} className="skill-category-card">
            <div className="category-card-top">
              <div className="category-icon-box" aria-hidden="true">
                {renderCategoryIcon(cat.iconType)}
              </div>
              <div>
                <span className="category-index">0{idx + 1}</span>
                <h3 className="category-title">{cat.title}</h3>
              </div>
            </div>

            <p className="category-description">{cat.description}</p>

            <div className="category-groups-list">
              {cat.groups.map((grp) => (
                <div key={grp.name} className="skill-subgroup">
                  <span className="subgroup-label">{grp.name}</span>
                  <div className="subgroup-tags">
                    {grp.skills.map((skill) => (
                      <span key={skill} className="pill-tag skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
