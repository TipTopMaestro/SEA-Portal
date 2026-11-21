import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 mb-6 shadow-md">
        <Compass className="w-16 h-16 animate-spin duration-1000" />
      </div>
      <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-semibold">
        404 • MAP COORDINATE NOT FOUND
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2 mb-3">
        Out of Bounds
      </h1>
      <p className="text-slate-500 text-sm max-w-sm mb-6">
        The tactical route you are trying to reach does not exist or has been relocated by Academy command.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold uppercase tracking-wider font-display shadow-md shadow-blue-500/25"
      >
        <Home className="w-4 h-4" />
        <span>Return to Safe Zone</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
