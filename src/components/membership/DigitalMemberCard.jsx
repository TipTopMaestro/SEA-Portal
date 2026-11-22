import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import RoleBadge from '../common/RoleBadge';
import StatusBadge from '../common/StatusBadge';
import dnscLogo from '../../assets/dnscLogo.png';
import { Sparkles, Hash, Calendar } from 'lucide-react';

const DigitalMemberCard = ({ user }) => {
  if (!user) return null;

  const cardPayload = JSON.stringify({
    studentId: user.studentId,
    name: user.name,
    ign: user.ign,
    role: user.role,
    duesStatus: user.duesStatus,
    academy: 'DNSC Esports Academy',
  });

  return (
    <div className="relative group max-w-md w-full mx-auto">
      {/* Background Animated Blue Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />

      {/* Main Esports ID Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 shadow-xl overflow-hidden text-slate-800">
        {/* Holographic Watermark Pattern */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-xs">
              <img src={dnscLogo} alt="DNSC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider font-display text-slate-900">
                DNSC ESPORTS ACADEMY
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                OFFICIAL DIGITAL VARSITY PASS
              </p>
            </div>
          </div>
          <StatusBadge status={user.duesStatus} />
        </div>

        {/* Card Body */}
        <div className="py-5 flex items-center gap-5">
          {/* Avatar with Ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 shadow-md">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.ign}`}
                alt={user.name}
                className="w-full h-full rounded-[14px] object-cover bg-slate-50"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-slate-200 text-blue-600 shadow-xs">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-mono text-blue-600 font-semibold uppercase tracking-wider">
              {user.title || 'Academy Member'}
            </div>
            <h3 className="text-xl font-black text-slate-900 font-display tracking-wide truncate">
              {user.ign}
            </h3>
            <p className="text-xs text-slate-600 font-medium truncate">
              {user.name}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
              <RoleBadge role={user.role} size="xs" />
            </div>
          </div>
        </div>

        {/* Card Footer: Metadata & Verification QR */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              <Hash className="w-3 h-3 text-slate-400" />
              <span>ID: <strong className="text-slate-800">{user.studentId}</strong></span>
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
              {user.program}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
              <Calendar className="w-3 h-3" />
              <span>Joined: {user.joinedDate || '2024-09-01'}</span>
            </div>
          </div>

          {/* Verified QR Code */}
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs shrink-0">
            <QRCodeSVG
              value={cardPayload}
              size={64}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMemberCard;
