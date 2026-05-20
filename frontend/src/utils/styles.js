export const pageStyles = {
  container: { padding: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' },
  title: { fontSize: '22px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' },
  card: { background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '16px' },
  sectionTitle: { margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  gridForm: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' },
  gridFormAction: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff', color: '#334155', boxSizing: 'border-box' },
  tableResponsive: { width: '100%', overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '700px', textAlign: 'left' },
  thead: { background: '#1D4E89', color: '#fff' },
  th: { padding: '12px 16px', fontWeight: '600', fontSize: '14px' },
  td: { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
  trEven: { background: '#fff' },
  trOdd: { background: '#f8fafc' },
  noData: { textAlign: 'center', padding: '32px', color: '#94a3b8' },
  btnPrimary: { flexGrow: 1, padding: '10px 20px', background: '#1D4E89', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnSecondary: { padding: '10px 16px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnEdit: { marginRight: '8px', padding: '6px 14px', background: '#e6a817', color: '#000', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: '600', fontSize: '12px' },
  btnDelete: { padding: '6px 14px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '12px' },
  paginationRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' },
  pageBtn: { padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#1D4E89', fontWeight: '600' },
  pageBtnDisabled: { padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#94a3b8', cursor: 'not-allowed', fontSize: '13px' },
  pageInfo: { fontSize: '13px', color: '#475569' },
  
  // Login Styles - Diperbaiki agar presisi di tengah layar penuh
  loginContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#f8fafc', // Memberikan kontras abu-abu lembut di luar card
    margin: 0, 
    padding: 0, 
    boxSizing: 'border-box' 
  },
  loginCard: { 
    background: '#ffffff', 
    padding: '40px', 
    borderRadius: '12px', 
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
    width: '100%',
    maxWidth: '400px', // Pembatas lebar card maksimal yang ideal
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box'
  },
  loginLogoWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  loginLogo: { height: '80px', objectFit: 'contain' },
  loginTitle: { textAlign: 'center', marginBottom: '24px', color: '#1D4E89', fontWeight: '600', fontSize: '20px' },
  loginInput: { width: '100%', padding: '12px 14px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' },
  loginButton: { width: '100%', padding: '12px', background: '#1D4E89', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' },

  // Navbar Styles - Diperbaiki struktur alignment flexbox-nya
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1D4E89', padding: '0 24px', height: '64px', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', boxSizing: 'border-box' },
  navBrandContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogo: { height: '40px', objectFit: 'contain', backgroundColor: '#fff', padding: '4px', borderRadius: '6px' },
  navBrandText: { fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' },
  navLinks: { display: 'flex', gap: '4px', height: '100%', alignItems: 'center' },
  navLink: { color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s', fontWeight: '500' },
  navActiveLink: { background: '#13355F', color: '#ffffff', fontWeight: '600' },
  navUserSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  navUsername: { fontSize: '14px', fontWeight: '500', color: '#f1f5f9' },
  navRoleBadge: { background: '#e6a817', color: '#000', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 },
  navLogoutBtn: { background: 'transparent', border: '1px solid #cbd5e1', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s', fontWeight: '500' },

  // Report Specific Styles
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  filterLabel: { fontSize: '13px', fontWeight: '500', color: '#475569' },
  reportInput: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff', color: '#334155', height: '40px', boxSizing: 'border-box' },
  actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
  btnExportGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btnExcel: { display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: '#217346', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  btnPdf: { display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: '#c0392b', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  summaryBadge: { display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' },
  summaryDivider: { color: '#cbd5e1' },
  loadingTd: { textAlign: 'center', padding: '24px', color: '#1D4E89', fontWeight: '500' }
};