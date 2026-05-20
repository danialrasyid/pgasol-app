const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // 1. Cek pertama lewat header Bearer Token
  let token = authHeader && authHeader.split(' ')[1];
  
  // 2. Jika di header tidak ada (seperti kasus klik link export), cek lewat query string URL
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'pgasol_jwt_secret_2026_fallback');
    next();
  } catch {
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.'
    });
  }
  next();
};

module.exports = { verifyToken, adminOnly };