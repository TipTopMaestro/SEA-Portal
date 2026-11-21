import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Swords,
  QrCode,
  DollarSign
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user, role, ROLES } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard & Analytics',
      icon: LayoutDashboard,
      badge: 'Overview',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
    {
      to: '/hr',
      label: 'HR & RBAC Management',
      icon: ShieldCheck,
      badge: role === ROLES.EXECUTIVE ? 'Admin' : 'Protected',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
    {
      to: '/membership',
      label: 'Registration & Dues',
      icon: Users,
      badge: role === ROLES.MEMBER ? 'My Card' : 'Roster',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
    {
      to: '/tryouts',
      label: 'Tryouts & Evaluation',
      icon: Swords,
      badge: role === ROLES.MEMBER ? 'Apply' : 'Queue',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
    {
      to: '/attendance',
      label: 'QR Attendance',
      icon: QrCode,
      badge: role === ROLES.MEMBER ? 'Scan' : 'Host',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
    {
      to: '/finance',
      label: 'Finance & Approvals',
      icon: DollarSign,
      badge: role === ROLES.FINANCE_OFFICER ? 'Disburse' : role === ROLES.EXECUTIVE ? 'Sign-Off' : 'Audit',
      roles: [ROLES.EXECUTIVE, ROLES.GAME_MANAGER, ROLES.FINANCE_OFFICER, ROLES.MEMBER],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-display">
            Core Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold font-display tracking-wide transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                          isActive
                            ? 'bg-blue-100 text-blue-800 font-bold'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Active Session
              </span>
              <RoleBadge role={role} size="xs" showIcon={false} />
            </div>
            <div className="text-xs font-bold text-slate-900 truncate font-display">
              {user?.name}
            </div>
            <div className="text-[11px] text-blue-600 font-mono truncate font-medium">
              {user?.ign ? `[IGN: ${user.ign}]` : user?.studentId}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
