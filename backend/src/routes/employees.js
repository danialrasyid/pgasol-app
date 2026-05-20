const router = require('express').Router();
const pool   = require('../db');
const { verifyToken, adminOnly } = require('../../middleware/auth');

// GET semua (+ search by nama atau departemen)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search_emp, search_dept } = req.query;
    let sql = `
      SELECT e.employee_id, e.employee_name,
             d.department_id, d.department_name
      FROM employees e
      JOIN departments d ON e.department_id = d.department_id
      WHERE 1=1
    `;
    const params = [];
    if (search_emp) {
      sql += ' AND e.employee_name LIKE ?';
      params.push(`%${search_emp}%`);
    }
    if (search_dept) {
      sql += ' AND d.department_name LIKE ?';
      params.push(`%${search_dept}%`);
    }
    sql += ' ORDER BY e.employee_id';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, d.department_name
       FROM employees e
       JOIN departments d ON e.department_id = d.department_id
       WHERE e.employee_id = ?`,
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST — admin & user boleh
router.post('/', verifyToken, async (req, res) => {
  try {
    const { employee_name, department_id } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO employees (employee_name, department_id) VALUES (?, ?)',
      [employee_name, department_id]
    );
    res.status(201).json({ employee_id: result.insertId, employee_name, department_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT — admin only
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { employee_name, department_id } = req.body;
    await pool.execute(
      'UPDATE employees SET employee_name = ?, department_id = ? WHERE employee_id = ?',
      [employee_name, department_id, req.params.id]
    );
    res.json({ employee_id: Number(req.params.id), employee_name, department_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE — admin only
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM employees WHERE employee_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Karyawan berhasil dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;