import Swal from 'sweetalert2';

export const getRole     = () => localStorage.getItem('role');
export const isAdmin     = () => getRole() === 'admin';
export const getUsername = () => localStorage.getItem('username');

export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

// Menampilkan alert error SweetAlert jika peran bukan Admin
export const checkAdminAction = () => {
  if (!isAdmin()) {
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak',
      text: 'Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.',
      confirmButtonColor: '#1D4E89'
    });
    return false;
  }
  return true;
};