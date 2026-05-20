import { Link, useLocation } from 'react-router-dom';
import { getUsername, getRole, logout } from '../utils/auth';
import { pageStyles as styles } from '../utils/styles';
import logoPgasol from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.navBrandContainer}>
        <img src={logoPgasol} alt="PGASOL Logo" style={styles.navLogo} />
        <span style={styles.navBrandText}>ICT SYSTEM</span>
      </div>
      
      <div style={styles.navLinks}>
        <Link style={{...styles.navLink, ...(isActive('/employees') ? styles.navActiveLink : {})}} to="/employees">Karyawan</Link>
        <Link style={{...styles.navLink, ...(isActive('/departments') ? styles.navActiveLink : {})}} to="/departments">Departemen</Link>
        <Link style={{...styles.navLink, ...(isActive('/spendings') ? styles.navActiveLink : {})}} to="/spendings">Pengeluaran</Link>
        <Link style={{...styles.navLink, ...(isActive('/report') ? styles.navActiveLink : {})}} to="/report">Laporan</Link>
      </div>
      
      <div style={styles.navUserSection}>
        <span style={styles.navRoleBadge}>{getRole()?.toUpperCase()}</span>
        <span style={styles.navUsername}>{getUsername()}</span>
        <button onClick={logout} style={styles.navLogoutBtn}>Logout</button>
      </div>
    </nav>
  );
}