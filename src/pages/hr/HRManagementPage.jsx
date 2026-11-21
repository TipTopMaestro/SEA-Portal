import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import RoleBadge from '../../components/common/RoleBadge';
import RoleAssignModal from '../../components/hr/RoleAssignModal';
import OfficerActivityLog from '../../components/hr/OfficerActivityLog';
import ExportButton from '../../components/common/ExportButton';
import {
  UserCheck,
  ShieldAlert,
  Search,
  UserCog,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const HRManagementPage = () => {
  const { role, ROLES } = useAuth();
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isExecutive = role === ROLES.EXECUTIVE;

  const loadData = () => {
    setUsers(portalService.getUsers());
    setActivityLogs(portalService.getActivityLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAssignModal = (targetUser) => {
    if (!isExecutive) return;
    setSelectedUser(targetUser);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.ign.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 1 • Personnel & Clearance
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            HR Management & Role-Based Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Authorize officer clearances, assign administrative portfolios, and monitor the immutable organization audit log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton data={users} filename="dnsc_esports_personnel" label="Export Personnel" />
        </div>
      </div>

      {/* Role Restriction Banner if Not Executive */}
      {!isExecutive && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold font-display uppercase tracking-wider block mb-0.5 text-amber-900">
              Read-Only Clearance Notice
            </span>
            You are logged in as a{' '}
            <span className="font-bold uppercase text-slate-900">{role}</span>.
            Role promotion, demotion, and officer appointments require Executive Officer authorization. You may inspect the officer directory and activity log below.
          </div>
        </div>
      )}

      {/* Personnel Roster & Role Assignment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Academy Personnel & Officer Directory</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any member or officer to elevate or update their RBAC credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search personnel..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-52"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="executive">Executive Officers</option>
              <option value="game_manager">Game Managers</option>
              <option value="finance_officer">Finance Officers</option>
              <option value="member">General Members</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-display uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">Officer / Student</th>
                <th className="py-3 px-4 font-bold">Student ID & Program</th>
                <th className="py-3 px-4 font-bold">Role Clearance</th>
                <th className="py-3 px-4 font-bold">Official Title</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full border border-slate-200 object-cover bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900 font-display">
                            {u.name}{' '}
                            <span className="text-blue-600 font-normal">[{u.ign}]</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 font-medium">{u.studentId}</div>
                      <div className="text-[11px] text-slate-500">
                        {u.program} • {u.yearLevel}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RoleBadge role={u.role} size="xs" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {u.title || 'General Member'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAssignModal(u)}
                        disabled={!isExecutive}
                        title={
                          !isExecutive
                            ? 'Only Executive Officers may assign or modify roles'
                            : 'Modify Role & Permissions'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer ${
                          isExecutive
                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        <span>Assign Role</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix Reference */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>DNSC Esports Academy RBAC Matrix Reference</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Hierarchical privilege matrix enforced across frontend routes and Django REST backend endpoints.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
            <div className="flex items-center gap-1.5 mb-2">
              <RoleBadge role={ROLES.EXECUTIVE} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full HR & Role Promotions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Executive Disbursement Sign-Off</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Global Audit Logs & Overrides</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center gap-1.5 mb-2">
              <RoleBadge role={ROLES.GAME_MANAGER} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tryout Applicant Scoring & Queue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Host Scrimmage QR Attendance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Request Gear Disbursements</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center gap-1.5 mb-2">
              <RoleBadge role={ROLES.FINANCE_OFFICER} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verify Dues & Cash Inflows</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>First-Tier Disbursement Audit</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Export Financial Statements</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 mb-2">
              <RoleBadge role={ROLES.MEMBER} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Digital Academy Student Card</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Submit Tryout Applications</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Mobile QR Attendance Check-In</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <OfficerActivityLog logs={activityLogs} />

      {/* Role Assignment Modal */}
      <RoleAssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={selectedUser}
        onUpdated={loadData}
      />
    </div>
  );
};

export default HRManagementPage;
