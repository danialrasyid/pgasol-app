import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { checkAdminAction } from '../utils/auth';
import { pageStyles as styles } from '../utils/styles';

export default function SpendingsPage() {
  const [spendings, setSpendings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchEmp, setSearchEmp] = useState('');
  const [searchDept,setSearchDept]= useState('');
  const [form, setForm]     = useState({ employee_id: '', spending_date: '', value: '' });
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSpendings = async () => {
    const res = await api.get('/spendings', {
      params: { search_emp: searchEmp, search_dept: searchDept }
    });
    setSpendings(res.data);
    setCurrentPage(1);
  };

  useEffect(() => {
    api.get('/employees').then(r => setEmployees(r.data));
    fetchSpendings();
  }, []);
  useEffect(() => { fetchSpendings(); }, [searchEmp, searchDept]);

  const handleSubmit = async () => {
    if (!form.employee_id || !form.spending_date || !form.value) {
      return Swal.fire({ icon: 'warning', title: 'Form Kosong', text: 'Harap melengkapi kolom input transaksi!' });
    }
    
    try {
      if (editId) {
        await api.put(`/spendings/${editId}`, form);
        setEditId(null);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data transaksi berhasil diupdate!', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/spendings', form);
        Swal.fire({ icon: 'success', title: 'Sukses', text: 'Data pengeluaran berhasil disimpan!', timer: 1500, showConfirmButton: false });
      }
      setForm({ employee_id: '', spending_date: '', value: '' });
      fetchSpendings();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', text: err.response?.data?.message || 'Sistem database sibuk.' });
    }
  };

  const handleEdit = (s) => {
    if (!checkAdminAction()) return;
    setEditId(s.spending_id);
    setForm({
      employee_id:   s.employee_id,
      spending_date: s.spending_date?.split('T')[0],
      value:         s.value
    });
  };

  const handleDelete = async (id) => {
    if (!checkAdminAction()) return;
    
    Swal.fire({
      title: 'Hapus data transaksi?',
      text: "Catatan transaksi keuangan terpilih akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus Data',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/spendings/${id}`);
          Swal.fire({ icon: 'success', title: 'Sukses', text: 'Catatan transaksi telah dihapus.', timer: 1500, showConfirmButton: false });
          fetchSpendings();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengeksekusi perintah hapus.' });
        }
      }
    });
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = spendings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(spendings.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Manajemen Data Pengeluaran</h2>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Filter & Pencarian</h4>
          <div style={styles.gridForm}>
            <input placeholder="Cari karyawan..." value={searchEmp} onChange={e => setSearchEmp(e.target.value)} style={styles.input} />
            <input placeholder="Cari departemen..." value={searchDept} onChange={e => setSearchDept(e.target.value)} style={styles.input} />
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>{editId ? 'Ubah Data Transaksi' : 'Tambah Transaksi Baru'}</h4>
          <div style={styles.gridFormAction}>
            <select value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} style={styles.input}>
              <option value="">-- Pilih Karyawan --</option>
              {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
            </select>
            <input type="date" value={form.spending_date} onChange={e => setForm({ ...form, spending_date: e.target.value })} style={styles.input} />
            <input type="number" placeholder="Nilai (Rp)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} style={styles.input} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSubmit} style={styles.btnPrimary}>{editId ? 'Update' : 'Simpan'}</button>
              {editId && <button onClick={() => { setEditId(null); setForm({ employee_id: '', spending_date: '', value: '' }); }} style={styles.btnSecondary}>Batal</button>}
            </div>
          </div>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={{...styles.th, width: '60px'}}>No</th>
                <th style={styles.th}>Nama Karyawan</th>
                <th style={styles.th}>Departemen</th>
                <th style={styles.th}>Tanggal</th>
                <th style={{...styles.th, textAlign: 'right'}}>Nilai (Rp)</th>
                <th style={{...styles.th, width: '160px', textAlign: 'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((s, i) => (
                <tr key={s.spending_id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{indexOfFirstItem + i + 1}</td>
                  <td style={styles.td}>{s.employee_name}</td>
                  <td style={styles.td}>{s.department_name}</td>
                  <td style={styles.td}>{s.spending_date?.split('T')[0]}</td>
                  <td style={{...styles.td, textAlign: 'right', fontWeight: '600', color: '#0f172a'}}>{Number(s.value).toLocaleString('id-ID')}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button onClick={() => handleEdit(s)} style={styles.btnEdit}>Edit</button>
                    <button onClick={() => handleDelete(s.spending_id)} style={styles.btnDelete}>Hapus</button>
                  </td>
                </tr>
              ))}
              {spendings.length === 0 && <tr><td colSpan={6} style={styles.noData}>Tidak ada catatan transaksi</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={styles.paginationRow}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}>Sebelumnya</button>
            <span style={styles.pageInfo}>Halaman <strong>{currentPage}</strong> dari {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={currentPage === totalPages ? styles.pageBtnDisabled : styles.pageBtn}>Selanjutnya</button>
          </div>
        )}
      </div>
    </>
  );
}