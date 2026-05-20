import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { checkAdminAction } from '../utils/auth';
import { pageStyles as styles } from '../utils/styles';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [depts,     setDepts]     = useState([]);
  const [searchEmp, setSearchEmp] = useState('');
  const [searchDept,setSearchDept]= useState('');
  const [form, setForm]           = useState({ employee_name: '', department_id: '' });
  const [editId, setEditId]       = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    const res = await api.get('/employees', {
      params: { search_emp: searchEmp, search_dept: searchDept }
    });
    setEmployees(res.data);
    setCurrentPage(1);
  };

  const fetchDepts = async () => {
    const res = await api.get('/departments');
    setDepts(res.data);
  };

  useEffect(() => { fetchData(); fetchDepts(); }, []);
  useEffect(() => { fetchData(); }, [searchEmp, searchDept]);

  const handleSubmit = async () => {
    if (!form.employee_name || !form.department_id) {
      return Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Lengkapi seluruh isi form!' });
    }
    
    try {
      if (editId) {
        await api.put(`/employees/${editId}`, form);
        setEditId(null);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data karyawan berhasil diperbarui!', timer: 1500, showConfirmButton: false });
      } else {
        await api.post('/employees', form);
        Swal.fire({ icon: 'success', title: 'Sukses', text: 'Karyawan baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false });
      }
      setForm({ employee_name: '', department_id: '' });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Terjadi kesalahan sistem' });
    }
  };

  const handleEdit = (emp) => {
    if (!checkAdminAction()) return;
    setEditId(emp.employee_id);
    setForm({ employee_name: emp.employee_name, department_id: emp.department_id });
  };

  const handleDelete = async (id) => {
    if (!checkAdminAction()) return;
    
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data karyawan yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/employees/${id}`);
          Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Data karyawan berhasil dihapus.', timer: 1500, showConfirmButton: false });
          fetchData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus data.' });
        }
      }
    });
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(employees.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Manajemen Data Karyawan</h2>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Pencarian Data</h4>
          <div style={styles.gridForm}>
            <input style={styles.input} placeholder="Cari nama karyawan..." value={searchEmp} onChange={e => setSearchEmp(e.target.value)} />
            <input style={styles.input} placeholder="Cari departemen..." value={searchDept} onChange={e => setSearchDept(e.target.value)} />
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>{editId ? 'Ubah Data Karyawan' : 'Tambah Karyawan Baru'}</h4>
          <div style={styles.gridFormAction}>
            <input style={styles.input} placeholder="Nama Karyawan" value={form.employee_name} onChange={e => setForm({ ...form, employee_name: e.target.value })} />
            <select style={styles.input} value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
              <option value="">-- Pilih Departemen --</option>
              {depts.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={styles.btnPrimary} onClick={handleSubmit}>{editId ? 'Update' : 'Simpan'}</button>
              {editId && <button style={styles.btnSecondary} onClick={() => { setEditId(null); setForm({ employee_name: '', department_id: '' }); }}>Batal</button>}
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
                <th style={{...styles.th, width: '180px', textAlign: 'center'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((e, i) => (
                <tr key={e.employee_id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{indexOfFirstItem + i + 1}</td>
                  <td style={styles.td}>{e.employee_name}</td>
                  <td style={styles.td}>{e.department_name}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(e)}>Edit</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(e.employee_id)}>Hapus</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && <tr><td colSpan={4} style={styles.noData}>Tidak ada data karyawan</td></tr>}
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