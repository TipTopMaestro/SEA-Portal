import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { useNotification } from '../../context/NotificationContext';
import CashInflowModal from '../../components/finance/CashInflowModal';
import DisbursementModal from '../../components/finance/DisbursementModal';
import ApprovalTimeline from '../../components/finance/ApprovalTimeline';
import FinancePDFModal from '../../components/finance/FinancePDFModal';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import RoleBadge from '../../components/common/RoleBadge';
import StatCard from '../../components/common/StatCard';
import ExportButton from '../../components/common/ExportButton';
import EmptyState from '../../components/common/EmptyState';
import {
  TrendingUp,
  Receipt,
  Clock,
  Plus,
  Search,
  CheckCircle,
  ExternalLink,
  Coins,
  ShieldCheck,
  Building,
  FileText
} from 'lucide-react';

const FinancePage = () => {
  const { user: currentUser, role, ROLES } = useAuth();
  const { showToast } = useNotification();

  const [inflows, setInflows] = useState([]);
  const [disbursements, setDisbursements] = useState([]);
  const [activeTab, setActiveTab] = useState('disbursements');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [isInflowModalOpen, setIsInflowModalOpen] = useState(false);
  const [isDisbursementModalOpen, setIsDisbursementModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activeReceiptUrl, setActiveReceiptUrl] = useState(null);

  // Rejection modal
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const isFinanceOfficer = role === ROLES.FINANCE_OFFICER;
  const isExecutive = role === ROLES.EXECUTIVE;
  const canManageFinance = isFinanceOfficer || isExecutive;

  const loadData = () => {
    setInflows(portalService.getFinanceInflows());
    setDisbursements(portalService.getDisbursements());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Financial Metrics
  const totalInflowsAmount = inflows.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDisbursedAmount = disbursements
    .filter((d) => d.status === 'disbursed')
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const netTreasuryBalance = totalInflowsAmount - totalDisbursedAmount;
  const pendingApprovalsCount = disbursements.filter(
    (d) => d.status === 'submitted' || d.status === 'finance_approved' || d.status === 'executive_signed'
  ).length;

  // Filtered disbursements
  const filteredDisbursements = disbursements.filter((d) => {
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered inflows
  const filteredInflows = inflows.filter((inf) => {
    const matchesCategory = categoryFilter === 'all' || inf.category === categoryFilter;
    const matchesSearch =
      inf.source.toLowerCase().includes(search.toLowerCase()) ||
      inf.category.toLowerCase().includes(search.toLowerCase()) ||
      inf.referenceNo.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Actions
  const handleFinanceApprove = (id) => {
    try {
      portalService.financeApproveDisbursement(id, currentUser);
      showToast('Disbursement voucher verified! Forwarded to Executive for sign-off.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExecutiveSign = (id) => {
    try {
      portalService.executiveSignDisbursement(id, currentUser);
      showToast('Executive Officer signed disbursement voucher! Ready for payout.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleMarkDisbursed = (id) => {
    try {
      portalService.markDisbursed(id, currentUser);
      showToast('Disbursement completed! Funds officially released from treasury.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenReject = (id) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingId) return;
    try {
      portalService.rejectDisbursement(rejectingId, rejectReason, currentUser);
      showToast('Disbursement request rejected and audit trail updated.', 'info');
      setRejectingId(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 5 • Treasury & Fiscal Audits
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Finance Tracking & Multi-Level Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Track organization inflows, submit disbursement requests with receipt uploads, and manage multi-stage fiscal approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canManageFinance && (
            <button
              onClick={() => setIsInflowModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider font-display border border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Record Inflow</span>
            </button>
          )}

          <button
            onClick={() => setIsDisbursementModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold uppercase tracking-wider font-display shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Request Disbursement</span>
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider font-display border border-blue-200 transition-all cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>View PDF Report</span>
          </button>

          <ExportButton
            data={activeTab === 'disbursements' ? disbursements : inflows}
            filename={activeTab === 'disbursements' ? 'disbursement_vouchers' : 'cash_inflows_ledger'}
            label="Export Data"
          />
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Treasury Balance"
          value={`₱${netTreasuryBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Available funds"
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Total Cash Inflows"
          value={`₱${totalInflowsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle={`${inflows.length} recorded inflows`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Disbursed Expenses"
          value={`₱${totalDisbursedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Released disbursements"
          icon={Receipt}
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtitle="Awaiting sign-off"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('disbursements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider transition-all cursor-pointer ${
              activeTab === 'disbursements'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Disbursements & Approvals ({disbursements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider transition-all cursor-pointer ${
              activeTab === 'inflows'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Cash Inflows Ledger ({inflows.length})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {activeTab === 'disbursements' ? (
              <>
                <option value="Equipment & Hardware">Equipment & Hardware</option>
                <option value="Marketing & Events">Marketing & Events</option>
                <option value="Travel & Logistics">Travel & Logistics</option>
                <option value="Food & Refreshments">Food & Refreshments</option>
              </>
            ) : (
              <>
                <option value="Membership Dues">Membership Dues</option>
                <option value="Merchandise">Merchandise</option>
                <option value="Tournament Prize Share">Prize Share</option>
                <option value="Sponsorship / Donations">Sponsorship</option>
              </>
            )}
          </select>

          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44"
            />
          </div>
        </div>
      </div>

      {/* View: Disbursements & Multi-Level Approvals */}
      {activeTab === 'disbursements' && (
        <div className="space-y-4">
          {filteredDisbursements.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Disbursement Requests"
              description="There are no disbursement vouchers matching the search criteria."
              actionLabel="Create Disbursement Request"
              onAction={() => setIsDisbursementModalOpen(true)}
            />
          ) : (
            filteredDisbursements.map((d) => {
              const isSubmitted = d.status === 'submitted';
              const isFinanceApproved = d.status === 'finance_approved';
              const isExecutiveSigned = d.status === 'executive_signed';
              const isDisbursed = d.status === 'disbursed';
              const isRejected = d.status === 'rejected';

              return (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 shadow-xs transition-all"
                >
                  {/* Top Bar: Title, Amount, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {d.category}
                        </span>
                        <StatusBadge status={d.status} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {d.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requested by <strong className="text-slate-800">{d.requestedBy}</strong> on {d.requestDate}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Voucher Amount
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-blue-600 font-display">
                        ₱{Number(d.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Description & Justification */}
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {d.description}
                  </p>

                  {/* Visual Multi-Level Approval Timeline */}
                  <ApprovalTimeline disbursement={d} />

                  {/* Footer Bar: Receipt Preview & RBAC Authorization Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {/* Receipt link */}
                    <button
                      type="button"
                      onClick={() => setActiveReceiptUrl(d.receiptUrl)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono font-medium cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Receipt Attachment ({d.receiptName})</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {/* RBAC Action Controls */}
                    <div className="flex items-center gap-2">
                      {/* Step 1 to 2: Finance Officer Verification */}
                      {isSubmitted && (isFinanceOfficer || isExecutive) && (
                        <button
                          onClick={() => handleFinanceApprove(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Finance Verify</span>
                        </button>
                      )}

                      {/* Step 2 to 3: Executive Officer Sign-Off */}
                      {isFinanceApproved && isExecutive && (
                        <button
                          onClick={() => handleExecutiveSign(d.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-semibold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Executive Sign-Off</span>
                        </button>
                      )}

                      {/* Step 3 to 4: Disbursement Payout */}
                      {isExecutiveSigned && canManageFinance && (
                        <button
                          onClick={() => handleMarkDisbursed(d.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold font-display tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Release Payout</span>
                        </button>
                      )}

                      {/* Reject button */}
                      {!isDisbursed && !isRejected && canManageFinance && (
                        <button
                          onClick={() => handleOpenReject(d.id)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-300 hover:border-rose-300 text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View: Cash Inflows Ledger */}
      {activeTab === 'inflows' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-display uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold">Inflow Source & Details</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Channel & Reference</th>
                  <th className="py-3 px-4 font-bold">Date Recorded</th>
                  <th className="py-3 px-4 font-bold">Recorded By</th>
                  <th className="py-3 px-4 font-bold text-right">Amount (PHP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInflows.map((inf) => (
                  <tr key={inf.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-display">
                        {inf.source}
                      </div>
                      {inf.notes && (
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {inf.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
                        {inf.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <div className="font-medium">{inf.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">{inf.referenceNo}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {inf.date}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {inf.recordedBy}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-emerald-600 font-display text-sm">
                        +₱{Number(inf.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Inflow Modal */}
      <CashInflowModal
        isOpen={isInflowModalOpen}
        onClose={() => setIsInflowModalOpen(false)}
        onCreated={loadData}
      />

      {/* Request Disbursement Modal */}
      <DisbursementModal
        isOpen={isDisbursementModalOpen}
        onClose={() => setIsDisbursementModalOpen(false)}
        onCreated={loadData}
      />

      {/* Receipt Image Preview Modal */}
      <Modal
        isOpen={!!activeReceiptUrl}
        onClose={() => setActiveReceiptUrl(null)}
        title="Official Receipt / Quotation Document"
        subtitle="Supporting financial verification document"
        maxWidth="max-w-lg"
      >
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
          <img
            src={activeReceiptUrl}
            alt="Official receipt"
            className="max-h-96 w-auto rounded-lg object-contain shadow-xs"
          />
        </div>
      </Modal>

      {/* Reject Voucher Modal */}
      <Modal
        isOpen={!!rejectingId}
        onClose={() => setRejectingId(null)}
        title="Reject Disbursement Voucher"
        subtitle="Please provide an audit justification reason for denying this disbursement."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Audit Reason for Rejection *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
              rows={3}
              placeholder="e.g. Incomplete supplier tax invoice, exceeds approved Q4 budget allocation..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectingId(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
      {/* Viewable React-PDF Report Modal */}
      <FinancePDFModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        inflows={inflows}
        disbursements={disbursements}
        currentOfficer={currentUser}
      />
    </div>
  );
};

export default FinancePage;
