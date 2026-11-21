import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const ApprovalTimeline = ({ disbursement }) => {
  if (!disbursement) return null;

  const isRejected = disbursement.status === 'rejected';

  const steps = [
    {
      id: 'submitted',
      label: '1. Voucher Submitted',
      by: disbursement.requestedBy,
      date: disbursement.requestDate,
      isDone: true,
    },
    {
      id: 'finance_approved',
      label: '2. Finance Verified',
      by: disbursement.financeApprover || 'Finance Officer',
      date: disbursement.financeApprovedDate,
      isDone:
        disbursement.status === 'finance_approved' ||
        disbursement.status === 'executive_signed' ||
        disbursement.status === 'disbursed',
    },
    {
      id: 'executive_signed',
      label: '3. Executive Signed',
      by: disbursement.executiveApprover || 'Executive President',
      date: disbursement.executiveSignedDate,
      isDone:
        disbursement.status === 'executive_signed' ||
        disbursement.status === 'disbursed',
    },
    {
      id: 'disbursed',
      label: '4. Funds Released',
      by: 'Treasury Vault',
      date: disbursement.disbursedDate,
      isDone: disbursement.status === 'disbursed',
    },
  ];

  if (isRejected) {
    return (
      <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
        <div className="flex items-center gap-1.5 font-bold font-display uppercase tracking-wider mb-1 text-rose-900">
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Disbursement Rejected</span>
        </div>
        <p className="text-[11px] text-rose-700">
          Reason: {disbursement.rejectionReason || 'Voucher documentation incomplete.'}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-2.5 rounded-xl border text-xs transition-all ${
              step.isDone
                ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-bold text-[11px] font-display ${step.isDone ? 'text-blue-900' : 'text-slate-500'}`}>
                {step.label}
              </span>
              {step.isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </div>
            <div className="text-[10px] text-slate-600 truncate font-medium">
              {step.by}
            </div>
            <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
              {step.date || 'Pending stage'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalTimeline;
