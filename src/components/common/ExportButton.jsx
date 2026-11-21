import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { useNotification } from '../../context/NotificationContext';

const ExportButton = ({ data, filename = 'nexus_export', label = 'Export CSV' }) => {
  const [downloading, setDownloading] = useState(false);
  const { showToast } = useNotification();

  const handleExport = () => {
    if (!data || data.length === 0) {
      showToast('No data available to export.', 'warning');
      return;
    }

    setDownloading(true);
    setTimeout(() => {
      portalService.exportToCSV(filename, data);
      showToast(`Exported ${data.length} records to ${filename}.csv`, 'success');
      setDownloading(false);
    }, 400);
  };

  return (
    <button
      onClick={handleExport}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider font-display bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 cursor-pointer"
    >
      {downloading ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
      ) : (
        <Download className="w-3.5 h-3.5 text-blue-600" />
      )}
      <span>{downloading ? 'Exporting...' : label}</span>
    </button>
  );
};

export default ExportButton;
