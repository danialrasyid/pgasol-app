import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { pageStyles as styles } from '../utils/styles';

export default function ReportPage() {
  const [data,     setData]     = useState([]);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [rangePreset, setRangePreset] = useState('');
  const [loading, setLoading]     = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/report', {
        params: {
          min_value: minValue || undefined,
          max_value: maxValue || undefined,
        }
      });
      setData(res.data);
      setCurrentPage(1);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mengunduh ringkasan data laporan.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const handlePresetChange = (e) => {
    const val = e.target.value;
    setRangePreset(val);
    if (val === 'low') { setMinValue('0'); setMaxValue('1000000'); }
    else if (val === 'mid') { setMinValue('1000000'); setMaxValue('5000000'); }
    else if (val === 'high') { setMinValue('5000000'); setMaxValue('999999999'); }
    else { setMinValue(''); setMaxValue(''); }
  };

  const triggerExportNotification = (type) => {
    Swal.fire({
      icon: 'info',
      title: 'Memproses Dokumen',
      text: `File laporan berkas ${type.toUpperCase()} sedang diunduh oleh mesin browser anda.`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const getExportUrl = (type) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (minValue) params.append('min_value', minValue);
    if (maxValue) params.append('max_value', maxValue);
    params.append('token', token);
    return `http://localhost:5001/api/report/export/${type}?${params}`;
  };

  const total = data.reduce((sum, r) => sum + Number(r.value), 0);
  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Laporan Pengeluaran</h2>

        <div style={styles.card}>
          <h4 style={styles.sectionTitle}>Filter Nilai Pengeluaran</h4>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Pilihan Cepat:</label>
              <select value={rangePreset} onChange={handlePresetChange} style={styles.reportInput}>
                <option value="">-- Semua Range --</option>
                <option value="low">Kecil (≤ Rp 1.000.000)</option>
                <option value="mid">Sedang (Rp 1.000.000 - Rp 5.000.000)</option>
                <option value="high">Besar (&gt; Rp 5.000.000)</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min (Rp):</label>
              <input type="number" value={minValue} placeholder="0" onChange={e => { setMinValue(e.target.value); setRangePreset(''); }} style={styles.reportInput} />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max (Rp):</label>
              <input type="number" value={maxValue} placeholder="999999999" onChange={e => { setMaxValue(e.target.value); setRangePreset(''); }} style={styles.reportInput} />
            </div>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Slider (0 — 10jt):</label>
              <input type="range" min="0" max="10000000" step="100000" value={minValue || 0} onChange={e => { setMinValue(e.target.value); setRangePreset(''); }} style={{ ...styles.reportInput, padding: 0, cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={fetchReport} style={styles.btnPrimary}>Terapkan Filter</button>
          </div>
        </div>

        <div style={styles.actionRow}>
          <div style={styles.btnExportGroup}>
            <a href={getExportUrl('excel')} onClick={() => triggerExportNotification('excel')} target="_blank" rel="noreferrer" style={styles.btnExcel}>⬇ Export Excel (.xlsx)</a>
            <a href={getExportUrl('pdf')} onClick={() => triggerExportNotification('pdf')} target="_blank" rel="noreferrer" style={styles.btnPdf}>⬇ Export PDF (.pdf)</a>
          </div>
          <div style={styles.summaryBadge}>
            <span>Total Data: <strong>{data.length}</strong></span>
            <span style={styles.summaryDivider}>|</span>
            <span>Total Nilai: <strong style={{ color: '#0f172a' }}>Rp {total.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={{ ...styles.th, width: '60px' }}>No</th>
                <th style={styles.th}>Nama Karyawan</th>
                <th style={styles.th}>Departemen</th>
                <th style={styles.th}>Tanggal</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Nilai (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={styles.loadingTd}>Sedang menyusun baris laporan keuangan...</td></tr>
              ) : currentItems.map((r, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{indexOfFirstItem + i + 1}</td>
                  <td style={styles.td}>{r.employee_name}</td>
                  <td style={styles.td}>{r.department_name}</td>
                  <td style={styles.td}>{r.spending_date ? new Date(r.spending_date).toLocaleDateString('id-ID') : '-'}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>{Number(r.value).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {!loading && data.length === 0 && <tr><td colSpan={5} style={styles.noData}>Tidak ada catatan data pengeluaran</td></tr>}
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