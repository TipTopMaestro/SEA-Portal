import React from 'react';
import Modal from '../common/Modal';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import FinancePDFReport from './FinancePDFReport';
import { Download, FileText } from 'lucide-react';

const FinancePDFModal = ({
  isOpen,
  onClose,
  inflows = [],
  disbursements = [],
  currentOfficer = null
}) => {
  if (!isOpen) return null;

  const doc = (
    <FinancePDFReport
      inflows={inflows}
      disbursements={disbursements}
      currentOfficer={currentOfficer}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Finance Statement & Audit Report"
      subtitle="Interactive PDF viewer powered by @react-pdf/renderer for collegiate audit presentation"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="font-semibold font-display uppercase tracking-wider">
              Document: DNSC_Esports_Academy_Finance_Report.pdf
            </span>
          </div>

          <PDFDownloadLink
            document={doc}
            fileName={`DNSC_Esports_Finance_Report_${new Date().toISOString().split('T')[0]}.pdf`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-xs transition-all cursor-pointer"
          >
            {({ loading }) => (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{loading ? 'Preparing PDF...' : 'Download PDF File'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>

        {/* PDF Viewer Container */}
        <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
          <PDFViewer
            width="100%"
            height="100%"
            showToolbar={true}
            className="w-full h-full border-0"
          >
            {doc}
          </PDFViewer>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>* Official document certified for DNSC Student Affairs & Organization audits</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-sans cursor-pointer font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FinancePDFModal;
