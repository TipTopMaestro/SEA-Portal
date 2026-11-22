import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import dnscLogo from '../../assets/dnscLogo.png';
import { ArrowRight, UserPlus } from 'lucide-react';
import { INITIAL_GAMES } from '../../services/mockData';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    ign: '',
    discord: '',
    program: 'BS Information Technology',
    yearLevel: '1st Year',
    primaryGame: 'Valorant',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.studentId.trim()) {
      errs.studentId = 'Student ID is required (e.g. 2024-00123)';
    } else if (!/^\d{4}-\d{4,5}$/.test(formData.studentId.trim())) {
      errs.studentId = 'Format must be YYYY-XXXXX (e.g. 2024-01234)';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.ign.trim()) errs.ign = 'In-Game Name (IGN) is required';
    if (!formData.discord.trim()) errs.discord = 'Discord handle is required (e.g. User#0000)';

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the DNSC Student Esports Academy Charter';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const newUser = register(formData);
      showToast(`Welcome to NexusSEA, ${newUser.ign}! Your student profile has been created.`, 'success');
      navigate('/membership');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center z-10 mb-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-md shadow-blue-500/10 flex items-center justify-center">
          <img src={dnscLogo} alt="DNSC Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-wider">
          JOIN THE ACADEMY ROSTER
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-mono font-medium">
          DNSC STUDENT ESPORTS ACADEMY (NEXUSSEA)
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Student Membership Registration
              </h3>
              <p className="text-xs text-slate-500">
                Register to participate in tryouts, scrimmages, and track your membership card.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Carlo Doe"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.name
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  DNSC Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="2024-02341"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.studentId
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.studentId && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.studentId}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  College / Institutional Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@dnsc.edu.ph"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>}
              </div>

              {/* In-Game Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  In-Game Name (IGN) *
                </label>
                <input
                  type="text"
                  name="ign"
                  value={formData.ign}
                  onChange={handleChange}
                  placeholder="e.g. Phoenix or Shadow99"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.ign
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.ign && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.ign}</p>}
              </div>

              {/* Discord Tag */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Discord Handle *
                </label>
                <input
                  type="text"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  placeholder="e.g. Phoenix#1234 or phoenix_sea"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.discord
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.discord && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.discord}</p>}
              </div>

              {/* Primary Game */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Primary Title / Focus
                </label>
                <select
                  name="primaryGame"
                  value={formData.primaryGame}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {INITIAL_GAMES.map((game) => (
                    <option key={game.id} value={game.name}>
                      {game.name} ({game.genre})
                    </option>
                  ))}
                </select>
              </div>

              {/* Program */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Degree Program
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="BS Information Technology">BS Information Technology (BSIT)</option>
                  <option value="BS Information Systems">BS Information Systems (BSIS)</option>
                  <option value="BS Computer Science">BS Computer Science (BSCS)</option>
                  <option value="BS Marine Biology">BS Marine Biology</option>
                  <option value="BS Business Administration">BS Business Administration</option>
                  <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                </select>
              </div>

              {/* Year Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Year Level
                </label>
                <select
                  name="yearLevel"
                  value={formData.yearLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type password"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500/30"
                />
                <span className="text-xs text-slate-600">
                  I agree to abide by the DNSC Student Esports Academy Honor Code, participate in regular varsity tryouts in good faith, and settle the standard organization dues.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.agreeTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{submitting ? 'Creating Profile...' : 'Complete Academy Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Already have an academy account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
