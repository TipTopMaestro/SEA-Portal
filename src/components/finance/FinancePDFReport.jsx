import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 72, // reserves space for fixed footer
    paddingHorizontal: 28,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },

  // Top Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#15803d',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 42,
    height: 42,
    objectFit: 'contain',
  },
  collegeName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#14532d',
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#15803d',
    marginTop: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    fontSize: 7,
    color: '#475569',
    lineHeight: 1.35,
  },

  // Report Titles
  titleBlock: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  orgSubheading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-BoldOblique',
    color: '#0f172a',
  },
  reportTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  eventSubtitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#334155',
    marginTop: 2,
  },

  // Ledger Table
  table: {
    width: '100%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#64748b',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#64748b',
    minHeight: 18,
    alignItems: 'stretch',
  },
  headerCellBase: {
    backgroundColor: '#f1f5f9',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#64748b',
    justifyContent: 'center',
  },
  cellBase: {
    fontSize: 8,
    paddingVertical: 3.5,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#64748b',
    justifyContent: 'center',
  },

  // Column Widths (sum = 100%)
  colDate: { width: '14%' },
  colParticulars: { width: '36%' },
  colOr: { width: '18%' },
  colQty: { width: '12%' },
  colAmount: { width: '20%', borderRightWidth: 0 },

  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },

  // Grand Total Row
  totalLabelCell: {
    width: '80%',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
  },
  totalLabelText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  totalValueCell: {
    width: '20%',
    paddingVertical: 5,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
  },
  totalValueText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },

  // Signatories
  signatoriesWrapper: {
    marginTop: 22,
  },
  sigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sigCol: {
    width: '31%',
  },
  sigHeading: {
    fontSize: 8,
    color: '#334155',
    marginBottom: 18, // signature space
  },
  sigName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  sigRole: {
    fontSize: 7.5,
    color: '#475569',
    marginTop: 1,
  },

  // Bottom Institutional Footer
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 28,
    right: 28,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#15803d',
    borderRadius: 2,
    overflow: 'hidden',
  },
  footerGreenSection: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 8,
  },
  footerCol: {
    flex: 1,
  },
  footerColTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  footerColBody: {
    fontSize: 5.8,
    color: '#dcfce7',
    lineHeight: 1.25,
  },
  footerBadges: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 4,
  },
  badgeImg: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
});

const formatAmount = (num) =>
  Number(num || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const DEFAULT_ITEMS = [
  { id: '1', date: '2026-11-10', particulars: 'Venue Audio-Visual & Projector Rental', orNumber: 'OR-88291', quantity: 1, amount: 4500.0 },
  { id: '2', date: '2026-11-11', particulars: 'Live Broadcast Stream License & Overlays', orNumber: 'OR-88304', quantity: 1, amount: 2200.0 },
  { id: '3', date: '2026-11-12', particulars: 'Participant Refreshments & Meals (80 pax)', orNumber: 'OR-88340', quantity: 80, amount: 3600.0 },
  { id: '4', date: '2026-11-12', particulars: 'Event Banners & Tarpaulin Decors', orNumber: 'OR-88355', quantity: 4, amount: 1450.0 },
  { id: '5', date: '2026-11-13', particulars: 'Logistics, Cable Management & Supplies', orNumber: 'OR-88372', quantity: 6, amount: 480.0 },
];

export default function FinancialReportPdf({
  orgName = 'DNSC - Student Esports Academy',
  reportTitle = 'FINANCIAL REPORT',
  eventTitle = 'M7 WATCH PARTY',
  items = [],
  grandTotal,
  signatories = {
    preparedBy: { name: 'BRYL JAMES B. PAGALAN', role: 'Executive Secretary' },
    reviewedBy: { name: 'HANNAH LEAH D. GUANTALAO', role: 'Finance Director' },
    notedBy: { name: 'VERNICK BOB GARCIA', role: 'Executive Director' },
    approvedBy: { name: 'JOHN RAE DURAN', role: 'Adviser' },
  },
  assets = {}, // { dnscLogo, bagongPilipinasLogo, isoSeal }
  disbursements = [],
  _inflows = [],
}) {
  // Determine table items: use items if provided, or map disbursements if provided, or fall back to DEFAULT_ITEMS
  const displayItems =
    items && items.length > 0
      ? items
      : disbursements && disbursements.length > 0
      ? disbursements.map((d, idx) => ({
          id: d.id || `disb-${idx}`,
          date: d.date || '2026-11-20',
          particulars: `${d.title} (${(d.category || 'Disbursement').toUpperCase()})`,
          orNumber: d.referenceNo || `OR-${String(idx + 1).padStart(5, '0')}`,
          quantity: 1,
          amount: Number(d.amount || 0),
        }))
      : DEFAULT_ITEMS;

  const computedTotal =
    grandTotal !== undefined
      ? grandTotal
      : displayItems.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  const resolvedSignatories = {
    preparedBy: {
      name: signatories?.preparedBy?.name || 'BRYL JAMES B. PAGALAN',
      role: signatories?.preparedBy?.role || 'Executive Secretary',
    },
    reviewedBy: {
      name: signatories?.reviewedBy?.name || 'HANNAH LEAH D. GUANTALAO',
      role: signatories?.reviewedBy?.role || 'Finance Director',
    },
    notedBy: {
      name: signatories?.notedBy?.name || 'VERNICK BOB GARCIA',
      role: signatories?.notedBy?.role || 'Executive Director',
    },
    approvedBy: {
      name: signatories?.approvedBy?.name || 'JOHN RAE DURAN',
      role: signatories?.approvedBy?.role || 'Adviser',
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 1. Letterhead */}
        <View style={styles.headerRow}>
          <View style={styles.brandLeft}>
            {assets.dnscLogo && <Image src={assets.dnscLogo} style={styles.logo} />}
            <View>
              <Text style={styles.collegeName}>DAVAO DEL NORTE</Text>
              <Text style={styles.collegeName}>STATE COLLEGE</Text>
              <Text style={styles.tagline}>"Inspiring Change, Creating Futures"</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text>president@dnsc.edu.ph</Text>
            <Text>dnsc.edu.ph</Text>
            <Text>New Visayas, Panabo City, 8105</Text>
          </View>
        </View>

        {/* 2. Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.orgSubheading}>{orgName}</Text>
          <Text style={styles.reportTitle}>{reportTitle}</Text>
          {eventTitle ? <Text style={styles.eventSubtitle}>{eventTitle}</Text> : null}
        </View>

        {/* 3. Ledger Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow} fixed>
            <View style={[styles.headerCellBase, styles.colDate]}>
              <Text style={styles.textCenter}>DATE</Text>
            </View>
            <View style={[styles.headerCellBase, styles.colParticulars]}>
              <Text style={styles.textCenter}>Particulars</Text>
            </View>
            <View style={[styles.headerCellBase, styles.colOr]}>
              <Text style={styles.textCenter}>OR Number</Text>
            </View>
            <View style={[styles.headerCellBase, styles.colQty]}>
              <Text style={styles.textCenter}>Quantity</Text>
            </View>
            <View style={[styles.headerCellBase, styles.colAmount]}>
              <Text style={styles.textCenter}>Amount</Text>
            </View>
          </View>

          {/* Table Data Rows */}
          {displayItems.map((item, idx) => (
            <View key={item.id || idx} style={styles.tableRow} wrap={false}>
              <View style={[styles.cellBase, styles.colDate]}>
                <Text style={styles.textCenter}>{item.date || ''}</Text>
              </View>
              <View style={[styles.cellBase, styles.colParticulars]}>
                <Text>{item.particulars || ''}</Text>
              </View>
              <View style={[styles.cellBase, styles.colOr]}>
                <Text style={styles.textCenter}>{item.orNumber || ''}</Text>
              </View>
              <View style={[styles.cellBase, styles.colQty]}>
                <Text style={styles.textCenter}>{item.quantity ?? ''}</Text>
              </View>
              <View style={[styles.cellBase, styles.colAmount]}>
                <Text style={styles.textRight}>
                  {item.amount !== undefined && item.amount !== null
                    ? formatAmount(item.amount)
                    : ''}
                </Text>
              </View>
            </View>
          ))}

          {/* Grand Total Row */}
          <View style={styles.tableRow} wrap={false}>
            <View style={styles.totalLabelCell}>
              <Text style={styles.totalLabelText}>Grand Total</Text>
            </View>
            <View style={styles.totalValueCell}>
              <Text style={styles.totalValueText}>{formatAmount(computedTotal)}</Text>
            </View>
          </View>
        </View>

        {/* 4. Signatories */}
        <View style={styles.signatoriesWrapper} wrap={false}>
          <View style={styles.sigRow}>
            <View style={styles.sigCol}>
              <Text style={styles.sigHeading}>Prepared by:</Text>
              <Text style={styles.sigName}>{resolvedSignatories.preparedBy?.name}</Text>
              <Text style={styles.sigRole}>{resolvedSignatories.preparedBy?.role}</Text>
            </View>
            <View style={styles.sigCol}>
              <Text style={styles.sigHeading}>Reviewed by:</Text>
              <Text style={styles.sigName}>{resolvedSignatories.reviewedBy?.name}</Text>
              <Text style={styles.sigRole}>{resolvedSignatories.reviewedBy?.role}</Text>
            </View>
            <View style={styles.sigCol}>
              <Text style={styles.sigHeading}>Noted by:</Text>
              <Text style={styles.sigName}>{resolvedSignatories.notedBy?.name}</Text>
              <Text style={styles.sigRole}>{resolvedSignatories.notedBy?.role}</Text>
            </View>
          </View>

          <View style={styles.sigRow}>
            <View style={styles.sigCol}>
              <Text style={styles.sigHeading}>Approved by:</Text>
              <Text style={styles.sigName}>{resolvedSignatories.approvedBy?.name}</Text>
              <Text style={styles.sigRole}>{resolvedSignatories.approvedBy?.role}</Text>
            </View>
          </View>
        </View>

        {/* 5. Institutional Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerGreenSection}>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>VISION</Text>
              <Text style={styles.footerColBody}>
                An institution leading in agri-fisheries and socio-cultural development in the ASEAN region.
              </Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>MISSION</Text>
              <Text style={styles.footerColBody}>
                DNSC shall produce future-ready workforce, create innovative solutions and technologies, empower communities, and uphold good governance.
              </Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>CORE VALUES</Text>
              <Text style={styles.footerColBody}>
                Stewardship • Adaptability and Excellence • Integrity and Innovativeness • Love of God and Country
              </Text>
            </View>
          </View>
          {(assets.bagongPilipinasLogo || assets.isoSeal) && (
            <View style={styles.footerBadges}>
              {assets.bagongPilipinasLogo && (
                <Image src={assets.bagongPilipinasLogo} style={styles.badgeImg} />
              )}
              {assets.isoSeal && <Image src={assets.isoSeal} style={styles.badgeImg} />}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// Named alias for interoperability
export { FinancialReportPdf, FinancialReportPdf as FinancePDFReport };
