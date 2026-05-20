import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { checkAdminAction } from '../utils/auth';
import { pageStyles as styles } from '../utils/styles';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [searchDept, setSearchDept] = useState('');
  const [form, setForm]           = useState({ department_name: '' });
  const [editId, setEditId]       = useState(null);
  const [loading, setLoading]     = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments', { params: { search: searchDept } });
      setDepartments(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [searchDept]);

  const handleSubmit = async () => {
    if (!form.department_name) {
      return Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Nama departemen tidak boleh kosong!' });
    }
    
    try {
      if (editId) {
        await api.put(`/departments/${editId}`, form);
        setEditId(null);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Nama departemen berhasil diubah!', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/departments', form);
        Swal.fire({ icon: 'success', title: 'Sukses', text: 'Departemen baru berhasil disimpan!', timer: 1500, showConfirmButton: false });
      }
      setForm({ department_name: '' });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kegagalan memproses data.' });
    }
  };

  const handleEdit = (dept) => {
    if (!checkAdminAction()) return;
    setEditId(dept.department_id);
    setForm({ department_name: dept.department_name });
  };

  const handleDelete = async (id) => {
    if (!checkAdminAction()) return;
    
    Swal.fire({
      title: 'Hapus Departemen?',
      text: "Seluruh relasi data karyawan pada departemen ini mungkin akan terdampak!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/departments/${id}`);
          Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Departemen berhasil dihapus.', timer: 1500, showConfirmButton: false });
          fetchData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus data departemen.' });
        }
      }
    });
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(departments.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Manajemen Data Departemen</h2>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Pencarian Departemen</h4>
          <input style={styles.input} placeholder="Masukkan nama departemen..." value={searchDept} onChange={e => setSearchDept(e.target.value)} />
        </div>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>{editId ? 'Ubah Nama Departemen' : 'Tambah Departemen Baru'}</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input style={{...styles.input, flex: 1, minWidth: '250px'}} placeholder="Nama Departemen" value={form.department_name} onChange={e => setForm({ department_name: e.target.value })} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={styles.btnPrimary} onClick={handleSubmit}>{editId ? 'Update' : 'Simpan'}</button>
              {editId && <button style={styles.btnSecondary} onClick={() => { setEditId(null); setForm({ department_name: '' }); }}>Batal</button>}
            </div>
          </div>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={{...styles.th, width: '80px'}}>No</th>
                <th style={styles.th}>Nama Departemen</th>
                <th style={{...styles.th, width: '200px', textAlign: 'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} style={styles.loadingTd}>Sedang memuat data departemen...</td></tr>
              ) : currentItems.map((d, i) => (
                <tr key={d.department_id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{indexOfFirstItem + i + 1}</td>
                  <td style={styles.td}>{d.department_name}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(d)}>Edit</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(d.department_id)}>Hapus</button>
                  </td>
                </tr>
              ))}
              {!loading && departments.length === 0 && <tr><td colSpan={3} style={styles.noData}>Tidak ada data departemen</td></tr>}
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