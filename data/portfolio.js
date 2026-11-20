export const PERSONA = {
  firstName: 'Tarun',
  lastName: 'Rawat',
  monogram: 'TR',
  role: 'Full-Stack Web Developer & Digital Designer',
  practice: 'Custom web applications, digital platforms, interactive interfaces.',
  email: 'tarunrawat8350@gmail.com',
  location: null,
  resume: '/resume/Mern_developer.pdf',
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

export const EXPERIENCE = [
  {
    id: 'exp-01',
    company: 'Technogetic',
    role: 'Software Developer Intern',
    period: 'September 2026 – Present',
    badge: 'Active Role',
    summary: 'Engineering core administrative architectures, multi-tenant workflows, and real-time audio/video communication systems for production web platforms.',
    projects: [
      {
        id: 'proj-hms',
        title: 'Multi-Tenant Hospital Management System (HMS)',
        category: 'Enterprise Healthcare Platform',
        contributions: [
          'Implemented administrative capabilities allowing secure management and updating of staff email addresses and roles.',
          'Built administrative controls and logic for medical tests management.',
          'Conducted rigorous manual testing, bug fixing, and QA across core modules to ensure system stability.'
        ],
        techStack: ['Next.js', 'Role-Based Access Control', 'Multi-Tenancy', 'QA & Testing', 'Admin Systems']
      },
      {
        id: 'proj-astro',
        title: 'Astro Ansh Pandit',
        category: 'Real-Time Consultation Platform',
        url: 'https://astroanshpundit.co.in',
        contributions: [
          'Integrated a real-time audio/video call system between users and pandits using Agora SDK.',
          'Developed responsive notification systems, UI fixes, and layout refinements.',
          'Performed active debugging, component optimization, and state management enhancements.'
        ],
        techStack: ['Agora SDK', 'WebRTC', 'Real-Time Audio/Video', 'React.js', 'State Optimization', 'Notifications']
      }
    ]
  }
];

export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    iconType: 'layout',
    description: 'High-performance user interfaces, modern component systems, and responsive architectures.',
    groups: [
      {
        name: 'Languages & Core',
        skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'SCSS/CSS3']
      },
      {
        name: 'Frameworks & Libraries',
        skills: ['Next.js (App Router, SSR, Server/Client)', 'React.js', 'Redux Toolkit']
      },
      {
        name: 'Styling & Systems',
        skills: ['Tailwind CSS', 'shadcn/ui', 'CSS Modules', 'Design Systems']
      }
    ]
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    iconType: 'server',
    description: 'Scalable service architectures, real-time media streams, and robust security protocols.',
    groups: [
      {
        name: 'Runtimes & Frameworks',
        skills: ['Node.js', 'Express.js']
      },
      {
        name: 'Architecture & Real-Time',
        skills: ['RESTful APIs', 'Agora SDK (Real-Time Audio/Video)', 'JWT & OTP Authentication']
      }
    ]
  },
  {
    id: 'database',
    title: 'Databases & Storage',
    iconType: 'database',
    description: 'Data persistence, schema design, document models, and cloud media asset pipelines.',
    groups: [
      {
        name: 'Databases & ORM',
        skills: ['MongoDB', 'MongoDB Atlas', 'Mongoose ODM', 'Basic SQL']
      },
      {
        name: 'Cloud Services',
        skills: ['Cloudinary (Asset Management)']
      }
    ]
  },
  {
    id: 'sdlc',
    title: 'Engineering Process & Tools',
    iconType: 'workflow',
    description: 'Rigorous engineering methodologies, automated deployment pipelines, and observability.',
    groups: [
      {
        name: 'Workflow & Methodologies',
        skills: ['Software Development Life Cycle (SDLC)', 'Agile / Scrum', 'Requirement Analysis', 'Manual Testing', 'Debugging & QA']
      },
      {
        name: 'Tools & Infrastructure',
        skills: ['Git & GitHub', 'VS Code', 'WSL (Ubuntu)', 'Postman', 'Vercel', 'Netlify', 'Render', 'UptimeRobot']
      }
    ]
  }
];

