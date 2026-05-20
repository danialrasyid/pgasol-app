const router     = require('express').Router();
const pool       = require('../db');
const { verifyToken } = require('../../middleware/auth');
const ExcelJS    = require('exceljs');
const PDFDocument = require('pdfkit');

// Helper: build bare query report dengan filter
function buildReportQuery(min_value, max_value) {
  let sql = `
    SELECT
      e.employee_name   AS employee_name,
      d.department_name AS department_name,
      s.spending_date   AS spending_date,
      s.value           AS value
    FROM spendings s
    JOIN employees  e ON s.employee_id   = e.employee_id
    JOIN departments d ON e.department_id = d.department_id
    WHERE
      YEAR(s.spending_date)  BETWEEN 2020 AND 2025
      AND MONTH(s.spending_date) BETWEEN 1 AND 12
  `;
  const params = [];
  if (min_value) { sql += ' AND s.value >= ?'; params.push(Number(min_value)); }
  if (max_value) { sql += ' AND s.value <= ?'; params.push(Number(max_value)); }
  sql += ' ORDER BY s.value ASC';
  return { sql, params };
}

// GET laporan dengan filter range value
router.get('/', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Export Excel
router.get('/export/excel', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);

    const workbook = new ExcelJS.Workbook();
    const sheet    = workbook.addWorksheet('Spending Report');

    sheet.columns = [
      { header: 'Employee Name',  key: 'employee_name',  width: 25 },
      { header: 'Department',     key: 'department_name', width: 20 },
      { header: 'Spending Date',  key: 'spending_date',  width: 15 },
      { header: 'Value (IDR)',    key: 'value',           width: 18 },
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: 'FF1D4E89' }
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    rows.forEach(r => {
      sheet.addRow({
        employee_name:  r.employee_name,
        department_name: r.department_name,
        spending_date:  r.spending_date,
        value:          Number(r.value),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=spending_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Export PDF
router.get('/export/pdf', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=spending_report.pdf');
    doc.pipe(res);

    // Header PDF
    doc.fontSize(18).font('Helvetica-Bold')
       .text('Spending Report 2020–2025', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica')
       .text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, { align: 'center' });
    doc.moveDown(1);

    // Tabel header
    const colX = { no: 40, emp: 60, dept: 200, date: 320, val: 420 };
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('No',            colX.no,   doc.y, { continued: true });
    doc.text('Employee',      colX.emp,  doc.y, { continued: true });
    doc.text('Department',    colX.dept, doc.y, { continued: true });
    doc.text('Date',          colX.date, doc.y, { continued: true });
    doc.text('Value (IDR)',   colX.val,  doc.y);
    doc.moveDown(0.3);
    doc.moveTo(40, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown(0.3);

    // Rows PDF
    doc.font('Helvetica').fontSize(8);
    rows.forEach((r, i) => {
      const y = doc.y;
      doc.text(String(i + 1),                    colX.no,   y, { continued: true });
      doc.text(r.employee_name,                  colX.emp,  y, { continued: true });
      doc.text(r.department_name,                colX.dept, y, { continued: true });
      doc.text(
        new Date(r.spending_date).toLocaleDateString('id-ID'),
        colX.date, y, { continued: true }
      );
      doc.text(
        Number(r.value).toLocaleString('id-ID'),
        colX.val,  y
      );
      doc.moveDown(0.4);
      if (doc.y > 740) doc.addPage(); // page break
    });

    doc.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;