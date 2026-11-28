import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { portalService } from '../../services/portalService';
import {
  Camera,
  ScanLine,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Only these roles handle attendance scanning
const SCANNER_ROLES = ['executive', 'game_manager'];

const QRScannerView = ({ activeEvents = [], onScanSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [inputToken, setInputToken] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Members (and finance officers) don't get the scanner
  if (!SCANNER_ROLES.includes(user?.role)) {
    return null;
  }

  const handleProcessScan = (tokenToScan) => {
    setErrorMsg('');
    try {
      const result = portalService.recordAttendanceScan(tokenToScan, user);
      setLastCheckIn(result);
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 3000);
      showToast(`Attendance verified for "${result.event.title}"!`, 'success');
      setInputToken('');
      if (onScanSuccess) onScanSuccess();
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleSimulateCameraDetection = () => {
    const active = activeEvents.find((e) => e.active) || activeEvents[0];
    if (!active) {
      showToast('No active scrimmage or event QR code found.', 'warning');
      return;
    }
    handleProcessScan(active.qrToken);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!inputToken.trim()) {
      showToast('Please enter or scan a valid QR token.', 'warning');
      return;
    }
    handleProcessScan(inputToken.trim());
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-4">
      {/* Mobile Scanner Viewfinder Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
              Mobile QR Check-In Scanner
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Scanner Active
          </span>
        </div>

        {/* Viewfinder Target Box */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-2xl bg-slate-50 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center overflow-hidden shadow-inner group">
          {/* Target Corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-blue-600" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-600" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-600" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-blue-600" />

          {/* Animated Laser Sweep Line */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-md shadow-blue-400 animate-radar pointer-events-none" />
          )}

          {/* Central Camera Simulator Icon */}
          <div className="p-4 rounded-full bg-white border border-slate-200 text-blue-600 mb-2 shadow-xs">
            <ScanLine className="w-8 h-8 animate-pulse text-blue-600" />
          </div>
          <p className="text-xs text-slate-800 font-display font-bold">
            Point Camera at Official QR
          </p>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            Auto-detects session token
          </span>
        </div>

        {/* One-Tap Instant Camera Simulation Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSimulateCameraDetection}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Simulate Optical QR Scan</span>
          </button>
        </div>

        {/* Fallback Manual Token Input */}
        <form onSubmit={handleManualSubmit} className="mt-3">
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">
            Or Enter Token Code Manually:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="e.g. NEXUS-ATT-SCRIM-..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-display uppercase tracking-wider transition-colors cursor-pointer border border-slate-200"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Verified Success Confirmation Card */}
      {lastCheckIn && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 text-emerald-900 shadow-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs font-bold font-display uppercase tracking-wider text-emerald-900">
                Attendance Recorded Successfully
              </span>
              <p className="text-[10px] text-emerald-700 font-mono">
                Verified at {lastCheckIn.record.scanTimestamp}
              </p>
            </div>
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900 font-display">
              {lastCheckIn.event.title}
            </div>
            <div className="text-[11px] text-slate-600">
              Student: {lastCheckIn.record.studentName} ({lastCheckIn.record.ign})
            </div>
            <div className="text-[10px] text-emerald-700 font-mono">
              Method: {lastCheckIn.record.scanMethod}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerView;