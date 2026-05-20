const router = require('express').Router();
const pool   = require('../db');
const { verifyToken, adminOnly } = require('../../middleware/auth');

// GET semua departemen (+ search)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let sql    = 'SELECT * FROM departments';
    const params = [];
    if (search) {
      sql += ' WHERE department_name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY department_id';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM departments WHERE department_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST — admin & user boleh
router.post('/', verifyToken, async (req, res) => {
  try {
    const { department_name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO departments (department_name) VALUES (?)',
      [department_name]
    );
    res.status(201).json({ department_id: result.insertId, department_name });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT — admin only
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { department_name } = req.body;
    await pool.execute(
      'UPDATE departments SET department_name = ? WHERE department_id = ?',
      [department_name, req.params.id]
    );
    res.json({ department_id: Number(req.params.id), department_name });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE — admin only
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM departments WHERE department_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Departemen berhasil dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;