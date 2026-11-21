import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { useNotification } from '../../context/NotificationContext';
import TryoutApplicationModal from '../../components/tryouts/TryoutApplicationModal';
import EvaluationModal from '../../components/tryouts/EvaluationModal';
import StatusBadge from '../../components/common/StatusBadge';
import RoleBadge from '../../components/common/RoleBadge';
import StatCard from '../../components/common/StatCard';
import ExportButton from '../../components/common/ExportButton';
import EmptyState from '../../components/common/EmptyState';
import { INITIAL_GAMES } from '../../services/mockData';
import {
  Swords,
  Search,
  UserPlus,
  Star,
  Trophy,
  ExternalLink,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';

const TryoutsPage = () => {
  const { user: currentUser, role, ROLES } = useAuth();
  const { showToast } = useNotification();

  const [tryouts, setTryouts] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  
  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [activeTryoutForEval, setActiveTryoutForEval] = useState(null);

  const canManageTryouts = role === ROLES.GAME_MANAGER || role === ROLES.EXECUTIVE;

  const loadData = () => {
    setTryouts(portalService.getTryouts());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats
  const totalApplications = tryouts.length;
  const pendingCount = tryouts.filter((t) => t.status === 'Pending' || t.status === 'Under Review').length;
  const shortlistedCount = tryouts.filter((t) => t.status === 'Shortlisted' || t.status === 'Scheduled').length;
  const acceptedCount = tryouts.filter((t) => t.status === 'Accepted').length;

  const filteredTryouts = tryouts.filter((item) => {
    const matchesGame = selectedGame === 'all' || item.game.toLowerCase().includes(selectedGame.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      item.ign.toLowerCase().includes(search.toLowerCase()) ||
      item.rank.toLowerCase().includes(search.toLowerCase()) ||
      item.primaryRole.toLowerCase().includes(search.toLowerCase());
    return matchesGame && matchesStatus && matchesSearch;
  });

  const handleOpenEvaluation = (t) => {
    setActiveTryoutForEval(t);
    setIsEvalModalOpen(true);
  };

  const handleQuickStatusChange = (tryoutId, newStatus) => {
    try {
      portalService.updateTryoutStatus(tryoutId, newStatus, currentUser);
      showToast(`Updated tryout status to "${newStatus}"`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 3 • Competitive Scouting
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Tryout Evaluation & Queueing Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Candidate recruitment pipeline for Valorant, MLBB, LoL, CODM, and Tekken 8 varsity divisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold uppercase tracking-wider font-display shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up for Tryouts</span>
          </button>
          <ExportButton data={tryouts} filename="tryouts_recruitment_queue" label="Export Queue" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tryout Applicants"
          value={totalApplications}
          subtitle="All active titles"
          icon={Swords}
          color="blue"
        />
        <StatCard
          title="Pending Evaluation"
          value={pendingCount}
          subtitle="Awaiting GM review"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Shortlisted / Trial"
          value={shortlistedCount}
          subtitle="Passed first stage"
          icon={Star}
          color="purple"
        />
        <StatCard
          title="Signed to Varsity"
          value={acceptedCount}
          subtitle="Official roster spots"
          icon={Trophy}
          color="emerald"
        />
      </div>

      {/* Game Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedGame('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider border shrink-0 transition-all cursor-pointer ${
            selectedGame === 'all'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          All Titles ({tryouts.length})
        </button>

        {INITIAL_GAMES.map((game) => {
          const count = tryouts.filter((t) => t.game.toLowerCase().includes(game.name.toLowerCase())).length;
          const isSelected = selectedGame === game.name;
          return (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider border shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{game.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Dynamic Queueing & Scouting Dashboard</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review mechanics, analyze match tracker links, and assign candidate decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate, role, rank..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="pending">Pending</option>
              <option value="under review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="scheduled">Scheduled for Trial</option>
              <option value="accepted">Accepted (Varsity)</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Dynamic Queue Cards Grid */}
        <div className="p-4 sm:p-6 bg-slate-50/40">
          {filteredTryouts.length === 0 ? (
            <EmptyState
              icon={Swords}
              title="No Applicants in this Queue"
              description="There are currently no tryout applications matching the selected game or status filters."
              actionLabel="Sign Up Now"
              onAction={() => setIsApplyModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTryouts.map((applicant) => {
                const hasScore = applicant.scores && applicant.scores.average;
                return (
                  <div
                    key={applicant.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                            {applicant.game}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 font-display truncate">
                            {applicant.applicantName}
                          </h4>
                          <span className="text-xs text-slate-500 font-mono">
                            IGN: <strong className="text-slate-800">{applicant.ign}</strong>
                          </span>
                        </div>
                        <StatusBadge status={applicant.status} />
                      </div>

                      {/* Division & Type Badge */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-display uppercase tracking-wider font-semibold border border-slate-200">
                          {applicant.division}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase font-mono font-semibold">
                          {applicant.type}
                        </span>
                      </div>

                      {/* Rank & Roles */}
                      <div className="space-y-1 text-xs text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Peak Rank:</span>
                          <span className="font-semibold text-amber-600 font-display">
                            {applicant.rank}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Primary:</span>
                          <span className="font-medium text-slate-900 truncate max-w-[140px]">
                            {applicant.primaryRole}
                          </span>
                        </div>
                        {applicant.secondaryRole && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Secondary:</span>
                            <span className="font-medium text-slate-600 truncate max-w-[140px]">
                              {applicant.secondaryRole}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Evaluator Score Display */}
                      {hasScore ? (
                        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 mb-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-blue-700 font-bold block">
                              Scout Rating
                            </span>
                            <span className="text-xs text-slate-600 line-clamp-1">
                              {applicant.evaluatorNotes || 'Evaluated candidate'}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg font-black text-blue-700 font-display">
                              {applicant.scores.average}
                            </span>
                            <span className="text-[10px] text-slate-500">/10</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Evaluation score pending trial</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {applicant.trackerUrl ? (
                        <a
                          href={applicant.trackerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors"
                          title="Open match tracker"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span />
                      )}

                      {canManageTryouts ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={applicant.status}
                            onChange={(e) => handleQuickStatusChange(applicant.id, e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-800 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            title="Quick Status Update"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => handleOpenEvaluation(applicant)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-[11px] font-semibold uppercase tracking-wider font-display transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3 h-3" />
                            <span>{hasScore ? 'Score' : 'Eval'}</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          {applicant.status === 'Accepted' ? 'Signed Varsity' : 'Queue Active'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tryout Application Modal */}
      <TryoutApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onCreated={loadData}
      />

      {/* Evaluation & Scoring Modal */}
      <EvaluationModal
        isOpen={isEvalModalOpen}
        onClose={() => setIsEvalModalOpen(false)}
        tryout={activeTryoutForEval}
        onEvaluated={loadData}
      />
    </div>
  );
};

export default TryoutsPage;
