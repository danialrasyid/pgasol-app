import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../utils/api';
import { pageStyles as styles } from '../utils/styles';
import logoPgasol from '../assets/logo.png';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return Swal.fire({ icon: 'warning', title: 'Form Kosong', text: 'Masukkan username dan password!' });
    }

    Swal.fire({
      title: 'Mendandatangani Sesi...',
      text: 'Harap tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await api.post('/auth/login', {
        username: form.username,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      
      Swal.close();
      navigate('/employees');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: err.response?.data?.message || 'Koneksi ke server terputus.'
      });
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginLogoWrapper}>
          <img src={logoPgasol} alt="Logo PGASOL" style={styles.loginLogo} />
        </div>

        <h3 style={styles.loginTitle}>PGASOL — Login</h3>

        <form onSubmit={handleLogin}>
          <input
            style={styles.loginInput}
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.loginInput}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button style={styles.loginButton} type="submit">Login</button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: '#888', textAlign: 'center' }}>
          Admin: admin / admin123 &nbsp;|&nbsp; User: user1 / user123
        </p>
      </div>
    </div>
  );
}