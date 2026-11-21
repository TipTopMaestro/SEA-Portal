import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { Check } from 'lucide-react';

const DuesUpdateModal = ({ isOpen, onClose, targetUser, onUpdated }) => {
  const { user: currentOfficer } = useAuth();
  const { showToast } = useNotification();

  const [duesStatus, setDuesStatus] = useState(targetUser?.duesStatus || 'unpaid');
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [refNumber, setRefNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (targetUser) {
      setDuesStatus(targetUser.duesStatus || 'unpaid');
    }
  }, [targetUser]);

  if (!targetUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      portalService.updateUserDuesStatus(targetUser.id, duesStatus, currentOfficer);
      
      // If marking as paid, optionally record inflow
      if (duesStatus === 'paid' && targetUser.duesStatus !== 'paid') {
        portalService.addInflow(
          {
            category: 'Membership Dues',
            source: `Semester Dues: ${targetUser.name} (${targetUser.studentId})`,
            amount: 200,
            paymentMethod,
            referenceNo: refNumber || `MANUAL-${Date.now().toString().slice(-5)}`,
            notes: `Verified by officer ${currentOfficer.name}`
          },
          currentOfficer
        );
      }

      showToast(`Updated dues status for ${targetUser.name} to ${duesStatus.toUpperCase()}`, 'success');
      onUpdated();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Membership Dues Status"
      subtitle={`Verify and update membership dues payment for ${targetUser.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900 font-display">
              {targetUser.name} ({targetUser.ign})
            </div>
            <div className="text-slate-500 font-mono">
              Student ID: {targetUser.studentId}
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">
              Standard Fee
            </span>
            <span className="text-sm font-extrabold text-blue-600 font-display">
              ₱200.00
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
            Dues Status *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'paid', label: 'Paid', color: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
              { id: 'pending', label: 'Pending', color: 'border-amber-300 text-amber-800 bg-amber-50' },
              { id: 'unpaid', label: 'Unpaid', color: 'border-rose-300 text-rose-800 bg-rose-50' },
            ].map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setDuesStatus(s.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-display border transition-all cursor-pointer ${
                  duesStatus === s.id ? `${s.color} ring-2 ring-blue-500/30` : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {duesStatus === 'paid' && (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="GCash">GCash Payment</option>
                <option value="Cash on Hand">Cash on Hand (Treasury Desk)</option>
                <option value="Bank Transfer">Bank Transfer / Maya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
                Reference / Receipt Number
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. 1092837192"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Update Status'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DuesUpdateModal;
