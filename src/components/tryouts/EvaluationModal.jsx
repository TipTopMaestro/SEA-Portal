import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import { ExternalLink, Check } from 'lucide-react';

const EvaluationModal = ({ isOpen, onClose, tryout, onEvaluated }) => {
  const { user: currentOfficer } = useAuth();
  const { showToast } = useNotification();

  const [scores, setScores] = useState({
    mechanics: tryout?.scores?.mechanics || 8,
    communication: tryout?.scores?.communication || 8,
    gameSense: tryout?.scores?.gameSense || 8,
    coachability: tryout?.scores?.coachability || 8,
  });

  const [notes, setNotes] = useState(tryout?.evaluatorNotes || '');
  const [status, setStatus] = useState(tryout?.status || 'Shortlisted');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (tryout) {
      setScores({
        mechanics: tryout.scores?.mechanics || 8,
        communication: tryout.scores?.communication || 8,
        gameSense: tryout.scores?.gameSense || 8,
        coachability: tryout.scores?.coachability || 8,
      });
      setNotes(tryout.evaluatorNotes || '');
      setStatus(tryout.status || 'Shortlisted');
    }
  }, [tryout]);

  if (!tryout) return null;

  const currentAverage = (
    (Number(scores.mechanics) +
      Number(scores.communication) +
      Number(scores.gameSense) +
      Number(scores.coachability)) /
    4
  ).toFixed(1);

  const handleScoreChange = (metric, val) => {
    setScores((prev) => ({ ...prev, [metric]: Number(val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      portalService.evaluateTryout(tryout.id, scores, notes, currentOfficer);
      if (status !== tryout.status) {
        portalService.updateTryoutStatus(tryout.id, status, currentOfficer);
      }
      showToast(`Evaluated ${tryout.applicantName} with ${currentAverage}/10. Status: ${status}`, 'success');
      onEvaluated();
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
      title="Candidate Tryout Evaluation & Scoring"
      subtitle={`Evaluate performance, mechanical skill, and assign roster status for ${tryout.applicantName}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 font-display">
                {tryout.applicantName}
              </span>
              <span className="text-blue-600 font-mono text-xs font-semibold">[{tryout.ign}]</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {tryout.game} • <span className="text-slate-700 font-semibold">{tryout.division}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Rank: <strong className="text-amber-600">{tryout.rank}</strong> • Roles: {tryout.primaryRole} / {tryout.secondaryRole || 'Flex'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Overall Score
            </span>
            <div className="text-2xl font-black text-blue-600 font-display">
              {currentAverage}
              <span className="text-xs text-slate-400">/10</span>
            </div>
          </div>
        </div>

        {/* Tracker link if present */}
        {tryout.trackerUrl && (
          <a
            href={tryout.trackerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-mono font-medium"
          >
            <span>Inspect Match History Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Scoring Sliders */}
        <div className="space-y-3 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display">
            Evaluation Rubric (1 - 10 Scale)
          </label>

          {[
            { key: 'mechanics', label: 'Mechanics & Aim Precision', desc: 'Raw crosshair placement, first bullet accuracy, reaction' },
            { key: 'communication', label: 'Communication & Shotcalling', desc: 'Clean comms, callouts, round pacing leadership' },
            { key: 'gameSense', label: 'Game Sense & Rotations', desc: 'Map awareness, utility usage, ability economy' },
            { key: 'coachability', label: 'Coachability & Mental Fortitude', desc: 'Receptiveness to feedback, composure in deficit' },
          ].map((item) => (
            <div key={item.key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-xs font-bold text-slate-800 font-display">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {item.desc}
                  </span>
                </div>
                <span className="text-sm font-black text-blue-600 font-display font-mono">
                  {scores[item.key]}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={scores[item.key]}
                onChange={(e) => handleScoreChange(item.key, e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Evaluator Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1">
            Game Manager Scrimmage Notes & Feedback
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Solid operator anchor on A site, needs better flash coordination on retakes..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Status Assignment */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 font-display mb-1.5">
            Roster Status Decision *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-display font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted for Scrimmage</option>
            <option value="Scheduled">Scheduled for LAN Trial</option>
            <option value="Accepted">Accepted to Official Varsity Roster</option>
            <option value="Rejected">Rejected / Not Selected</option>
          </select>
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
            <span>{submitting ? 'Saving Evaluation...' : 'Record Evaluation'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EvaluationModal;
