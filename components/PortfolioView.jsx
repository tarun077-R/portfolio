'use client';

import React, { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from './PageLoader';
import HeroSection from './HeroSection';
import ApproachStatement from './ApproachStatement';
import FeaturedProject from './FeaturedProject';
import WorkIndex from './WorkIndex';
import CapabilitiesList from './CapabilitiesList';
import WorkExperience from './WorkExperience';
import TechnicalSkills from './TechnicalSkills';
import ContactSection from './ContactSection';
import { SkeletonCard } from './Skeleton';

// Ponytail dynamic code-splitting: load overlay and modal only when requested with shimmer fallbacks
const NavigationOverlay = dynamic(() => import('./NavigationOverlay'), {
  ssr: false
});

const CaseStudyModal = dynamic(() => import('./CaseStudyModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
      <SkeletonCard className="w-full max-w-2xl h-[480px]" />
    </div>
  )
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
    document.body.classList.remove('scroll-locked');
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.removeAttribute('inert');
    setActiveProject(null);
  }, []);

  return (
    <>
      {/* Editorial Page Loader & Asset Shimmer */}
      <PageLoader />

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
        onSelectProject={setActiveProject}
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

        {/* Section 5: Experience */}
        <WorkExperience />

        {/* Section 6: Technical Skills */}
        <TechnicalSkills />

        {/* Section 7: Capabilities */}
        <CapabilitiesList />

        {/* Section 6: Contact */}
        <ContactSection />
      </main>
    </>
  );
}

