# Ponytail Codebase Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Ponytail methodology ("the laziest senior developer in the room" / Ladder of Laziness) to minimize, deduplicate, and optimize the portfolio codebase by 60–75% lines of code while retaining 100% of design fidelity, visual polish, accessibility, and performance.

**Architecture:** 
1. Consolidate and extract 2,300+ lines of `<style jsx>` template literals into a clean, cohesive, high-performance global stylesheet (`app/globals.css`), eliminating client-side styled-jsx runtime overhead and drastically shrinking component footprints.
2. Replace overengineered JS animations (character-splitting arrays, continuous requestAnimationFrame physics loops, window custom-event dispatchers, redundant timers) with native platform features: CSS keyframes, CSS transitions, data-attributes, and standard semantic HTML.
3. Streamline component logic across `HeroSection`, `ApproachStatement`, `FeaturedProject`, `CapabilitiesList`, `WorkIndex`, `ContactSection`, `CaseStudyModal`, `NavigationOverlay`, and `CustomCursor`.
4. Clean up temporary scratch scripts and optimize asset/config settings.

**Tech Stack:** Next.js 14 (App Router), React 18, Native CSS3 (CSS Variables, Grid, Flexbox, Animations), WebGL (Canvas).

## Global Constraints
- Zero visual regression: preserve exact typography, dark aesthetic, color palette (`#ff630f` accent), layout, spacing, and responsive behavior.
- Preserve all accessibility features: WCAG contrast, screen-reader text (`.sr-only`), skip link, aria attributes (`aria-expanded`, `aria-label`, `aria-controls`), keyboard trap/Escape handling on modals/nav, and `prefers-reduced-motion` queries.
- Do not introduce new external npm dependencies. Use native browser and React features only.

---

### Task 1: Consolidate Component Styles into `app/globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Global class definitions for hero, approach, featured, work index, capabilities, contact, modal, navigation, and cursor.

- [ ] **Step 1: Extract and deduplicate styles from all components into organized sections in `app/globals.css`**
- [ ] **Step 2: Verify all keyframes, layout variables, and responsive media queries are preserved**
- [ ] **Step 3: Commit styles consolidation**

---

### Task 2: Simplify and Optimize `CustomCursor.jsx` and `NavigationOverlay.jsx`

**Files:**
- Modify: `components/CustomCursor.jsx`
- Modify: `components/NavigationOverlay.jsx`

**Interfaces:**
- Consumes: Global CSS classes for cursor and nav.
- Produces: Clean, lightweight components using `data-cursor` attribute instead of custom window events; native focus management.

- [ ] **Step 1: Strip `<style jsx>` from `CustomCursor.jsx` and switch from `window.dispatchEvent` to native `closest('[data-cursor="project"]')` selector**
- [ ] **Step 2: Strip `<style jsx>` and inline styles from `NavigationOverlay.jsx`, retaining clean focus trap and Escape handler**
- [ ] **Step 3: Verify cursor tracking and nav overlay behavior**
- [ ] **Step 4: Commit changes**

---

### Task 3: Streamline `HeroSection.jsx` and `WebGLPortrait.jsx`

**Files:**
- Modify: `components/HeroSection.jsx`
- Modify: `components/WebGLPortrait.jsx`

**Interfaces:**
- Consumes: Global CSS for hero elements and typography.
- Produces: Sleek, high-performance hero component without 500 lines of CSS and character arrays, using CSS keyframe animations and simple clock interval.

- [ ] **Step 1: Replace character-by-character letter delay arrays with clean CSS staggered animation classes**
- [ ] **Step 2: Remove redundant window blur/visibility/font-ready timer cascade; streamline clock state**
- [ ] **Step 3: Strip 500 lines of `<style jsx>` from `HeroSection.jsx`**
- [ ] **Step 4: Verify portrait WebGL rendering and fallback glow**
- [ ] **Step 5: Commit changes**

---

### Task 4: Minimize `ApproachStatement.jsx` and `FeaturedProject.jsx`

**Files:**
- Modify: `components/ApproachStatement.jsx`
- Modify: `components/FeaturedProject.jsx`

**Interfaces:**
- Consumes: Global CSS.
- Produces: Eliminates the continuous RAF loop in `ApproachStatement` in favor of smooth CSS transitions; eliminates character splitting and custom window events in `FeaturedProject` using `data-cursor="project"`.

- [ ] **Step 1: Refactor `ApproachStatement.jsx` to use simple pointer positioning and CSS transitions instead of continuous RAF physics calculation**
- [ ] **Step 2: Refactor `FeaturedProject.jsx` to render clean titles with `data-cursor="project"` and lightweight 3D tilt**
- [ ] **Step 3: Strip `<style jsx>` from both components**
- [ ] **Step 4: Commit changes**

---

### Task 5: Streamline `WorkIndex.jsx`, `CapabilitiesList.jsx`, `ContactSection.jsx`, and `CaseStudyModal.jsx`

**Files:**
- Modify: `components/WorkIndex.jsx`
- Modify: `components/CapabilitiesList.jsx`
- Modify: `components/ContactSection.jsx`
- Modify: `components/CaseStudyModal.jsx`

**Interfaces:**
- Consumes: Global CSS and data.
- Produces: Clean, declarative React components without `<style jsx>` bloat or char-splitting loops.

- [ ] **Step 1: Refactor `WorkIndex.jsx` to clean up row buttons and remove `<style jsx>`**
- [ ] **Step 2: Refactor `CapabilitiesList.jsx` to eliminate letter-by-letter string mapping loops while preserving typography**
- [ ] **Step 3: Refactor `ContactSection.jsx` to streamline clipboard logic and remove `<style jsx>`**
- [ ] **Step 4: Refactor `CaseStudyModal.jsx` to strip `<style jsx>` while keeping dialog keyboard/focus accessibility intact**
- [ ] **Step 5: Commit changes**

---

### Task 6: Optimize `ProjectArtwork.jsx` and Clean Repository

**Files:**
- Modify: `components/ProjectArtwork.jsx`
- Clean: `scratch/` files or move to ignored scratch location

- [ ] **Step 1: Deduplicate and compress SVG definitions and paths in `ProjectArtwork.jsx`**
- [ ] **Step 2: Clean up obsolete scratch files from repository root**
- [ ] **Step 3: Verify all components render cleanly, line counts across the project, and check functionality**
- [ ] **Step 4: Commit changes**
