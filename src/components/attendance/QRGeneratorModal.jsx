import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { QrCode, Clock, RefreshCw, MapPin, Download } from 'lucide-react';

const QRGeneratorModal = ({ isOpen, onClose, onCreated }) => {
  const { user: currentOfficer } = useAuth();
  const { showToast } = useNotification();

  const [step, setStep] = useState('create');
  const [formData, setFormData] = useState({
    title: 'Tactical FPS Scrimmage: Session A',
    type: 'scrimmage',
    location: 'DNSC ICT Lab 3 / Discord SEA Server',
    durationMinutes: 60,
    expectedAttendees: 20,
  });

  const [activeEvent, setActiveEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [submitting, setSubmitting] = useState(false);
  const qrWrapRef = useRef(null);

  useEffect(() => {
    let timer;
    if (activeEvent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeEvent, timeLeft]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Event title is required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const expiresAt = new Date(
        Date.now() + formData.durationMinutes * 60 * 1000
      ).toISOString();

      const newEvent = portalService.createAttendanceEvent(
        {
          ...formData,
          expiresAt,
        },
        currentOfficer
      );

      setActiveEvent(newEvent);
      setTimeLeft(formData.durationMinutes * 60);
      setStep('display');
      showToast(`Time-bound QR code generated for ${newEvent.title}!`, 'success');
      onCreated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshCode = () => {
    if (!activeEvent) return;
    const newToken = `NEXUS-ATT-${activeEvent.type.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setActiveEvent((prev) => (prev ? { ...prev, qrToken: newToken } : null));
    setTimeLeft(formData.durationMinutes * 60);
    showToast('Refreshed QR Code security token!', 'info');
  };

  const handleDownloadQR = () => {
    const canvas = qrWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = (activeEvent?.title || 'attendance')
      .replace(/[^a-z0-9]+/gi, '_')
      .toLowerCase();
    link.download = `qr_${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('QR code downloaded!', 'success');
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'create' ? 'Host QR Attendance Session' : 'Active Time-Bound QR Attendance'}
      subtitle={
        step === 'create'
          ? 'Generate a dynamic time-bound QR code for scrimmages, booths, or assemblies'
          : `Project this code on the projector or display for members to scan`
      }
      maxWidth="max-w-md"
    >
      {step === 'create' ? (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Weekly Valorant Scrimmage Match"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Session Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'scrimmage', label: 'Scrimmage' },
                { id: 'booth', label: 'Campus Booth' },
                { id: 'assembly', label: 'General Assembly' },
                { id: 'tournament', label: 'Tournament' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFormData({ ...formData, type: t.id })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-display border transition-all cursor-pointer ${
                    formData.type === t.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Location / Arena
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. ICT Lab 3 or Audio-Visual Center"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                Time-To-Live (TTL)
              </label>
              <select
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={120}>120 Minutes (2 Hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
                Expected Attendees
              </label>
              <input
                type="number"
                value={formData.expectedAttendees}
                onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
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
              <QrCode className="w-4 h-4" />
              <span>{submitting ? 'Generating...' : 'Launch Live QR Code'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Display Live QR Code View */
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          {/* QR Presentation Box (stays white so phones can scan it) */}
          <div
            ref={qrWrapRef}
            className="relative p-5 rounded-3xl bg-[#ffffff] shadow-xl border-4 border-blue-600"
          >
            <QRCodeCanvas
              value={activeEvent.qrToken}
              size={600}
              marginSize={2}
              level="H"
              style={{ width: 220, height: 220 }}
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-slate-900 font-display">
              {activeEvent.title}
            </h4>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeEvent.location}</span>
            </p>
          </div>

          {/* Time Bound Clock */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-600">Token Validity: </span>
              <strong className="font-mono text-blue-800 text-sm">
                {formatCountdown(timeLeft)}
              </strong>
            </div>
            <button
              type="button"
              onClick={handleRefreshCode}
              title="Rotate Token"
              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Token String */}
          <div className="text-[11px] font-mono text-slate-500 px-3 py-1 rounded bg-slate-50 border border-slate-200">
            Session Token: <span className="text-slate-800 font-semibold">{activeEvent.qrToken}</span>
          </div>

          {/* Download QR */}
          <button
            type="button"
            onClick={handleDownloadQR}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download QR Code</span>
          </button>

          <div className="pt-3 w-full flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('create')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Host Another Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-display uppercase tracking-wider cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QRGeneratorModal;