'use client';

import React, { useId } from 'react';

function CardFrame({ idPrefix, title, kicker, nodeId, footerTitle, footerMeta, index, children }) {
  return (
    <>
      <defs>
        <linearGradient id={`${idPrefix}-card-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#141414" />
          <stop offset="60%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <pattern id={`${idPrefix}-card-dots`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#282828" />
        </pattern>
      </defs>

      <rect width="800" height="800" fill={`url(#${idPrefix}-card-bg)`} stroke="#2b2b2b" strokeWidth="1.5" />
      <rect x="24" y="24" width="752" height="752" fill={`url(#${idPrefix}-card-dots)`} opacity="0.6" />
      <rect x="40" y="40" width="720" height="720" stroke="#333333" strokeWidth="1" />
      <line x1="40" y1="110" x2="760" y2="110" stroke="#333333" strokeWidth="1" />
      <line x1="40" y1="690" x2="760" y2="690" stroke="#333333" strokeWidth="1" />

      {/* Header */}
      <text x="64" y="80" fill="#ff630f" fontSize="12" fontFamily="monospace" letterSpacing="0.2em">{kicker}</text>
      <text x="64" y="100" fill="#ffffff" fontSize="15" fontFamily="sans-serif" fontWeight="600" letterSpacing="-0.02em">{title}</text>
      <text x="736" y="80" fill="#777777" fontSize="11" fontFamily="monospace" textAnchor="end">{nodeId}</text>
      <circle cx="728" cy="95" r="4" fill="#ff630f" />

      {/* Visual content */}
      {children}

      {/* Footer */}
      <text x="64" y="725" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="600">{footerTitle}</text>
      <text x="64" y="747" fill="#888888" fontSize="11" fontFamily="monospace">{footerMeta}</text>
      <text x="736" y="736" fill="#ff630f" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="end">{index}</text>
    </>
  );
}

export default function ProjectArtwork({ variant = 'statement', className = '', ariaLabel = null }) {
  const idPrefix = useId();

  if (variant === 'statement') {
    return (
      <svg
        viewBox="0 0 600 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={ariaLabel || 'Engineering and design manifesto diagram'}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <linearGradient id={`${idPrefix}-stmt-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#141414" />
            <stop offset="60%" stopColor="#080808" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <pattern id={`${idPrefix}-stmt-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="30" y2="0" stroke="#222222" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="0" y2="30" stroke="#222222" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect width="600" height="720" rx="1" fill={`url(#${idPrefix}-stmt-bg)`} stroke="#2a2a2a" strokeWidth="1" />
        <rect x="24" y="24" width="552" height="672" fill={`url(#${idPrefix}-stmt-grid)`} opacity="0.6" />
        <rect x="36" y="36" width="528" height="648" fill="none" stroke="#333333" strokeWidth="1" />
        <line x1="36" y1="120" x2="564" y2="120" stroke="#333333" strokeWidth="1" />
        <line x1="36" y1="600" x2="564" y2="600" stroke="#333333" strokeWidth="1" />

        <text x="56" y="72" fill="#ff630f" fontSize="12" fontFamily="monospace" letterSpacing="0.2em">TR // ARCHITECTURE & MANIFESTO</text>
        <text x="56" y="96" fill="#ffffff" fontSize="16" fontFamily="sans-serif" fontWeight="600" letterSpacing="-0.02em">STRUCTURE &amp; EXPRESSION</text>
        <text x="544" y="72" fill="#777777" fontSize="11" fontFamily="monospace" textAnchor="end">SPEC 2026.1</text>
        <circle cx="536" cy="92" r="4" fill="#ff630f" />

        <g transform="translate(60, 150)">
          <circle cx="240" cy="210" r="180" stroke="#2c2c2c" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="240" cy="210" r="120" stroke="#ff630f" strokeWidth="1" opacity="0.8" />
          <circle cx="240" cy="210" r="60" stroke="#444444" strokeWidth="1" />

          <line x1="20" y1="210" x2="460" y2="210" stroke="#383838" strokeWidth="1" />
          <line x1="240" y1="0" x2="240" y2="420" stroke="#383838" strokeWidth="1" />
          <line x1="60" y1="390" x2="420" y2="30" stroke="#ff630f" strokeWidth="1" opacity="0.4" />

          <path d="M 40 40 L 40 80 M 40 40 L 80 40" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 440 40 L 440 80 M 440 40 L 400 40" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 40 380 L 40 340 M 40 380 L 80 380" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 440 380 L 440 340 M 440 380 L 400 380" stroke="#ffffff" strokeWidth="1.5" />

          <polygon points="140,160 240,100 340,160 240,220" fill="#181818" stroke="#555555" strokeWidth="1.2" opacity="0.9" />
          <polygon points="140,220 240,160 340,220 240,280" fill="#202020" stroke="#ff630f" strokeWidth="1.5" opacity="0.95" />
          <polygon points="140,280 240,220 340,280 240,340" fill="#121212" stroke="#444444" strokeWidth="1.2" opacity="0.9" />

          <circle cx="240" cy="210" r="6" fill="#ff630f" />
          <circle cx="240" cy="210" r="14" stroke="#ff630f" strokeWidth="1" opacity="0.6" />

          <text x="148" y="148" fill="#aaaaaa" fontSize="10" fontFamily="monospace">AXIS::ALPHA</text>
          <text x="332" y="148" fill="#ff630f" fontSize="10" fontFamily="monospace">FLOW::STABLE</text>
          <text x="240" y="360" fill="#888888" fontSize="10" fontFamily="monospace" textAnchor="middle">CORE::0.998 LATENCY</text>
        </g>

        <text x="56" y="632" fill="#ffffff" fontSize="13" fontFamily="sans-serif" fontWeight="500">CLEAR ARCHITECTURE // RIGOROUS VISUAL SYSTEMS</text>
        <text x="56" y="654" fill="#888888" fontSize="11" fontFamily="monospace">DETERMINISTIC DATA • RESILIENT FLOW • ZERO COMPROMISE</text>
        <text x="544" y="644" fill="#ff630f" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="end">[ 01 ]</text>
      </svg>
    );
  }

  const commonSvgProps = {
    viewBox: '0 0 800 800',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    role: 'img',
    style: { width: '100%', height: 'auto', display: 'block' }
  };

  if (variant === 'elibrary') {
    return (
      <svg {...commonSvgProps} aria-label={ariaLabel || 'Student E-Library platform vector diagram'}>
        <CardFrame
          idPrefix={idPrefix}
          title="STUDENT E-LIBRARY"
          kicker="CATALOG ARCHITECTURE // BUILD 2026"
          nodeId="NODE ID: ELIB-01"
          footerTitle="STUDENT E-LIBRARY // ACADEMIC RESOURCE PLATFORM"
          footerMeta="LIVE AT: STUDENT-E-LIBRARY.NETLIFY.APP • NETLIFY CI/CD • ACCESSIBLE ARCHITECTURE"
          index="01"
        >
          <g transform="translate(100, 150)">
            <ellipse cx="300" cy="270" rx="260" ry="120" stroke="#2c2c2c" strokeWidth="1.2" strokeDasharray="4 4" />
            <ellipse cx="300" cy="270" rx="180" ry="80" stroke="#ff630f" strokeWidth="1" opacity="0.5" />

            <rect x="120" y="30" width="360" height="42" rx="6" fill="#181818" stroke="#444444" strokeWidth="1" />
            <circle cx="145" cy="51" r="7" stroke="#ff630f" strokeWidth="1.5" fill="none" />
            <line x1="150" y1="56" x2="157" y2="63" stroke="#ff630f" strokeWidth="1.5" strokeLinecap="round" />
            <text x="170" y="56" fill="#888888" fontSize="13" fontFamily="sans-serif">Search engineering books, syllabus, papers...</text>

            <g transform="translate(120, 90)">
              <rect x="0" y="0" width="85" height="24" rx="12" fill="#ff630f" />
              <text x="42" y="16" fill="#000000" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">COMPUTER SCI</text>
              <rect x="95" y="0" width="75" height="24" rx="12" fill="#202020" stroke="#444444" strokeWidth="1" />
              <text x="132" y="16" fill="#bbbbbb" fontSize="10" fontFamily="sans-serif" textAnchor="middle">MATHEMATICS</text>
              <rect x="180" y="0" width="75" height="24" rx="12" fill="#202020" stroke="#444444" strokeWidth="1" />
              <text x="217" y="16" fill="#bbbbbb" fontSize="10" fontFamily="sans-serif" textAnchor="middle">ELECTRICAL</text>
              <rect x="265" y="0" width="60" height="24" rx="12" fill="#202020" stroke="#444444" strokeWidth="1" />
              <text x="295" y="16" fill="#bbbbbb" fontSize="10" fontFamily="sans-serif" textAnchor="middle">PHYSICS</text>
            </g>

            <g transform="translate(190, 160)">
              <polygon points="0,50 110,0 220,50 110,100" fill="#1b1b1b" stroke="#444444" strokeWidth="1" />
              <polygon points="0,50 110,100 110,130 0,80" fill="#141414" stroke="#444444" strokeWidth="1" />
              <polygon points="110,100 220,50 220,80 110,130" fill="#222222" stroke="#444444" strokeWidth="1" />
            </g>

            <g transform="translate(170, 200)">
              <polygon points="0,50 130,0 260,50 130,100" fill="#252525" stroke="#ff630f" strokeWidth="1.5" />
              <polygon points="0,50 130,100 130,135 0,85" fill="#ea4f16" stroke="#ff630f" strokeWidth="1" opacity="0.9" />
              <polygon points="130,100 260,50 260,85 130,135" fill="#ff630f" stroke="#ff630f" strokeWidth="1" opacity="0.8" />
              <line x1="30" y1="62" x2="110" y2="98" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            </g>

            <g transform="translate(150, 250)">
              <polygon points="0,50 150,0 300,50 150,100" fill="#191919" stroke="#ffffff" strokeWidth="1.8" />
              <polygon points="0,50 150,100 150,120 0,70" fill="#101010" stroke="#666666" strokeWidth="1" />
              <polygon points="150,100 300,50 300,70 150,120" fill="#151515" stroke="#666666" strokeWidth="1" />
              <line x1="70" y1="45" x2="140" y2="25" stroke="#ff630f" strokeWidth="2" />
              <line x1="70" y1="55" x2="135" y2="35" stroke="#aaaaaa" strokeWidth="1.5" />
              <line x1="70" y1="65" x2="130" y2="45" stroke="#aaaaaa" strokeWidth="1.5" />
              <line x1="165" y1="25" x2="235" y2="45" stroke="#ffffff" strokeWidth="2" />
              <line x1="165" y1="35" x2="230" y2="55" stroke="#aaaaaa" strokeWidth="1.5" />
              <line x1="165" y1="45" x2="225" y2="65" stroke="#aaaaaa" strokeWidth="1.5" />
            </g>

            <g transform="translate(420, 160)">
              <circle cx="20" cy="20" r="16" fill="#191919" stroke="#ff630f" strokeWidth="1.5" />
              <text x="20" y="24" fill="#ff630f" fontSize="10" fontFamily="monospace" textAnchor="middle">PDF</text>
            </g>

            <g transform="translate(80, 220)">
              <circle cx="20" cy="20" r="16" fill="#191919" stroke="#ffffff" strokeWidth="1" />
              <text x="20" y="24" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">SYNC</text>
            </g>
          </g>

          <g transform="translate(400, 400)">
            <circle cx="0" cy="0" r="26" fill="#ff630f" />
            <path d="M-6 -6 L6 6 M6 -6 L6 6 L-6 6" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </CardFrame>
      </svg>
    );
  }

  if (variant === 'trendkart') {
    return (
      <svg {...commonSvgProps} aria-label={ariaLabel || 'TrendKart e-commerce system vector diagram'}>
        <CardFrame
          idPrefix={idPrefix}
          title="TRENDKART"
          kicker="COMMERCE ENGINE // ADMIN ARCHITECTURE"
          nodeId="NODE ID: TK-02"
          footerTitle="TRENDKART // E-COMMERCE ADMINISTRATIVE SYSTEM"
          footerMeta="NEXT.js • NEXTAUTH V5 • CLOUDINARY • RAZORPAY • DISPATCH TRACKING"
          index="02"
        >
          <g transform="translate(100, 150)">
            <g stroke="#3a3a3a" strokeWidth="1.2">
              <line x1="300" y1="40" x2="520" y2="150" />
              <line x1="300" y1="40" x2="80" y2="150" />
              <line x1="80" y1="150" x2="300" y2="260" />
              <line x1="520" y1="150" x2="300" y2="260" />
              <line x1="80" y1="150" x2="80" y2="340" />
              <line x1="520" y1="150" x2="520" y2="340" />
              <line x1="300" y1="260" x2="300" y2="450" />
              <line x1="80" y1="340" x2="300" y2="450" />
              <line x1="520" y1="340" x2="300" y2="450" />
            </g>

            <polygon points="190,145 300,90 410,145 300,200" fill="#1b1b1b" stroke="#ff630f" strokeWidth="1.5" />
            <polygon points="190,215 300,160 410,215 300,270" fill="#202020" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="250" cy="210" r="5" fill="#ff630f" />
            <circle cx="300" cy="215" r="5" fill="#ffffff" />
            <circle cx="350" cy="220" r="5" fill="#555555" />
            <polygon points="190,285 300,230 410,285 300,340" fill="#161616" stroke="#555555" strokeWidth="1" />

            <g transform="translate(60, 380)">
              <rect x="0" y="0" width="105" height="30" rx="4" fill="#1c1c1c" stroke="#444444" strokeWidth="1" />
              <text x="52" y="19" fill="#aaaaaa" fontSize="9" fontFamily="monospace" textAnchor="middle">01_CHECKOUT</text>
              <line x1="105" y1="15" x2="125" y2="15" stroke="#ff630f" strokeWidth="1.5" />
              <rect x="125" y="0" width="105" height="30" rx="4" fill="#1c1c1c" stroke="#ff630f" strokeWidth="1.5" />
              <text x="177" y="19" fill="#ff630f" fontSize="9" fontFamily="monospace" textAnchor="middle">02_RAZORPAY</text>
              <line x1="230" y1="15" x2="250" y2="15" stroke="#ff630f" strokeWidth="1.5" />
              <rect x="250" y="0" width="105" height="30" rx="4" fill="#1c1c1c" stroke="#444444" strokeWidth="1" />
              <text x="302" y="19" fill="#aaaaaa" fontSize="9" fontFamily="monospace" textAnchor="middle">03_COURIER</text>
              <line x1="355" y1="15" x2="375" y2="15" stroke="#444444" strokeWidth="1.5" />
              <rect x="375" y="0" width="105" height="30" rx="4" fill="#1c1c1c" stroke="#444444" strokeWidth="1" />
              <text x="427" y="19" fill="#aaaaaa" fontSize="9" fontFamily="monospace" textAnchor="middle">04_DELIVERED</text>
            </g>

            <g transform="translate(430, 80)">
              <rect x="0" y="0" width="90" height="42" rx="4" fill="#111111" stroke="#ff630f" strokeWidth="1" />
              <text x="45" y="18" fill="#ff630f" fontSize="10" fontFamily="monospace" textAnchor="middle">SKU MATRIX</text>
              <text x="45" y="34" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">N × M VARS</text>
            </g>

            <g transform="translate(60, 80)">
              <rect x="0" y="0" width="90" height="42" rx="4" fill="#111111" stroke="#444444" strokeWidth="1" />
              <text x="45" y="18" fill="#777777" fontSize="10" fontFamily="monospace" textAnchor="middle">AUTH OTP</text>
              <text x="45" y="34" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">FIREBASE</text>
            </g>
          </g>
        </CardFrame>
      </svg>
    );
  }

  if (variant === 'focusvault') {
    return (
      <svg {...commonSvgProps} aria-label={ariaLabel || 'FocusVault personal finance PWA vector diagram'}>
        <CardFrame
          idPrefix={idPrefix}
          title="FOCUSVAULT"
          kicker="FINANCIAL DISCIPLINE // PWA ENGINE"
          nodeId="NODE ID: FV-03"
          footerTitle="FOCUSVAULT // PROGRESSIVE WEB APPLICATION (PWA)"
          footerMeta="PRISMA ORM • SQLITE • DAILY BUDGET ENGINE • MINDFUL FRICTION INTERFACE"
          index="03"
        >
          <g transform="translate(400, 390)">
            <circle cx="0" cy="0" r="230" stroke="#252525" strokeWidth="1" />
            <circle cx="0" cy="0" r="215" stroke="#333333" strokeWidth="1.2" strokeDasharray="3 8" />

            <path d="M -160 0 A 160 160 0 0 1 113 -113" stroke="#ff630f" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 113 -113 A 160 160 0 0 1 0 160" stroke="#ffffff" strokeWidth="8" strokeDasharray="6 10" fill="none" />
            <path d="M 0 160 A 160 160 0 0 1 -160 0" stroke="#282828" strokeWidth="8" strokeLinecap="round" fill="none" />

            <circle cx="0" cy="0" r="110" fill="#121212" stroke="#444444" strokeWidth="2" />
            <circle cx="0" cy="0" r="85" fill="#181818" stroke="#ff630f" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="45" fill="#0c0c0c" stroke="#555555" strokeWidth="1" />

            <line x1="0" y1="-85" x2="0" y2="-65" stroke="#ff630f" strokeWidth="3" />
            <line x1="85" y1="0" x2="65" y2="0" stroke="#ff630f" strokeWidth="3" />
            <line x1="0" y1="85" x2="0" y2="65" stroke="#ff630f" strokeWidth="3" />
            <line x1="-85" y1="0" x2="-65" y2="0" stroke="#ff630f" strokeWidth="3" />

            <text x="0" y="-8" fill="#ffffff" fontSize="22" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">₹840</text>
            <text x="0" y="14" fill="#ff630f" fontSize="10" fontFamily="monospace" textAnchor="middle">REMAINING TODAY</text>

            <g transform="translate(-190, -170)">
              <rect x="0" y="0" width="105" height="36" rx="4" fill="#141414" stroke="#ff630f" strokeWidth="1" />
              <text x="52" y="16" fill="#ff630f" fontSize="9" fontFamily="monospace" textAnchor="middle">GATEKEEPER</text>
              <text x="52" y="28" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle">FRICTION CHECK</text>
            </g>

            <g transform="translate(95, -170)">
              <rect x="0" y="0" width="105" height="36" rx="4" fill="#141414" stroke="#444444" strokeWidth="1" />
              <text x="52" y="16" fill="#888888" fontSize="9" fontFamily="monospace" textAnchor="middle">PERSISTENCE</text>
              <text x="52" y="28" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle">PRISMA + SQLITE</text>
            </g>

            <g transform="translate(-52, 175)">
              <rect x="0" y="0" width="105" height="28" rx="14" fill="#ff630f" />
              <text x="52" y="18" fill="#000000" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">OFFLINE READY</text>
            </g>
          </g>
        </CardFrame>
      </svg>
    );
  }

  return null;
}
