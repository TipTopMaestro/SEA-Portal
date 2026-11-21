import React, { useState } from 'react';
import {
  History,
  Search,
  Shield,
  Coins,
  Swords,
  QrCode,
  Users
} from 'lucide-react';
import RoleBadge from '../common/RoleBadge';
import ExportButton from '../common/ExportButton';

const OfficerActivityLog = ({ logs = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const typeIcons = {
    finance: Coins,
    tryouts: Swords,
    hr: Shield,
    attendance: QrCode,
    membership: Users,
  };

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch =
      log.officerName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Officer Audit & Activity Log
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time trail of administrative decisions, role promotions, and authorizations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-56"
            />
          </div>

          {/* Filter dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Modules</option>
            <option value="finance">Finance</option>
            <option value="tryouts">Tryouts</option>
            <option value="hr">HR & RBAC</option>
            <option value="attendance">Attendance</option>
            <option value="membership">Membership</option>
          </select>

          <ExportButton data={filteredLogs} filename="officer_activity_logs" label="Export Log" />
        </div>
      </div>

      {/* Log List */}
      <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No logged officer activities match your filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const Icon = typeIcons[log.type] || Shield;
            return (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5 text-xs"
              >
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-display">
                        {log.officerName}
                      </span>
                      <RoleBadge role={log.officerRole} size="xs" showIcon={false} />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="text-slate-800 font-semibold mb-0.5">
                    {log.action}
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OfficerActivityLog;
