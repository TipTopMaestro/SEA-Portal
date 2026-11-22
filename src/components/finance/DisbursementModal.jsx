import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { Upload, Check } from 'lucide-react';

const DisbursementModal = ({ isOpen, onClose, onCreated, events = [], defaultEventId = '' }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    eventId: defaultEventId,
    eventName: events.find((event) => event.id === defaultEventId)?.title || '',
    category: 'Equipment & Hardware',
    amount: '',
    description: '',
    receiptName: 'Receipt_Voucher.pdf',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4966779d71?w=400&auto=format&fit=crop&q=80',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Expense title is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid expense amount is required';
    }
    if (!formData.description.trim()) {
      errs.description = 'Justification / description is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        receiptName: file.name,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result);
        setFormData((prev) => ({ ...prev, receiptUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const eventName = formData.eventName.trim();
      const event = eventName
        ? events.find((item) => item.title.toLowerCase() === eventName.toLowerCase())
          || portalService.createFinanceEvent(eventName, user)
        : null;
      portalService.createDisbursementRequest({
        ...formData,
        eventId: event?.id || null,
        eventTitle: event?.title || 'General / Unassigned',
      }, user);
      showToast(`Disbursement request for PHP ${Number(formData.amount).toLocaleString()} submitted to Finance!`, 'success');
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
      title="Submit Disbursement Request Voucher"
      subtitle="Request funds for hardware, scrimmage lab supplies, transport, or tournament entry fees"
      maxWidth="max-w-xl"
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
            list="finance-disbursement-events"
            placeholder="Type an event name (new or existing)"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <datalist id="finance-disbursement-events">
            {events.map((event) => <option key={event.id} value={event.title} />)}
          </datalist>
          <p className="text-[10px] text-slate-400 mt-1">A new ledger is created automatically when the name does not exist.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Expense Title / Item *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Scrimmage Lab High-Speed Ethernet Switches & Cables"
            className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
              errors.title ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
          {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Equipment & Hardware">Equipment & Hardware</option>
              <option value="Travel & Logistics">Travel & Logistics (Van, Tolls)</option>
              <option value="Marketing & Events">Marketing, Booths & Banners</option>
              <option value="Food & Refreshments">Player Meals & Water Subsidies</option>
              <option value="Tournament Entry Fee">Tournament Entry & Registration</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Requested Amount (PHP ₱) *
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 4850.00"
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.amount ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.amount && <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Budget Justification & Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Explain why this disbursement is necessary for DNSC Esports operations..."
            className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
              errors.description ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
            }`}
          />
          {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>}
        </div>

        {/* Receipt Upload Simulation */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Receipt / Quotation Attachment *
          </label>
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-center cursor-pointer relative">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="p-2.5 rounded-full bg-white text-blue-600 mb-2 border border-slate-200 shadow-2xs">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-800 font-display">
              {formData.receiptName || 'Click to upload Official Receipt (OR) or Invoice'}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              Supports PDF, PNG, JPG (Simulated upload)
            </span>
          </div>

          {uploadedPreview && (
            <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={uploadedPreview}
                alt="Receipt preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              />
              <span className="text-xs text-slate-700 font-mono truncate">
                {formData.receiptName}
              </span>
            </div>
          )}
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
            <span>{submitting ? 'Submitting...' : 'Submit Voucher for Approval'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DisbursementModal;
