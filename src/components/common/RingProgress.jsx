import React from 'react';

const RingProgress = ({ percent = 0, label = 'Complete', caption }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return (
    <div className="glass rounded-3xl p-5 flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4f7bff" />
              <stop offset="1" stopColor="#5fd0ff" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke="url(#ring)" strokeWidth="9"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{percent}%</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        </div>
      </div>
      {caption && <span className="text-xs text-slate-500 mt-3">{caption}</span>}
    </div>
  );
};

export default RingProgress;