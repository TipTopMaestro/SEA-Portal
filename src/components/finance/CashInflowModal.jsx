import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { Check } from 'lucide-react';

const CashInflowModal = ({ isOpen, onClose, onCreated, events = [], defaultEventId = '' }) => {
  const { user: currentOfficer } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    category: 'Membership Dues',
    eventId: defaultEventId,
    eventName: events.find((event) => event.id === defaultEventId)?.title || '',
    source: '',
    amount: '',
    paymentMethod: 'GCash',
    referenceNo: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.source.trim()) errs.source = 'Source description is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid inflow amount is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const eventName = formData.eventName.trim();
      const event = eventName
        ? events.find((item) => item.title.toLowerCase() === eventName.toLowerCase())
          || portalService.createFinanceEvent(eventName, currentOfficer)
        : null;
      portalService.addInflow({
        ...formData,
        eventId: event?.id || null,
        eventTitle: event?.title || 'General / Unassigned',
      }, currentOfficer);
      showToast(`Recorded inflow of PHP ${Number(formData.amount).toLocaleString()}!`, 'success');
      onCreated();
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
      title="Record Cash Inflow"
      subtitle="Log dues collection, esports jersey pre-orders, tournament prize shares, or sponsorships"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Event Ledger
          </label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            list="finance-inflow-events"
            placeholder="Type an event name (new or existing)"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <datalist id="finance-inflow-events">
            {events.map((event) => <option key={event.id} value={event.title} />)}
          </datalist>
          <p className="text-[10px] text-slate-400 mt-1">A new ledger is created automatically when the name does not exist.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Inflow Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            <option value="Membership Dues">Membership Dues Collection</option>
            <option value="Merchandise">Official Academy Merchandise / Jerseys</option>
            <option value="Tournament Prize Share">Tournament Prize Pool Organization Share</option>
            <option value="Sponsorship / Donations">Corporate Sponsor / Alumni Donation</option>
            <option value="Bootcamp Revenue">Bootcamp / Event Gate Revenue</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Source Title / Description *
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g. 1st Semester Batch 2 Dues (45 members)"
            className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
              errors.source ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
          {errors.source && <p className="text-[11px] text-rose-600 mt-1">{errors.source}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Amount (PHP ₱) *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 9000.00"
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.amount ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.amount && <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Payment Channel *
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="GCash">GCash Transfer</option>
              <option value="Cash on Hand">Cash on Hand (Treasury)</option>
              <option value="Bank Transfer">Direct Bank Deposit / Maya</option>
              <option value="Cheque">Official Bank Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Reference / Deposit Slip #
          </label>
          <input
            type="text"
            name="referenceNo"
            value={formData.referenceNo}
            onChange={handleChange}
            placeholder="e.g. GC-99120485 or OR-2026-081"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Audit Remarks / Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Additional notes for semester financial audit..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

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
            <span>{submitting ? 'Recording...' : 'Record Cash Inflow'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CashInflowModal;
