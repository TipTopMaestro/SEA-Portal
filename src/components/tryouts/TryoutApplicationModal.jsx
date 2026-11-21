import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { INITIAL_GAMES } from '../../services/mockData';
import { Send, Users, User } from 'lucide-react';

const TryoutApplicationModal = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    type: 'individual',
    applicantName: user?.name || '',
    ign: user?.ign || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    discord: user?.discord || '',
    game: 'Valorant',
    division: 'Division 1 (Varsity)',
    rank: '',
    primaryRole: '',
    secondaryRole: '',
    trackerUrl: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicantName: user.name || '',
        ign: user.ign || '',
        studentId: user.studentId || '',
        email: user.email || '',
        discord: user.discord || '',
      }));
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!formData.applicantName.trim()) errs.applicantName = 'Name is required';
    if (!formData.ign.trim()) errs.ign = 'IGN or Team Name is required';
    if (!formData.rank.trim()) errs.rank = 'Current in-game rank is required';
    if (!formData.primaryRole.trim()) errs.primaryRole = 'Primary role/specialization is required';
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
      portalService.createTryoutApplication(formData, user);
      showToast('Tryout application registered! Game Managers have been alerted.', 'success');
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
      title="Varsity Tryout Sign-Up Application"
      subtitle="Submit candidate credentials for DNSC Student Esports Academy competitive rosters"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sign-up Type Selector: Individual vs Full Team */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
            Application Mode *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: 'individual' }))}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                formData.type === 'individual'
                  ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <User className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold font-display text-slate-900">
                  Individual Free Agent
                </div>
                <div className="text-[11px] text-slate-500">
                  Tryout for open roster slots
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: 'team' }))}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                formData.type === 'team'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <Users className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold font-display text-slate-900">
                  Full Team / Premade Roster
                </div>
                <div className="text-[11px] text-slate-500">
                  5-man squad tryout as a unit
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              {formData.type === 'individual' ? 'Candidate Full Name *' : 'Team Captain / Contact Name *'}
            </label>
            <input
              type="text"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.applicantName ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.applicantName && <p className="text-[11px] text-rose-600 mt-1">{errors.applicantName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              {formData.type === 'individual' ? 'In-Game Name (IGN) *' : 'Team Name & Tag *'}
            </label>
            <input
              type="text"
              name="ign"
              value={formData.ign}
              onChange={handleChange}
              placeholder="e.g. Phoenix or Team Nexus"
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.ign ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.ign && <p className="text-[11px] text-rose-600 mt-1">{errors.ign}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Game Title *
            </label>
            <select
              name="game"
              value={formData.game}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {INITIAL_GAMES.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Preferred Division *
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Division 1 (Varsity)">Division 1 (Varsity First Team)</option>
              <option value="Division 2 (Academy)">Division 2 (Academy / Developmental)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              In-Game Peak Rank / Rating *
            </label>
            <input
              type="text"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              placeholder="e.g. Ascendant 2 / Mythical Immortal"
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.rank ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.rank && <p className="text-[11px] text-rose-600 mt-1">{errors.rank}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Primary Role / Champion Pool *
            </label>
            <input
              type="text"
              name="primaryRole"
              value={formData.primaryRole}
              onChange={handleChange}
              placeholder="e.g. Duelist (Jett/Reyna) or Roam/Tank"
              className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:ring-2 ${
                errors.primaryRole ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            {errors.primaryRole && <p className="text-[11px] text-rose-600 mt-1">{errors.primaryRole}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Secondary / Flex Role
            </label>
            <input
              type="text"
              name="secondaryRole"
              value={formData.secondaryRole}
              onChange={handleChange}
              placeholder="e.g. Initiator or Offlane"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
              Tracker / Profile URL
            </label>
            <input
              type="url"
              name="trackerUrl"
              value={formData.trackerUrl}
              onChange={handleChange}
              placeholder="https://tracker.gg/valorant/profile/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Tournament Experience & Candidate Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Highlight previous inter-school tournaments, scrim history, device setup, or captain shotcalling experience..."
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
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Tryout Form'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TryoutApplicationModal;
