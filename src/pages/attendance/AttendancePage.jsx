import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import QRGeneratorModal from '../../components/attendance/QRGeneratorModal';
import QRScannerView from '../../components/attendance/QRScannerView';
import RoleBadge from '../../components/common/RoleBadge';
import StatCard from '../../components/common/StatCard';
import ExportButton from '../../components/common/ExportButton';
import {
  QrCode,
  Calendar,
  Users,
  Search,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

const AttendancePage = () => {
  const { role, ROLES } = useAuth();
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState(
    role === ROLES.MEMBER ? 'scanner' : 'events'
  );
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const canHostEvents = role === ROLES.GAME_MANAGER || role === ROLES.EXECUTIVE;

  const loadData = () => {
    setEvents(portalService.getAttendanceEvents());
    setRecords(portalService.getAttendanceRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats
  const totalScans = records.length;
  const activeEventsCount = events.filter((e) => e.active).length;
  const scrimmageScans = records.filter((r) =>
    r.eventTitle.toLowerCase().includes('scrimmage')
  ).length;

  const filteredRecords = records.filter((r) => {
    const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter;
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.ign.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
              Module 4 • Live Attendance
            </span>
            <RoleBadge role={role} size="xs" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            QR-Code Attendance & Scrimmage Check-In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Mobile-first real-time attendance verification for academy scrimmages, campus booths, and assemblies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canHostEvents && (
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold uppercase tracking-wider font-display shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Host QR Session</span>
            </button>
          )}
          <ExportButton data={records} filename="attendance_records_log" label="Export Logs" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Attendee Check-Ins"
          value={totalScans}
          subtitle="Real-time records"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Live Sessions"
          value={activeEventsCount}
          subtitle="Open for scans"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Scrimmage Check-Ins"
          value={scrimmageScans}
          subtitle="Varsity practices"
          icon={CheckCircle2}
          color="purple"
        />
        <StatCard
          title="Total Events Hosted"
          value={events.length}
          subtitle="Booths, scrims & assemblies"
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Tab Navigation (Scanner vs Events vs Logs) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Scanner (Member)</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Active QR Sessions ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase font-display tracking-wider transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Attendance Log ({records.length})</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'scanner' && (
        <div className="py-2">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Mobile-First Attendance Scanner
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Optimized for mobile viewports. Scan the dynamic time-bound QR code presented by officers.
            </p>
          </div>

          <QRScannerView
            activeEvents={events}
            onScanSuccess={loadData}
          />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((evt) => {
            const count = records.filter((r) => r.eventId === evt.id).length;
            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all duration-300 group shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      {evt.type}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase font-mono ${
                        evt.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {evt.active ? 'Active • Scanning' : 'Session Closed'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-display mb-1">
                    {evt.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Host: <strong className="text-slate-800">{evt.createdBy}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">
                      Check-Ins
                    </span>
                    <span className="text-base font-bold text-blue-600 font-display">
                      {count} / {evt.expectedAttendees}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold font-display uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                  >
                    Scan Code
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Real-Time Attendance Audit Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Timestamped records with optical scan validation and student identification.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search attendee, IGN, ID..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-56"
                />
              </div>

              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
              >
                <option value="all">All Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-display uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold">Attendee / Student</th>
                  <th className="py-3 px-4 font-bold">Student ID</th>
                  <th className="py-3 px-4 font-bold">Event Name</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Verification Method</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No attendance scans recorded for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-display">
                        {rec.studentName}{' '}
                        <span className="text-blue-600 font-normal">[{rec.ign}]</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {rec.studentId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                        {rec.eventTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {rec.scanTimestamp}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono border border-slate-200">
                          {rec.scanMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Present</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Officer QR Generator Modal */}
      <QRGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onCreated={loadData}
      />
    </div>
  );
};

export default AttendancePage;
