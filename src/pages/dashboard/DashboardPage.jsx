import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import RoleBadge from '../../components/common/RoleBadge';
import StatusBadge from '../../components/common/StatusBadge';
import StatCard from '../../components/common/StatCard';
import ExportButton from '../../components/common/ExportButton';
import DigitalMemberCard from '../../components/membership/DigitalMemberCard';
import { INITIAL_GAMES } from '../../services/mockData';
import {
  Users,
  Coins,
  Swords,
  QrCode,
  Trophy,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt
} from 'lucide-react';

const DashboardPage = () => {
  const { user, role, ROLES } = useAuth();
  const [users, setUsers] = useState([]);
  const [tryouts, setTryouts] = useState([]);
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState([]);
  const [inflows, setInflows] = useState([]);
  const [disbursements, setDisbursements] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    setUsers(portalService.getUsers());
    setTryouts(portalService.getTryouts());
    setEvents(portalService.getAttendanceEvents());
    setRecords(portalService.getAttendanceRecords());
    setInflows(portalService.getFinanceInflows());
    setDisbursements(portalService.getDisbursements());
    setActivityLogs(portalService.getActivityLogs());
  }, [role]);

  // Calculations
  const totalMembers = users.length;
  const paidDuesCount = users.filter((u) => u.duesStatus === 'paid').length;
  const unpaidDuesCount = users.filter((u) => u.duesStatus === 'unpaid').length;
  
  const totalInflows = inflows.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDisbursed = disbursements
    .filter((d) => d.status === 'disbursed')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const netTreasury = totalInflows - totalDisbursed;

  const pendingDisbursements = disbursements.filter(
    (d) => d.status === 'submitted' || d.status === 'finance_approved'
  );

  const pendingTryouts = tryouts.filter(
    (t) => t.status === 'Pending' || t.status === 'Under Review'
  );

  const activeEvents = events.filter((e) => e.active);

  // Consolidated org report for CSV export
  const consolidatedReport = [
    { metric: 'Total Academy Members', value: totalMembers },
    { metric: 'Dues Paid Count', value: paidDuesCount },
    { metric: 'Dues Unpaid Count', value: unpaidDuesCount },
    { metric: 'Net Treasury Balance (PHP)', value: netTreasury },
    { metric: 'Total Inflows Recorded (PHP)', value: totalInflows },
    { metric: 'Total Disbursed Expenses (PHP)', value: totalDisbursed },
    { metric: 'Total Tryout Applicants', value: tryouts.length },
    { metric: 'Signed Varsity Players', value: tryouts.filter(t => t.status === 'Accepted').length },
    { metric: 'Verified Attendance Scans', value: records.length },
    { metric: 'Active Scrimmage Sessions', value: activeEvents.length },
    { metric: 'Events Hosted', value: events.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 6 • Role Intelligence & KPIs
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight flex items-center gap-2">
            <span>Welcome, {user?.ign ? `${user.ign}` : user?.name}</span>
            <span className="text-blue-600 text-lg font-mono">⚡</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {role === ROLES.EXECUTIVE && 'Executive Command View • Overall Academy Growth & Fiscal Governance'}
            {role === ROLES.GAME_MANAGER && 'Game Operations View • Scrimmage Coordination, Roster Scouting & Tryouts'}
            {role === ROLES.FINANCE_OFFICER && 'Treasury & Audit View • Inflow Audits, Dues Verification & Disbursements'}
            {role === ROLES.MEMBER && 'Varsity Candidate View • Digital ID Pass, Dues Status & Tryout Progress'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ExportButton
            data={consolidatedReport}
            filename="nexus_sea_analytics_kpi"
            label="Export KPI Summary"
          />
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: EXECUTIVE OFFICER DASHBOARD
          ========================================================================= */}
      {role === ROLES.EXECUTIVE && (
        <div className="space-y-6">
          {/* Executive Top KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Academy Enrolled Roster"
              value={totalMembers}
              subtitle={`${paidDuesCount} in good standing`}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Net Treasury Vault"
              value={`₱${netTreasury.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
              subtitle={`₱${totalInflows.toLocaleString()} lifetime inflow`}
              icon={Coins}
              color="emerald"
            />
            <StatCard
              title="Recruitment Pipeline"
              value={tryouts.length}
              subtitle={`${tryouts.filter(t => t.status === 'Accepted').length} signed varsity`}
              icon={Swords}
              color="purple"
            />
            <StatCard
              title="Attendance Scans"
              value={records.length}
              subtitle={`${events.length} events logged`}
              icon={QrCode}
              color="amber"
            />
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/hr"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Manage</span>
                <div className="text-xs font-bold text-slate-900 font-display group-hover:text-purple-700">
                  Officer Roles
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/finance"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Authorize</span>
                <div className="text-xs font-bold text-slate-900 font-display group-hover:text-emerald-700">
                  Disbursements ({pendingDisbursements.length})
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/tryouts"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Review</span>
                <div className="text-xs font-bold text-slate-900 font-display group-hover:text-blue-700">
                  Tryout Queue ({pendingTryouts.length})
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/attendance"
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Launch</span>
                <div className="text-xs font-bold text-slate-900 font-display group-hover:text-amber-700">
                  Scrimmage QR
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pending Executive Sign-Off Queue & Activity Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disbursements Awaiting Sign-Off */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                    Executive Sign-Off Queue
                  </h3>
                </div>
                <Link to="/finance" className="text-xs text-blue-600 hover:text-blue-700 font-mono font-medium">
                  View All ({disbursements.length}) →
                </Link>
              </div>

              {pendingDisbursements.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No disbursement requests pending executive review.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDisbursements.slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-display truncate max-w-[220px]">
                          {d.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ₱{Number(d.amount).toLocaleString()} • Requested by {d.requestedBy}
                        </div>
                      </div>
                      <Link
                        to="/finance"
                        className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-display font-semibold transition-colors"
                      >
                        Audit
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Officer Activity Trail */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                    Recent Command Activity
                  </h3>
                </div>
                <Link to="/hr" className="text-xs text-blue-600 hover:text-blue-700 font-mono font-medium">
                  Full Audit Log →
                </Link>
              </div>

              <div className="space-y-3">
                {activityLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="text-xs border-l-2 border-blue-600 pl-3 py-0.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-slate-900">{log.officerName}</span>
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <div className="text-blue-700 font-semibold">{log.action}</div>
                    <p className="text-[11px] text-slate-500 truncate">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: GAME MANAGER DASHBOARD
          ========================================================================= */}
      {role === ROLES.GAME_MANAGER && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Applicants in Scouting"
              value={tryouts.length}
              subtitle="All registered titles"
              icon={Swords}
              color="blue"
            />
            <StatCard
              title="Awaiting Evaluation"
              value={pendingTryouts.length}
              subtitle="Requires rating"
              icon={AlertCircle}
              color="amber"
            />
            <StatCard
              title="Signed to Rosters"
              value={tryouts.filter(t => t.status === 'Accepted').length}
              subtitle="Official Varsity"
              icon={Trophy}
              color="emerald"
            />
            <StatCard
              title="Scrimmage Sessions"
              value={events.length}
              subtitle={`${records.length} attendances`}
              icon={QrCode}
              color="purple"
            />
          </div>

          {/* Game Titles Breakdown Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider mb-3">
              Competitive Scouting Pipeline by Title
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {INITIAL_GAMES.map((game) => {
                const gameApplicants = tryouts.filter((t) =>
                  t.game.toLowerCase().includes(game.name.toLowerCase())
                );
                const signedCount = gameApplicants.filter((t) => t.status === 'Accepted').length;

                return (
                  <div
                    key={game.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-mono text-blue-600 font-bold">
                        {game.genre}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 font-display mt-0.5 truncate">
                        {game.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Total: <strong className="text-slate-800">{gameApplicants.length}</strong></span>
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold">Signed: {signedCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Reviews Queue Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                  Pending Tryout Review Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Candidates waiting for Game Manager mechanical and communication scoring.
                </p>
              </div>
              <Link to="/tryouts" className="text-xs text-blue-600 hover:text-blue-700 font-mono font-medium">
                Scouting Desk →
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingTryouts.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-display">
                      {t.applicantName} <span className="text-blue-600">[{t.ign}]</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {t.game} • {t.rank} • Role: {t.primaryRole}
                    </div>
                  </div>

                  <Link
                    to="/tryouts"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold font-display uppercase tracking-wider transition-all shadow-2xs"
                  >
                    Evaluate
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: FINANCE OFFICER DASHBOARD
          ========================================================================= */}
      {role === ROLES.FINANCE_OFFICER && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Net Treasury Balance"
              value={`₱${netTreasury.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
              subtitle="Vault balance"
              icon={Coins}
              color="blue"
            />
            <StatCard
              title="Dues Collected"
              value={`₱${(paidDuesCount * 200).toLocaleString()}`}
              subtitle={`${paidDuesCount} paid • ${unpaidDuesCount} unpaid`}
              icon={TrendingUp}
              trend={`${Math.round((paidDuesCount / (totalMembers || 1)) * 100)}%`}
              color="emerald"
            />
            <StatCard
              title="Disbursements Released"
              value={`₱${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
              subtitle={`${disbursements.filter(d => d.status === 'disbursed').length} paid vouchers`}
              icon={Receipt}
              color="purple"
            />
            <StatCard
              title="Vouchers in Review"
              value={pendingDisbursements.length}
              subtitle="Pending multi-stage sign"
              icon={Clock}
              color="amber"
            />
          </div>

          {/* Dues Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                Semester Membership Dues Collection Target
              </span>
              <span className="text-xs font-mono text-blue-600 font-bold">
                ₱{(paidDuesCount * 200).toLocaleString()} / ₱{(totalMembers * 200).toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (paidDuesCount / (totalMembers || 1)) * 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
              <span>{paidDuesCount} Verified Paid</span>
              <span>{unpaidDuesCount} Outstanding Pending</span>
            </div>
          </div>

          {/* Pending Disbursement Review Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                  Disbursement Vouchers Awaiting Audit
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify receipts and documentation before advancing to Executive sign-off.
                </p>
              </div>
              <Link to="/finance" className="text-xs text-blue-600 hover:text-blue-700 font-mono font-medium">
                Full Treasury Ledger →
              </Link>
            </div>

            <div className="space-y-3">
              {pendingDisbursements.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-display">
                      {d.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ₱{Number(d.amount).toLocaleString()} • Requested by {d.requestedBy}
                    </div>
                  </div>
                  <Link
                    to="/finance"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-display uppercase tracking-wider transition-all shadow-xs"
                  >
                    Verify Voucher
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: GENERAL MEMBER DASHBOARD
          ========================================================================= */}
      {role === ROLES.MEMBER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Member Digital ID Card */}
            <div className="lg:col-span-1 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-display px-1">
                Your Academy Varsity Pass
              </span>
              <DigitalMemberCard user={user} />
            </div>

            {/* Member Status & Quick Actions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Dues Alert Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Membership Status
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
                      Semester 1 Organization Dues
                    </h3>
                  </div>
                  <StatusBadge status={user?.duesStatus} />
                </div>

                {user?.duesStatus === 'paid' ? (
                  <p className="text-xs text-emerald-800 font-medium">
                    Your academy dues are fully cleared! You are qualified for varsity tryouts and official campus scrimmages.
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-rose-700 font-medium">
                      Your semester fee (₱200.00) is pending. Settle your dues to activate official varsity eligibility.
                    </p>
                    <Link
                      to="/membership"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-wider font-display shrink-0 text-center shadow-xs"
                    >
                      Settle Dues
                    </Link>
                  </div>
                )}
              </div>

              {/* Tryout Status & Attendance Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Swords className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                        Varsity Tryout Sign-Up
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Register as a free agent or with your premade 5-man squad for Valorant, MLBB, LoL, or CODM.
                    </p>
                  </div>
                  <Link
                    to="/tryouts"
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider font-display text-center transition-all shadow-xs"
                  >
                    Open Tryout Form
                  </Link>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                        Mobile QR Check-In
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Scan time-bound session codes displayed during scrimmages, assemblies, and booth fairs.
                    </p>
                  </div>
                  <Link
                    to="/attendance"
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider font-display text-center transition-all border border-slate-200 shadow-2xs"
                  >
                    Open Camera Scanner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
