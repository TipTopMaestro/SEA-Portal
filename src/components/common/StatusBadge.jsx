import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Sparkles } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();

  let label = status;
  let classes = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;

  // Dues status
  if (norm === 'paid' || norm === 'verified present' || norm === 'accepted' || norm === 'disbursed') {
    classes = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (norm === 'pending' || norm === 'submitted' || norm === 'under review') {
    classes = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = Clock;
  } else if (norm === 'unpaid' || norm === 'rejected' || norm === 'cancelled') {
    classes = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = XCircle;
  } else if (norm === 'shortlisted' || norm === 'finance_approved' || norm === 'scheduled') {
    classes = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = Sparkles;
  } else if (norm === 'executive_signed') {
    classes = 'bg-purple-50 text-purple-700 border-purple-200';
    Icon = AlertCircle;
  }

  // Friendly label formatting
  if (norm === 'finance_approved') label = 'Finance Verified';
  if (norm === 'executive_signed') label = 'Executive Signed';
  if (norm === 'submitted') label = 'Pending Review';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize shadow-2xs ${classes}`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
