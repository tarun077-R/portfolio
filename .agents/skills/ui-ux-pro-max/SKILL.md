---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 80 searchable styles (51 active), 192 product palettes and reasoning profiles, 74 font pairings, 120 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks."
---

# UI/UX Pro Max Design Intelligence

A design intelligence framework and operational guide for creating, auditing, and refining world-class digital user interfaces. Use this skill to ground design decisions in established visual systems, proven cognitive psychology, and accessibility benchmarks.

---

## 1. Core Workflow: Design System First

Before writing raw interface code or adding visual elements:
1. **Identify the Product Domain & Archetype**:
   - Determine whether the product is Developer/Engineering, SaaS, Creative/Portfolio, Luxury/Editorial, Fintech, E-Commerce, or Consumer.
2. **Select Cohesive Visual Style & Aesthetic Grammar**:
   - Query or select an intentional style (e.g., Dark Editorial, Swiss Precision, Neo-Brutalism, Minimalist Glass, Bento Grid).
   - Never mix mutually exclusive aesthetic languages (e.g., playful cartoon pastel borders on dark luxury editorial).
3. **Establish Color Harmony & Contrast Tokens**:
   - Establish semantic background (`--bg-main`), text (`--text-main`), accent (`--accent`), and subtle boundary dividers (`--divider-dark`, `--divider-mid`).
   - Validate WCAG 2.2 AA contrast ratios: minimum 4.5:1 for normal body text, 3:1 for large display text and interactive UI borders.
4. **Define Typographic Hierarchy & Fluid Scale**:
   - Pair an expressive display typeface with a clean, neutral body typeface and a tabular utility font.
   - Use fluid `clamp()` formulas with container queries (`cqw`) or viewport units (`vw`) to prevent awkward line breaks on zoom.
5. **Implement Purposeful Motion & Micro-interactions**:
   - Motion must convey physical structure and directional momentum, never arbitrary distraction.
   - Easing: Default to restrained cubic-bezier curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.44, 0, 0.56, 1)`).
   - Provide `@media (prefers-reduced-motion: reduce)` fallbacks across all transitions.

---

## 2. Local Design Intelligence Search

Query the local design database using the bundled Python script:

```bash
# Search styles by keyword (e.g. "editorial", "dark", "bento", "minimal")
python .agents/skills/ui-ux-pro-max/scripts/search.py style editorial

# Search color palettes by domain (e.g. "portfolio", "saas", "fintech", "ecommerce")
python .agents/skills/ui-ux-pro-max/scripts/search.py palette portfolio

# Search typography pairings (e.g. "editorial", "modern", "technical")
python .agents/skills/ui-ux-pro-max/scripts/search.py typography editorial

# Search UX guidelines (e.g. "contrast", "touch", "modal", "keyboard")
python .agents/skills/ui-ux-pro-max/scripts/search.py guideline contrast
```

---

## 3. Visual Styles Directory

### Dark Editorial / Architectural Minimal (Active on Tarun Rawat Portfolio)
- **Visual Thesis**: High-contrast pure black canvas (`#000000`), striking silver monochrome photography with restrained warm burnt-orange accents (`#ff630f`), oversized display typography, fine hairline rules (`1px #222222`), and generous negative space.
- **Key Signifiers**:
  - Monogram and large display typography layered behind or anchored below photographic portraits.
  - Rectangles with sharp square corners; buttons and interactive pills with pill geometry (`border-radius: 999px`).
  - Fluid typography sizing with clamp bounds (`clamp(40px, 14.2cqw, 205px)`).
  - Subtle interactive WebGL ripples and custom cursor followers.
- **Forbidden Elements**:
  - Generic drop shadows, heavy colored gradients, repeated card grids, emoji bullets, bloated UI kits.

### Swiss Precision / International Typographic
- **Visual Thesis**: Asymmetric layouts, strict mathematical grid alignments, objective sans-serif typography, and utilitarian clarity.
- **Key Signifiers**: Strict column rules, bold indices (`01`, `02`), monochrome palette with one sharp signal color.

### Modern Bento Grid
- **Visual Thesis**: Modular asymmetric card clusters highlighting feature density, metrics, and interactive modules with rounded corners (`12px-24px`) and subtle borders.

---

## 4. Accessibility & Quality Checklist (WCAG 2.2 AA)

Before completing any UI task, verify:
- [ ] **Contrast**: Text elements meet 4.5:1 (normal) or 3:1 (large headings ≥ 24px).
- [ ] **Touch Targets**: All interactive elements (buttons, links, disclosures) measure at least `44px × 44px` on mobile/touch viewports.
- [ ] **Keyboard Navigation**: Full tab order traversal, visible focus outlines (`2px outline`, `outline-offset: 4px+`), and escape key handlers for modals/drawers.
- [ ] **Modal Inertness**: `dialog` elements lock body scroll (`document.body.classList.add('scroll-locked')`) and mark main content with `inert`.
- [ ] **Motion Safeguards**: Every keyframe and transition is respected by `@media (prefers-reduced-motion: reduce)`.
- [ ] **Screen Readers**: Decorative elements tagged with `aria-hidden="true"`, buttons labeled with descriptive text or `aria-label`, and live announcements use `aria-live="polite"`.
