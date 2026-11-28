import React from 'react';

const StatStrip = ({ stats = [] }) => (
  <div className="glass rounded-3xl p-5 grid grid-cols-2 lg:grid-cols-4 stat-strip gap-y-5">
    {stats.map(({ label, value, unit, icon: Icon }) => (
      <div key={label} className="flex flex-col items-center text-center px-4">
        {Icon && <Icon className="w-5 h-5 text-blue-700 mb-2" />}
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-3xl font-bold text-white mt-1 tabular-nums">{value}</span>
        {unit && <span className="text-[11px] text-slate-500">{unit}</span>}
      </div>
    ))}
  </div>
);

export default StatStrip;