import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10
  },
  orgTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    letterSpacing: 0.5
  },
  docTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginTop: 3,
    textTransform: 'uppercase'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    fontSize: 8,
    color: '#64748b'
  },
  summaryGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: 6
  },
  summaryLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase'
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 6
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 14
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#475569'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    fontSize: 8,
    color: '#334155'
  },
  tableRowAlt: {
    backgroundColor: '#fafafa'
  },
  colDesc: { flex: 3 },
  colCategory: { flex: 2 },
  colRef: { flex: 1.8 },
  colDate: { flex: 1.2 },
  colStatus: { flex: 1.5 },
  colAmount: { flex: 1.5, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10
  },
  signBlock: {
    width: 170,
    textAlign: 'center'
  },
  signLine: {
    borderTopWidth: 1,
    borderTopColor: '#0f172a',
    marginTop: 35,
    paddingTop: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a'
  },
  signRole: {
    fontSize: 7,
    color: '#64748b'
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6
  }
});

const FinancePDFReport = ({
  inflows = [],
  disbursements = [],
  currentOfficer = null
}) => {
  const totalInflows = inflows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalDisbursed = disbursements
    .filter((d) => d.status === 'disbursed')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const netBalance = totalInflows - totalDisbursed;
  const pendingCount = disbursements.filter(
    (d) => d.status === 'submitted' || d.status === 'finance_approved'
  ).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document title="DNSC_Esports_Academy_Finance_Report.pdf" author="NexusSEA Finance Portal">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.orgTitle}>DNSC STUDENT ESPORTS ACADEMY</Text>
          <Text style={styles.docTitle}>Official Financial Statement & Treasury Audit Report</Text>
          <View style={styles.metaRow}>
            <Text>System: NexusSEA Management Portal v2.0</Text>
            <Text>Report Generated: {currentDate}</Text>
            <Text>Auditor: {currentOfficer?.name || 'Gabriel Tan (Finance Director)'}</Text>
          </View>
        </View>

        {/* Executive Summary Metrics */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net Treasury Balance</Text>
            <Text style={styles.summaryValue}>
              PHP {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Cash Inflows</Text>
            <Text style={styles.summaryValue}>
              PHP {totalInflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Disbursed Expenses</Text>
            <Text style={styles.summaryValue}>
              PHP {totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Vouchers in Review</Text>
            <Text style={styles.summaryValue}>{pendingCount} Pending</Text>
          </View>
        </View>

        {/* Section 1: Cash Inflows Table */}
        <Text style={styles.sectionTitle}>1. Organization Cash Inflows Ledger</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Source & Purpose</Text>
            <Text style={styles.colCategory}>Category</Text>
            <Text style={styles.colRef}>Channel / Ref #</Text>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colAmount}>Amount (PHP)</Text>
          </View>
          {inflows.slice(0, 7).map((inf, i) => (
            <View key={inf.id || i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={styles.colDesc}>{inf.source}</Text>
              <Text style={styles.colCategory}>{inf.category}</Text>
              <Text style={styles.colRef}>{inf.referenceNo || inf.paymentMethod}</Text>
              <Text style={styles.colDate}>{inf.date}</Text>
              <Text style={styles.colAmount}>
                +{Number(inf.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Section 2: Disbursement Vouchers Table */}
        <Text style={styles.sectionTitle}>2. Operating Expenses & Disbursement Vouchers</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Expense Voucher Title</Text>
            <Text style={styles.colCategory}>Category</Text>
            <Text style={styles.colStatus}>Approval Status</Text>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colAmount}>Amount (PHP)</Text>
          </View>
          {disbursements.slice(0, 7).map((d, i) => (
            <View key={d.id || i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={styles.colDesc}>{d.title}</Text>
              <Text style={styles.colCategory}>{d.category}</Text>
              <Text style={styles.colStatus}>{d.status.toUpperCase()}</Text>
              <Text style={styles.colDate}>{d.requestDate}</Text>
              <Text style={styles.colAmount}>
                {Number(d.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Certification / Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signBlock}>
            <View style={styles.signLine}>
              <Text>Gabriel Tan</Text>
            </View>
            <Text style={styles.signRole}>Director of Finance & Treasury</Text>
          </View>

          <View style={styles.signBlock}>
            <View style={styles.signLine}>
              <Text>Marcus Reyes</Text>
            </View>
            <Text style={styles.signRole}>Executive President, DNSC Esports</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This financial audit report is computer-generated by NexusSEA and recognized as the official treasury statement of DNSC Student Esports Academy. Page 1 of 1
        </Text>
      </Page>
    </Document>
  );
};

export default FinancePDFReport;
