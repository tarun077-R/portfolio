'use client';

import React from 'react';

export default function Skeleton({ className = '', style = {}, ariaLabel = 'Loading content' }) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`skeleton-shimmer bg-[#121212] rounded-[2px] relative overflow-hidden ${className}`}
      style={style}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

export function SkeletonCard({ className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer bg-[#121212] border border-[#222222] rounded-[4px] p-6 flex flex-col gap-4 relative overflow-hidden ${className}`}
      style={style}
      role="status"
      aria-label="Loading project card"
    >
      <div className="w-16 h-4 bg-[#1a1a1a] rounded" />
      <div className="w-3/4 h-8 bg-[#1a1a1a] rounded mt-2" />
      <div className="w-full h-40 bg-[#161616] rounded mt-4" />
      <div className="flex gap-2 mt-4">
        <div className="w-20 h-6 bg-[#1a1a1a] rounded-full" />
        <div className="w-24 h-6 bg-[#1a1a1a] rounded-full" />
      </div>
      <span className="sr-only">Loading card content</span>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`} role="status" aria-label="Loading text content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer bg-[#161616] h-4 rounded-[2px]"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
      <span className="sr-only">Loading text</span>
    </div>
  );
}

export function SkeletonArtwork({ className = '', aspectRatio = '1/1' }) {
  return (
    <div
      className={`skeleton-shimmer bg-[#0e0e0e] border border-[#262626] rounded-[4px] relative overflow-hidden w-full ${className}`}
      style={{ aspectRatio }}
      role="status"
      aria-label="Loading artwork diagram"
    >
      <div className="absolute inset-4 border border-[#1f1f1f] border-dashed rounded-[2px] opacity-40" />
      <div className="absolute top-6 left-6 w-24 h-3 bg-[#1c1c1c] rounded" />
      <div className="absolute bottom-6 right-6 w-12 h-3 bg-[#ff630f] opacity-30 rounded" />
      <span className="sr-only">Loading vector diagram</span>
    </div>
  );
}
