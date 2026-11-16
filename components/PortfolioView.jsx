'use client';

import React, { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './HeroSection';
import ApproachStatement from './ApproachStatement';
import FeaturedProject from './FeaturedProject';
import WorkIndex from './WorkIndex';
import CapabilitiesList from './CapabilitiesList';
import ContactSection from './ContactSection';

// Ponytail dynamic code-splitting: load overlay and modal only when requested
const NavigationOverlay = dynamic(() => import('./NavigationOverlay'), {
  ssr: false
});

const CaseStudyModal = dynamic(() => import('./CaseStudyModal'), {
  ssr: false
});

export default function PortfolioView() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const openerRef = useRef(null);

  const handleOpenNav = useCallback(() => {
    // Prevent modal conflict
    setActiveProject(null);
    setIsNavOpen((prev) => !prev);
  }, []);

  const handleCloseNav = useCallback(() => {
    setIsNavOpen(false);
  }, []);

  const handleOpenCaseStudy = useCallback((project, triggerEl = null) => {
    // Prevent modal conflict
    setIsNavOpen(false);
    openerRef.current = triggerEl;
    setActiveProject(project);
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <>
      {/* Navigation Overlay (outside main for clean modal inertness) */}
      <NavigationOverlay
        isOpen={isNavOpen}
        onClose={handleCloseNav}
      />

      {/* Case Study Modal (outside main for clean modal inertness) */}
      <CaseStudyModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={handleCloseCaseStudy}
        openerRef={openerRef}
      />

      {/* Main Semantic Page Content */}
      <main id="main-content">
        {/* Section 1: Hero */}
        <HeroSection
          onOpenNav={handleOpenNav}
          isNavOpen={isNavOpen}
        />

        {/* Section 2: Approach */}
        <ApproachStatement />

        {/* Section 3: Featured Project */}
        <FeaturedProject
          onOpenModal={handleOpenCaseStudy}
        />

        {/* Section 4: Selected Work */}
        <WorkIndex
          onOpenModal={handleOpenCaseStudy}
        />

        {/* Section 5: Capabilities */}
        <CapabilitiesList />

        {/* Section 6: Contact */}
        <ContactSection />
      </main>
    </>
  );
}

