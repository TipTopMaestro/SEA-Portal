import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Flame, Shield, Gamepad2, Coins, User, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, switchRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email, IGN, or Student ID is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = login(identifier, password);
      showToast(`Welcome back, ${user.name} (${user.ign})!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ global: err.message });
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Demo Fast Login
  const handleQuickLogin = (role) => {
    switchRole(role);
    showToast(`Logged in under demo clearance: ${role.toUpperCase()}`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Flame className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 font-display tracking-wider">
          NEXUS<span className="text-blue-600">SEA</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-mono font-medium">
          DNSC STUDENT ESPORTS ACADEMY PORTAL
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl relative">
          <h3 className="text-xl font-bold text-slate-900 font-display mb-1 text-center">
            Officer & Member Sign In
          </h3>
          <p className="text-xs text-slate-500 text-center mb-6">
            Enter your credentials to access rosters, tryouts, and finance.
          </p>

          {errors.global && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errors.global}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                Student ID / Email / IGN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors({ ...errors, identifier: null });
                  }}
                  placeholder="e.g. 2024-02341 or Phoenix"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                    errors.identifier
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.identifier}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Fast RBAC Evaluation */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-display mb-2 text-center">
              Quick Demo Access by Role
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('executive')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs transition-colors cursor-pointer text-left"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate font-semibold font-display">Executive</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('game_manager')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs transition-colors cursor-pointer text-left"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate font-semibold font-display">Game Mgr</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('finance_officer')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs transition-colors cursor-pointer text-left"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate font-semibold font-display">Finance</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('member')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs transition-colors cursor-pointer text-left"
              >
                <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="truncate font-semibold font-display">Member</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Not a member yet?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4"
              >
                Register Student Profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
