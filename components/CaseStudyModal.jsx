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

      // Focus close button or first focusable
      const closeBtn = dialog.querySelector('.modal-close-btn');
      closeBtn?.focus();
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.classList.remove('scroll-locked');
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.removeAttribute('inert');

      // Restore focus to opener button
      if (openerRef?.current) {
        openerRef.current.focus();
      }
    }
  }, [isOpen, openerRef]);

  // Handle backdrop click outside dialog rectangle
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

  // Handle native cancel event (Escape key)
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
            CASE STUDY // {project.id} — {project.year}
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
          {/* Header & Title */}
          <div className="modal-header-section">
            <div className="modal-discipline-label">{project.discipline}</div>
            <h2 id="case-study-title" className="modal-title">
              {project.title}
            </h2>
            <p className="modal-summary">{project.summary}</p>
          </div>

          {/* Large Contained Artwork Illustration */}
          <div className="modal-artwork-container">
            <ProjectArtwork
              variant={project.coverKey}
              className="modal-artwork-svg"
              ariaLabel={`${project.title} vector architecture`}
            />
          </div>

          {/* Metadata Grid */}
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

          {/* Deliverables List */}
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

          {/* Detailed Content: Challenge & Approach */}
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

          {/* Action Row / Live Link Button */}
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

      <style jsx>{`
        .case-study-dialog {
          width: min(1040px, calc(100vw - 32px));
          max-height: calc(100svh - 32px);
          background-color: #101010;
          color: #f2f0e9;
          border: 1px solid #444444;
          border-radius: 4px;
          padding: 0;
          margin: auto;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.8);
          overflow: hidden;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.22s ease-out, transform 0.22s ease-out;
        }

        .case-study-dialog[open] {
          opacity: 1;
          transform: translateY(0);
        }

        .case-study-dialog::backdrop {
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(4px);
        }

        .modal-inner {
          display: flex;
          flex-direction: column;
          max-height: calc(100svh - 32px);
          overflow-y: auto;
        }

        /* Sticky Toolbar */
        .modal-sticky-toolbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: rgba(16, 16, 16, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #282828;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
        }

        .modal-toolbar-badge {
          font-family: var(--font-utility);
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--accent);
          text-transform: uppercase;
          font-weight: 600;
        }

        .modal-close-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #444444;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 999px;
          font-family: var(--font-utility);
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }

        .modal-close-btn:hover {
          background-color: #ffffff;
          border-color: #ffffff;
          color: #000000;
        }

        .close-icon {
          font-size: 11px;
        }

        /* Body Content */
        .modal-body-content {
          padding: 40px 48px 60px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .modal-header-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-discipline-label {
          font-family: var(--font-utility);
          font-size: 14px;
          letter-spacing: 0.1em;
          color: var(--accent);
          text-transform: uppercase;
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 6vw, 82px);
          font-weight: 500;
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #ffffff;
        }

        .modal-summary {
          font-family: var(--font-body);
          font-size: 20px;
          line-height: 1.5;
          color: #d1cfc7;
          max-width: 800px;
          margin-top: 8px;
        }

        /* Large Artwork Container */
        .modal-artwork-container {
          width: 100%;
          max-height: 540px;
          background-color: #0a0a0a;
          border: 1px solid #282828;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
        }

        .modal-artwork-svg {
          max-height: 490px;
          width: auto;
          max-width: 100%;
        }

        /* Metadata Grid */
        .modal-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px 32px;
          border-top: 1px solid #282828;
          border-bottom: 1px solid #282828;
          padding: 28px 0;
        }

        .meta-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-label {
          font-family: var(--font-utility);
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--muted-text);
          text-transform: uppercase;
        }

        .meta-value {
          font-family: var(--font-body);
          font-size: 16px;
          color: #ffffff;
          line-height: 1.4;
        }

        .modal-deliverables-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .deliverables-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* Details Rows */
        .modal-details-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
          border-top: 1px solid #282828;
          padding-top: 32px;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
        }

        .detail-label {
          font-family: var(--font-utility);
          font-size: 13px;
          letter-spacing: 0.15em;
          color: var(--accent);
          text-transform: uppercase;
          font-weight: 500;
        }

        .detail-body {
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.6;
          color: #d1cfc7;
        }

        /* Footer Actions */
        .modal-footer-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid #282828;
        }

        .modal-url-text {
          font-family: var(--font-utility);
          font-size: 14px;
          color: var(--muted-text);
        }

        @media (max-width: 768px) {
          .modal-body-content {
            padding: 28px 24px 40px;
            gap: 28px;
          }

          .modal-meta-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .detail-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .modal-footer-actions {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </dialog>
  );
}

