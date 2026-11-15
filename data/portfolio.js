export const PERSONA = {
  firstName: 'Tarun',
  lastName: 'Rawat',
  monogram: 'JR',
  role: 'Full-Stack Web Developer & Digital Designer',
  practice: 'Custom web applications, digital platforms, interactive interfaces.',
  email: 'tarunrawat8350@gmail.com',
  location: null,
  socialLinks: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tarun007-r' },
    { label: 'GitHub', url: 'https://github.com/tarun077-R' }
  ]
};

export const ASSETS = {
  hero: '/images/hero-portrait.webp',
  statement: null,
  elibrary: null,
  trendkart: null,
  focusvault: null
};

export const PROJECTS = [
  {
    id: '01',
    slug: 'student-e-library',
    title: 'Student E-Library',
    year: '2026',
    discipline: 'Full-Stack & UI',
    role: 'Full-stack architecture, UI design, deployment.',
    summary: 'A web-based digital library platform designed to organize academic resources, study materials, and subject references in an accessible interface.',
    challenge: 'Make multi-subject study materials fast to browse, filter, and read across both desktop and mobile devices without visual clutter.',
    approach: 'A structured catalog layout pairs clear subject categorization, responsive search and filtering, and clean reading views so students can locate resources in seconds.',
    deliverables: ['Responsive web application', 'Resource catalog architecture', 'Search & subject filtering', 'Netlify production deployment'],
    coverKey: 'elibrary',
    projectType: 'Live web application',
    liveUrl: 'https://student-e-library.netlify.app/',
    featuredLines: ['STUDENT', 'E-LIBRARY'],
    caption: 'Academic Resource Platform'
  },
  {
    id: '02',
    slug: 'trendkart',
    title: 'TrendKart',
    year: '2026',
    discipline: 'E-Commerce System',
    role: 'Full-stack engineering, admin portal architecture, API integrations.',
    summary: 'A custom e-commerce administrative portal and storefront system featuring dynamic product variant matrices, authentication flows, and payment/logistics operations.',
    challenge: 'Unify complex SKU variant management, tax calculations, payment refunds, and courier tracking inside a fast, intuitive admin workflow.',
    approach: 'Built with Next.js, NextAuth v5, and Firebase Phone OTP alongside a dynamic variant matrix builder, Cloudinary media pipelines, Razorpay controls, and courier status tracking.',
    deliverables: ['Admin dashboard', 'Dynamic variant matrix builder', 'Auth & payment integrations', 'Order & courier tracking system'],
    coverKey: 'trendkart',
    projectType: 'Full-stack platform',
    liveUrl: null
  },
  {
    id: '03',
    slug: 'focusvault',
    title: 'FocusVault',
    year: '2026',
    discipline: 'Web App / PWA',
    role: 'Full-stack development, database modeling, interface design.',
    summary: 'A Progressive Web Application built for personal expense tracking, daily allowance budgeting, and disciplined spending checks.',
    challenge: 'Encourage mindful daily spending habits through immediate feedback and friction-aware budget controls without slowing down routine logging.',
    approach: 'Constructed on Next.js with Prisma ORM and SQLite, combining daily allowance tracking, structured expense categorization, and an interactive gatekeeper quiz flow.',
    deliverables: ['Progressive Web App (PWA)', 'Prisma & SQLite schema', 'Daily allowance engine', 'Interactive gatekeeper module'],
    coverKey: 'focusvault',
    projectType: 'Full-stack PWA',
    liveUrl: null
  }
];

export const SERVICES = [
  {
    id: '01',
    title: 'Full-Stack Development',
    scope: 'Web applications / API integrations / Database architecture',
    text: 'End-to-end web applications engineered for reliability, clean data modeling, secure authentication, and seamless third-party service integrations.',
    deliverables: 'Next.js & React applications, REST APIs, database schemas, production deployments.'
  },
  {
    id: '02',
    title: 'Frontend Architecture',
    scope: 'Responsive systems / Interactive UI / Performance optimization',
    text: 'Maintainable, accessible frontend codebases built with fluid typography, purposeful motion, and consistent state management across viewports.',
    deliverables: 'Component architecture, Progressive Web Apps (PWAs), responsive layouts, animation systems.'
  },
  {
    id: '03',
    title: 'UI / Digital Design',
    scope: 'Interface direction / Design systems / Prototyping',
    text: 'Editorial-grade digital interfaces that balance strong typographic hierarchy with intuitive user flows from initial concept to live code.',
    deliverables: 'Design systems, interactive prototypes, dashboard & storefront UI, visual guidelines.'
  }
];

