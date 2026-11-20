'use client';

import React, { useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';
import { PROJECTS } from '../data/portfolio';

export default function CaseStudyModal({
  project,
  isOpen,
  onClose,
  openerRef,
  onSelectProject
}) {
  const dialogRef = useRef(null);

  // Compute navigation indices
  const currentIndex = PROJECTS.findIndex((p) => p.id === project?.id);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : PROJECTS[0];

  const handleSafeClose = () => {
    document.body.classList.remove('scroll-locked');
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.removeAttribute('inert');
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && dialog) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.classList.add('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.setAttribute('inert', '');

      const closeBtn = dialog.querySelector('.modal-close-btn');
      closeBtn?.focus();
    } else {
      document.body.classList.remove('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.removeAttribute('inert');

      if (dialog && dialog.open) {
        dialog.close();
      }
      if (openerRef?.current) {
        openerRef.current.focus();
      }
    }

    return () => {
      document.body.classList.remove('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.removeAttribute('inert');
      if (dialog && dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen, openerRef]);

  // Arrow key navigation between projects
  useEffect(() => {
    if (!isOpen || !onSelectProject) return;

    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSelectProject(nextProject);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSelectProject(prevProject);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextProject, prevProject, onSelectProject]);

  const handleDialogClick = (e) => {
    // Only close if user clicked directly on the dialog backdrop, not inside the modal content or scrollbar
    if (e.target === dialogRef.current) {
      handleSafeClose();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleSafeClose();
  };

  const handleDiscussClick = (e) => {
    e.preventDefault();
    handleSafeClose();
    setTimeout(() => {
      const contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
        contact.setAttribute('tabindex', '-1');
        contact.focus({ preventScroll: true });
      }
    }, 150);
  };

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="case-study-dialog"
      onClick={handleDialogClick}
      onCancel={handleCancel}
      aria-labelledby="case-study-title"
    >
      <div className="modal-inner">
        {/* Sticky Toolbar */}
        <div className="modal-sticky-toolbar">
          <div className="modal-toolbar-left">
            <span className="modal-toolbar-badge">
              CASE STUDY — {project.id} / {String(PROJECTS.length).padStart(2, '0')}
            </span>

            {onSelectProject && (
              <div className="modal-nav-arrows" role="group" aria-label="Project switcher">
                <button
                  type="button"
                  className="modal-nav-btn"
                  onClick={() => onSelectProject(prevProject)}
                  aria-label={`Previous project: ${prevProject.title}`}
                  title="Previous project (← key)"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="modal-nav-btn"
                  onClick={() => onSelectProject(nextProject)}
                  aria-label={`Next project: ${nextProject.title}`}
                  title="Next project (→ key)"
                >
                  →
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={handleSafeClose}
            aria-label="Close case study dialog"
          >
            <span>Close</span>
            <span className="close-icon" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="modal-body-content">
          <div className="modal-header-section">
            <div className="modal-discipline-label">{project.discipline} • {project.year}</div>
            <h2 id="case-study-title" className="modal-title">
              {project.title}
            </h2>
            <p className="modal-summary">{project.summary}</p>
          </div>

          <div className="modal-artwork-container skeleton-shimmer">
            <ProjectArtwork
              variant={project.coverKey}
              className="modal-artwork-svg"
              ariaLabel={`${project.title} vector architecture`}
            />
          </div>

          <div className="modal-meta-grid">
            <div className="meta-block">
              <span className="meta-label">ROLE</span>
              <span className="meta-value">{project.role}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">DISCIPLINE</span>
              <span className="meta-value">{project.discipline}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">YEAR</span>
              <span className="meta-value">{project.year}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">PROJECT TYPE</span>
              <span className="meta-value">{project.projectType}</span>
            </div>
          </div>

          {project.deliverables && project.deliverables.length > 0 && (
            <div className="modal-deliverables-section">
              <span className="meta-label">KEY DELIVERABLES</span>
              <div className="deliverables-tags">
                {project.deliverables.map((item, idx) => (
                  <span key={idx} className="pill-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal-details-grid">
            <div className="detail-row">
              <div className="detail-label">THE CHALLENGE</div>
              <div className="detail-body">{project.challenge}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">THE APPROACH</div>
              <div className="detail-body">{project.approach}</div>
            </div>
          </div>

          <div className="modal-footer-actions">
            {project.liveUrl ? (
              <>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-white modal-live-btn"
                >
                  Visit live application ↗
                </a>
                <span className="modal-url-text">{project.liveUrl}</span>
              </>
            ) : (
              <>
                <a
                  href="https://github.com/tarun077-R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-white modal-live-btn"
                >
                  View GitHub profile ↗
                </a>
                <a
                  href="#contact"
                  onClick={handleDiscussClick}
                  className="modal-discuss-link"
                >
                  Discuss this build →
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
