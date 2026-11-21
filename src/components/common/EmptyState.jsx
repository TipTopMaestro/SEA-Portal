import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: _icon = Inbox,
  title = 'No records found',
  description = 'There are no active entries matching your current filters or criteria.',
  actionLabel,
  onAction,
}) => {
  const Icon = _icon;
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-300 rounded-2xl bg-white shadow-2xs">
      <div className="p-4 rounded-full bg-slate-50 border border-slate-200 mb-4 text-slate-400">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 font-display">
        {title}
      </h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider font-display shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
