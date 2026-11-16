'use client';

import React, { useEffect, useRef } from 'react';
import ProjectArtwork from './ProjectArtwork';

export default function CaseStudyModal({ project, isOpen, onClose, openerRef }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.classList.add('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.setAttribute('inert', '');

      const closeBtn = dialog.querySelector('.modal-close-btn');
      closeBtn?.focus();
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.classList.remove('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.removeAttribute('inert');

      if (openerRef?.current) {
        openerRef.current.focus();
      }
    }
  }, [isOpen, openerRef]);

  const handleDialogClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInDialog) {
      onClose();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
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
          <span className="modal-toolbar-badge">
            CASE STUDY — {project.id} • {project.year}
          </span>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close case study dialog"
          >
            <span>Close</span>
            <span className="close-icon" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="modal-body-content">
          <div className="modal-header-section">
            <div className="modal-discipline-label">{project.discipline}</div>
            <h2 id="case-study-title" className="modal-title">
              {project.title}
            </h2>
            <p className="modal-summary">{project.summary}</p>
          </div>

          <div className="modal-artwork-container">
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

          {project.liveUrl && (
            <div className="modal-footer-actions">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-white modal-live-btn"
              >
                Visit live application ↗
              </a>
              <span className="modal-url-text">{project.liveUrl}</span>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
