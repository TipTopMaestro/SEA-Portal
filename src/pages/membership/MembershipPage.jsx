import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { useNotification } from '../../context/NotificationContext';
import DigitalMemberCard from '../../components/membership/DigitalMemberCard';
import DuesUpdateModal from '../../components/membership/DuesUpdateModal';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import RoleBadge from '../../components/common/RoleBadge';
import StatCard from '../../components/common/StatCard';
import ExportButton from '../../components/common/ExportButton';
import {
  Users,
  Search,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';

const MembershipPage = () => {
  const { user: currentUser, role, ROLES, refreshUser } = useAuth();
  const { showToast } = useNotification();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUserForDues, setSelectedUserForDues] = useState(null);
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false);

  // Student Payment submission modal
  const [isPayProofModalOpen, setIsPayProofModalOpen] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('GCash');

  const canManageDues = role === ROLES.FINANCE_OFFICER || role === ROLES.EXECUTIVE;

  const loadData = () => {
    setUsers(portalService.getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calculation
  const totalMembers = users.length;
  const paidCount = users.filter((u) => u.duesStatus === 'paid').length;
  const pendingCount = users.filter((u) => u.duesStatus === 'pending').length;
  const unpaidCount = users.filter((u) => u.duesStatus === 'unpaid').length;
  const totalRevenueCollected = paidCount * 200;

  const filteredUsers = users.filter((u) => {
    const matchesStatus = statusFilter === 'all' || u.duesStatus === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.ign.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId.toLowerCase().includes(search.toLowerCase()) ||
      u.program.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenDuesModal = (user) => {
    setSelectedUserForDues(user);
    setIsDuesModalOpen(true);
  };

  const handleStudentSubmitProof = (e) => {
    e.preventDefault();
    if (!paymentRef.trim()) {
      showToast('Please enter your payment reference number', 'warning');
      return;
    }

    try {
      portalService.updateUserDuesStatus(currentUser.id, 'pending', currentUser);
      showToast('Payment proof submitted! Finance Officer will verify shortly.', 'success');
      setIsPayProofModalOpen(false);
      setPaymentRef('');
      loadData();
      refreshUser();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 2 • Membership & Roster
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Registration & Membership Dues Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Track student varsity profiles, digital credential passes, and semester organizational dues settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton data={users} filename="dnsc_membership_dues" label="Export Dues Report" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Academy Members"
          value={totalMembers}
          subtitle="Enrolled students"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Dues Collected"
          value={`₱${totalRevenueCollected.toLocaleString()}`}
          subtitle={`${paidCount} of ${totalMembers} paid`}
          icon={CreditCard}
          trend={`${Math.round((paidCount / (totalMembers || 1)) * 100)}%`}
          color="emerald"
        />
        <StatCard
          title="Pending Verification"
          value={pendingCount}
          subtitle="Awaiting officer audit"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Unpaid Members"
          value={unpaidCount}
          subtitle="₱200/semester"
          icon={AlertCircle}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Student Digital Card on Left + Payment Status / Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Digital ID Pass */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
              Your Academy Varsity Pass
            </h3>
            <span className="text-[10px] text-blue-600 font-mono font-semibold">Live RFID / QR</span>
          </div>
          <DigitalMemberCard user={currentUser} />
        </div>

        {/* Membership Dues Notice & Actions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  Membership Dues Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">
                    Semester 1 Academy Operational Dues
                  </h3>
                  <StatusBadge status={currentUser?.duesStatus} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-mono block">Fee Amount</span>
                <span className="text-2xl font-black text-blue-600 font-display">
                  ₱200.00
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Membership dues fund academy scrimmages, high-speed fiber internet lab reservations, competitive jersey subsidies, and tournament entry fees for DNSC teams.
            </p>

            {/* Dues Condition Message */}
            {currentUser?.duesStatus === 'paid' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 shadow-2xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold font-display uppercase tracking-wider block text-emerald-900">
                    Account In Good Standing
                  </span>
                  Your 1st Semester dues are fully paid and verified. You are eligible for varsity tryouts, bootcamp lab access, and official jersey orders.
                </div>
              </div>
            ) : currentUser?.duesStatus === 'pending' ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 shadow-2xs">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold font-display uppercase tracking-wider block text-amber-900">
                    Payment Under Verification
                  </span>
                  Your payment submission is queued in the Finance Officer review pipeline. Once confirmed, your status will turn to Paid.
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 shadow-2xs">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold font-display uppercase tracking-wider block text-rose-900">
                      Dues Pending Settlement
                    </span>
                    Please settle your ₱200 organization fee to activate varsity tournament eligibility.
                  </div>
                </div>

                <button
                  onClick={() => setIsPayProofModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs font-display uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Pay / Submit Proof
                </button>
              </div>
            )}
          </div>

          {/* Quick Payment Instructions Banner */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Payment Channels:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-medium">
                GCash: 0917-882-9901
              </span>
              <span className="hidden sm:inline">or Treasury Desk (ICT Lab 3)</span>
            </div>

            {currentUser?.duesStatus !== 'paid' && (
              <button
                onClick={() => setIsPayProofModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-display font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Submit GCash Ref #</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roster & Dues Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>DNSC Student Esports Academy Member Roster</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive registry of student members, collegiate programs, and dues status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member, IGN, ID..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="all">All Dues Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending Verification</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-display uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">Student Member</th>
                <th className="py-3 px-4 font-bold">Student ID & Year</th>
                <th className="py-3 px-4 font-bold">Primary Title</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Dues Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
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
                      <div className="text-[11px] text-slate-500">{u.program}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                        {u.primaryGame || 'Valorant'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <RoleBadge role={u.role} size="xs" showIcon={false} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.duesStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {canManageDues ? (
                        <button
                          onClick={() => handleOpenDuesModal(u)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                        >
                          Verify Dues
                        </button>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          Audit Only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dues Update Modal for Officers */}
      <DuesUpdateModal
        isOpen={isDuesModalOpen}
        onClose={() => setIsDuesModalOpen(false)}
        targetUser={selectedUserForDues}
        onUpdated={loadData}
      />

      {/* Student Submit Proof Modal */}
      <Modal
        isOpen={isPayProofModalOpen}
        onClose={() => setIsPayProofModalOpen(false)}
        title="Submit Dues Payment Proof"
        subtitle="Submit your GCash reference number for officer verification"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleStudentSubmitProof} className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <span className="font-bold font-display uppercase block mb-1 text-blue-950">
              GCash Payment Details:
            </span>
            <div className="font-mono text-slate-700">
              Account Name: DNSC Esports Academy Treasury<br />
              GCash Number: 0917-882-9901<br />
              Amount Due: ₱200.00
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
              Payment Method
            </label>
            <select
              value={paymentChannel}
              onChange={(e) => setPaymentChannel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="Cash at Lab">Paid in Cash at Scrimmage Lab</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
              Reference / Transaction No. *
            </label>
            <input
              type="text"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="e.g. 1029384756 or Cash Receipt #104"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPayProofModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Verification</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembershipPage;
