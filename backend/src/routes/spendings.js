const router = require('express').Router();
const pool   = require('../db');
const { verifyToken, adminOnly } = require('../../middleware/auth');

// GET semua spendings (JOIN + search + order by value ASC)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search_emp, search_dept } = req.query;
    let sql = `
      SELECT
        s.spending_id,
        s.spending_date,
        s.value,
        e.employee_name,
        d.department_name
      FROM spendings s
      JOIN employees  e ON s.employee_id   = e.employee_id
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
    sql += ' ORDER BY s.value ASC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM spendings WHERE spending_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST — admin & user boleh
router.post('/', verifyToken, async (req, res) => {
  try {
    const { employee_id, spending_date, value } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO spendings (employee_id, spending_date, value) VALUES (?, ?, ?)',
      [employee_id, spending_date, value]
    );
    res.status(201).json({ spending_id: result.insertId, employee_id, spending_date, value });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT — admin only
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const { employee_id, spending_date, value } = req.body;
    await pool.execute(
      'UPDATE spendings SET employee_id = ?, spending_date = ?, value = ? WHERE spending_id = ?',
      [employee_id, spending_date, value, req.params.id]
    );
    res.json({ spending_id: Number(req.params.id), employee_id, spending_date, value });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE — admin only
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM spendings WHERE spending_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Spending berhasil dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;