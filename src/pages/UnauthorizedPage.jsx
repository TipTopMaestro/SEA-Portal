import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home, Key } from 'lucide-react';

const UnauthorizedPage = () => {
  const { role, switchRole, ROLES } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 mb-6 shadow-md">
        <ShieldAlert className="w-16 h-16 animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-2 mb-2">
        <span className="text-xs uppercase font-mono tracking-widest text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 font-bold">
          HTTP 403 • RESTRICTED CLEARANCE
        </span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-2 mb-3">
        Role-Based Access Restricted
      </h1>

      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        Your current role clearance{' '}
        <span className="font-bold text-slate-900">
          ({role?.toUpperCase() || 'UNKNOWN'})
        </span>{' '}
        does not have the executive permissions required to access this administrative module.
      </p>

      {/* Role switcher hint */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 max-w-md w-full text-left shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 font-display uppercase tracking-wider">
          <Key className="w-4 h-4 text-blue-600" />
          <span>Elevate Clearance (Testing / Demo):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => switchRole(ROLES.EXECUTIVE)}
            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-700 font-display transition-all cursor-pointer"
          >
            Switch to Executive Officer
          </button>
          <button
            onClick={() => switchRole(ROLES.GAME_MANAGER)}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 font-display transition-all cursor-pointer"
          >
            Switch to Game Manager
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold font-display uppercase tracking-wider transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold font-display uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
