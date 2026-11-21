import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue', // blue, cyan, purple, emerald, amber
  onClick,
}) => {
  const colorStyles = {
    blue: {
      border: 'border-slate-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    cyan: {
      border: 'border-slate-200 hover:border-blue-400',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    purple: {
      border: 'border-slate-200 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    emerald: {
      border: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    amber: {
      border: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  }[color] || {
    border: 'border-slate-200 hover:border-blue-300',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    badge: 'text-blue-600 bg-blue-50 border-blue-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${colorStyles.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 font-display">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-display">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
              {trend && (
                <span className={`px-1.5 py-0.2 rounded text-[11px] font-bold border ${colorStyles.badge}`}>
                  {trend}
                </span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border shadow-xs ${colorStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
