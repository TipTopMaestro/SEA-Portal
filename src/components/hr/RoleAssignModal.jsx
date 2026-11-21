import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { Check } from 'lucide-react';

const RoleAssignModal = ({ isOpen, onClose, targetUser, onUpdated }) => {
  const { user: currentOfficer, ROLES } = useAuth();
  const { showToast } = useNotification();

  const [role, setRole] = useState(targetUser?.role || 'member');
  const [title, setTitle] = useState(targetUser?.title || '');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (targetUser) {
      setRole(targetUser.role);
      setTitle(targetUser.title || '');
    }
  }, [targetUser]);

  if (!targetUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = portalService.updateUserRole(
        targetUser.id,
        role,
        title,
        currentOfficer
      );
      showToast(
        `Successfully updated ${updated.name}'s role to ${role.toUpperCase()}!`,
        'success'
      );
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
      title="Assign Officer Role & RBAC Clearance"
      subtitle={`Configure organization clearance level and custom title for ${targetUser.name}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-white"
          />
          <div>
            <div className="text-sm font-bold text-slate-900 font-display">
              {targetUser.name} <span className="text-blue-600 font-medium">({targetUser.ign})</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Student ID: {targetUser.studentId} • {targetUser.program}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
            Clearance Level (RBAC Role) *
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: ROLES.EXECUTIVE,
                label: 'Executive Officer',
                desc: 'Unrestricted access: HR assignments, executive sign-offs, global audits.',
                color: 'border-purple-300 text-purple-900 bg-purple-50',
              },
              {
                id: ROLES.GAME_MANAGER,
                label: 'Game Manager',
                desc: 'Manages game rosters, scores tryout applicants, generates scrimmage QR codes.',
                color: 'border-blue-300 text-blue-900 bg-blue-50',
              },
              {
                id: ROLES.FINANCE_OFFICER,
                label: 'Finance Officer',
                desc: 'Manages membership dues, logs inflows, reviews disbursement requests.',
                color: 'border-emerald-300 text-emerald-900 bg-emerald-50',
              },
              {
                id: ROLES.MEMBER,
                label: 'Academy Member',
                desc: 'Standard student member: personal digital ID, scan attendance, apply for tryouts.',
                color: 'border-slate-200 text-slate-700 bg-white',
              },
            ].map((option) => (
              <label
                key={option.id}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  role === option.id
                    ? `${option.color} ring-2 ring-blue-500/30`
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="role"
                    value={option.id}
                    checked={role === option.id}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-xs font-bold font-display text-slate-900">
                      {option.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {option.desc}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
            Official Organization Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Head of Tactical FPS Division"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'Updating...' : 'Save Role Assignment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleAssignModal;
