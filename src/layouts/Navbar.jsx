import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';
import dnscLogo from '../assets/dnscLogo.png';
import {
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';

const Navbar = ({ toggleMobileSidebar, isMobileOpen }) => {
  const { user, role, switchRole, logout, ROLES } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleOptions = [
    { role: ROLES.EXECUTIVE, label: 'Executive Officer', desc: 'Full HR, sign-offs, org audits' },
    { role: ROLES.GAME_MANAGER, label: 'Game Manager', desc: 'Tryout scoring, scrimmage QR' },
    { role: ROLES.FINANCE_OFFICER, label: 'Finance Officer', desc: 'Inflow records, disbursements' },
    { role: ROLES.MEMBER, label: 'Academy Member', desc: 'Student ID, scan QR, apply' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 shadow-xs group-hover:border-blue-300 group-hover:shadow-blue-500/10 transition-all flex items-center justify-center overflow-hidden">
            <img src={dnscLogo} alt="DNSC Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 font-display tracking-wider">
                NEXUS<span className="text-blue-600">SEA</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                DNSC ESPORTS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-tight hidden md:block">
              DNSC Student Esports Academy Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Quick Role Switcher + User Info + Logout */}
      <div className="flex items-center gap-3">
        {/* Fast Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs cursor-pointer"
            title="Switch RBAC Role to test different permissions"
          >
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-slate-500 font-medium text-[11px]">Clearance:</span>
              <RoleBadge role={role} size="xs" showIcon={false} />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-display">
                    Switch Active RBAC Role
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Test how views, restrictions, and action controls adapt dynamically.
                  </p>
                </div>
                <div className="py-1 space-y-1">
                  {roleOptions.map((opt) => {
                    const isCurrent = opt.role === role;
                    return (
                      <button
                        key={opt.role}
                        onClick={() => {
                          switchRole(opt.role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start justify-between text-xs cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold font-display ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                            {opt.label}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {opt.desc}
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shadow-xs shadow-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Card & Logout */}
        {user && (
          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight font-display">
                {user.ign ? `${user.ign} (${user.name})` : user.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {user.studentId}
              </span>
            </div>

            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.ign}`}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
            />

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
