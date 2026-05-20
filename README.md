# PGASOL ICT SYSTEM — Aplikasi Manajemen Pengeluaran Karyawan

Aplikasi Web Full-Stack (Node.js Express + React Vite) yang dibangun khusus untuk memenuhi kriteria evaluasi seleksi **Programmer ICT di PT PGAS Solution**. Aplikasi ini berfungsi untuk mengelola data Departemen, Karyawan, dan mencatat transaksi Pengeluaran (*Spendings*) secara real-time dengan kendali hak akses (*Role-Based Access Control*), filter multi-opsi dinamis, serta fitur ekspor laporan mutakhir.

---

## 🚀 Fitur Utama Sistem

Sesuai dengan spesifikasi dokumen kebutuhan **Soal Test Programmer ICT PGASOL**, sistem ini mengimplementasikan:

1. **Autentikasi & Hak Akses (RBAC) Aman**:
   - **Admin**: Akses penuh untuk *Create, Read, Update, Delete* (CRUD) pada seluruh modul data.
   - **User**: Hanya diizinkan melakukan operasi *Create* dan *Read*. Aksi *Update* atau *Delete* akan diblokir otomatis di sisi Frontend & Backend menggunakan middleware pengaman.
2. **Arsitektur Pembersihan Kode (Clean & Modular Code)**:
   - Pemisahan total komponen logika, penanganan fungsi *utility* autentikasi, dan skema pemusatan visual objek *styles* CSS-in-JS.
   - Antarmuka sepenuhnya **Responsif** (Grid & Flexbox modern) yang adaptif di berbagai resolusi layar gawai (*mobile*) maupun komputer desktop.
3. **Fitur Filter Laporan Multi-Antarmuka**:
   - Filter taktis berbasis *Dropdown Preset Range* (Kecil, Sedang, Besar).
   - Filter fleksibel dengan *Slider Range* interaktif (0 s.d Rp 10.000.000).
   - Filter presisi dengan komponen *Input Angka* (Range nilai minimum dan maksimum).
4. **Fitur Ekspor Dokumen Resmi**:
   - Ekspor Laporan Pengeluaran dinamis tahun 2020—2026 ke format **Excel (.xlsx)** memanfaatkan *ExcelJS*.
   - Ekspor Laporan Pengeluaran dinamis tahun 2020—2026 ke format **PDF (.pdf)** memanfaatkan *PDFKit*.
5. **Umpan Balik Visual Modern**:
   - Integrasi **SweetAlert2** untuk menggantikan dialog bawaan browser (`alert()` dan `confirm()`) dengan transisi halus dan ramah pengguna.
   - Indikator *Loading State Skeleton* transparan pada tabel data sewaktu berinteraksi dengan API backend.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

### Backend (Server)
- **Runtime & Framework**: Node.js & Express.js
- **Database Driver**: `mysql2/promise` (Menerapkan **Bare Query** SQL String murni tanpa ORM)
- **Keamanan**: `jsonwebtoken` (JWT), `bcryptjs` (Hashing password), `cors` (Cross-Origin Resource Sharing)
- **Dokumentasi & Ekspor**: `exceljs`, `pdfkit`
- **Environment Tools**: `dotenv`, `nodemon` (Development monitoring)

### Frontend (Client UI)
- **Build Tool & Framework**: Vite & React.js (JavaScript XML)
- **Routing**: `react-router-dom` (Menggunakan *PrivateRoute* Guard)
- **HTTP Client**: `axios` (Menerapkan Interceptor Bearer Token otomatis)
- **Komponen Pop-up**: `sweetalert2`

---

## 📦 Panduan Instalasi & Menjalankan Proyek

Pastikan Anda sudah menginstal **Node.js** dan **MySQL Server** di perangkat komputer Anda sebelum memulai.

### 1. Kloning Repositori Proyek
```bash
git clone [https://github.com/danialrasyid/pgasol-app](https://github.com/danialrasyid/pgasol-app)
cd pgasol-app
