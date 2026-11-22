import React, { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import FinancialReportPdf from './FinancePDFReport';
import dnscLogo from '../../assets/dnscLogo.png';
import { Download, FileText, Receipt, Coins } from 'lucide-react';

const FinancePDFModal = ({
  isOpen,
  onClose,
  inflows = [],
  disbursements = [],
  currentOfficer = null
}) => {
  const [reportType, setReportType] = useState('disbursements'); // 'disbursements' | 'inflows'

  const mappedDisbursements = useMemo(
    () =>
      disbursements.map((d, idx) => ({
        id: d.id || `disb-${idx}`,
        date: d.date || '2026-11-20',
        particulars: `${d.title} (${(d.category || 'Disbursement').toUpperCase()})`,
        orNumber: d.referenceNo || `OR-${String(idx + 1).padStart(5, '0')}`,
        quantity: 1,
        amount: Number(d.amount || 0),
      })),
    [disbursements]
  );

  const mappedInflows = useMemo(
    () =>
      inflows.map((inf, idx) => ({
        id: inf.id || `inf-${idx}`,
        date: inf.date || '2026-11-18',
        particulars: `${inf.source} (${(inf.category || 'Inflow').toUpperCase()})`,
        orNumber: inf.referenceNo || `REC-${String(idx + 1).padStart(5, '0')}`,
        quantity: 1,
        amount: Number(inf.amount || 0),
      })),
    [inflows]
  );

  const reportConfig = useMemo(() => {
    switch (reportType) {
      case 'inflows':
        return {
          title: 'TREASURY INFLOW REPORT',
          eventTitle: 'COLLEGIATE CASH INFLOWS & DUES',
          items: mappedInflows,
          fileName: `DNSC_Esports_Inflows_${new Date().toISOString().split('T')[0]}.pdf`,
        };
      case 'disbursements':
      default:
        return {
          title: 'FINANCIAL REPORT',
          eventTitle: 'DISBURSEMENT VOUCHERS LEDGER',
          items: mappedDisbursements,
          fileName: `DNSC_Esports_Disbursements_${new Date().toISOString().split('T')[0]}.pdf`,
        };
    }
  }, [reportType, mappedDisbursements, mappedInflows]);

  if (!isOpen) return null;

  const doc = (
    <FinancialReportPdf
      orgName="DNSC - Student Esports Academy"
      reportTitle={reportConfig.title}
      eventTitle={reportConfig.eventTitle}
      items={reportConfig.items}
      assets={{ dnscLogo }}
      signatories={{
        preparedBy: {
          name: currentOfficer?.name || 'BRYL JAMES B. PAGALAN',
          role: currentOfficer?.title || 'Executive Secretary',
        },
        reviewedBy: {
          name: 'HANNAH LEAH D. GUANTALAO',
          role: 'Finance Director',
        },
        notedBy: {
          name: 'VERNICK BOB GARCIA',
          role: 'Executive Director',
        },
        approvedBy: {
          name: 'JOHN RAE DURAN',
          role: 'Adviser',
        },
      }}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official DNSC Financial Statement & Audit Report"
      subtitle="Institutional ledger format featuring Davao del Norte State College letterhead, signatories & footer"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Report Type Selector & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setReportType('disbursements')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display tracking-wider uppercase transition-all cursor-pointer ${
                reportType === 'disbursements'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Disbursement Vouchers</span>
            </button>

            <button
              type="button"
              onClick={() => setReportType('inflows')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display tracking-wider uppercase transition-all cursor-pointer ${
                reportType === 'inflows'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Cash Inflows & Dues</span>
            </button>
          </div>

          {/* Download Button */}
          <PDFDownloadLink
            document={doc}
            fileName={reportConfig.fileName}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-semibold font-display tracking-wider uppercase text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {({ loading }) => (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{loading ? 'Compiling PDF...' : 'Download Official PDF'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>

        {/* Current Document Subtitle Bar */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">
              {reportConfig.eventTitle} • {reportConfig.items.length} Recorded Entries
            </span>
          </div>
          <span className="text-[11px] text-slate-400">DNSC Institutional Format • A4 Layout</span>
        </div>

        {/* PDF Viewer Container */}
        <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
          <PDFViewer
            key={reportType}
            width="100%"
            height="100%"
            showToolbar={true}
            className="w-full h-full border-0"
          >
            {doc}
          </PDFViewer>
        </div>

        {/* Modal Footer Notes */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>* Includes institutional letterhead, ledger table, signatories & vision-mission footer</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-sans cursor-pointer font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FinancePDFModal;
