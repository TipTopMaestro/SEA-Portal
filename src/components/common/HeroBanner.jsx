import React from 'react';

const HeroBanner = ({ eyebrow, title, highlight, subtitle, chips = [], children, image }) => (
  <div className="glass-hero rounded-3xl overflow-hidden p-8 sm:p-10 min-h-[230px] flex items-center">
    {/* Wave visual (pure SVG, no image needed) */}
    <svg
      className="absolute right-0 bottom-0 w-[65%] max-w-[560px] opacity-90 pointer-events-none"
      viewBox="0 0 600 260" fill="none" aria-hidden="true"
    >
      <defs>
        <linearGradient id="wv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6aa2ff" stopOpacity=".15" />
          <stop offset=".5" stopColor="#5fd0ff" stopOpacity=".55" />
          <stop offset="1" stopColor="#a590ff" stopOpacity=".45" />
        </linearGradient>
      </defs>
      <path d="M0 200 C90 120 160 250 260 170 S430 60 600 130 V260 H0Z" fill="url(#wv)" />
      <path d="M0 225 C100 160 190 260 290 195 S450 110 600 170 V260 H0Z" fill="url(#wv)" opacity=".6" />
    </svg>

    {image && (
      <img
        src={image}
        alt=""
        className="absolute right-6 bottom-0 h-[110%] object-contain pointer-events-none hidden md:block"
      />
    )}

    <div className="relative z-10 max-w-xl space-y-3">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-mono uppercase tracking-wider text-blue-800 border border-white/20 bg-white/5">
          {eyebrow}
        </span>
      )}
      <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.05] text-white">
        {title} {highlight && <span className="iri-text">{highlight}</span>}
      </h1>
      {subtitle && <p className="text-sm text-slate-600 max-w-md">{subtitle}</p>}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {chips.map((c) => (
            <span key={c} className="px-3 py-1 rounded-full text-[11px] font-medium text-slate-700 border border-white/15 bg-white/5">
              {c}
            </span>
          ))}
        </div>
      )}
      {children && <div className="flex flex-wrap items-center gap-3 pt-2">{children}</div>}
    </div>
  </div>
);

export default HeroBanner;