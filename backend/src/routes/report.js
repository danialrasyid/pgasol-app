const router      = require('express').Router();
const pool        = require('../db');
const { verifyToken } = require('../../middleware/auth');
const ExcelJS     = require('exceljs');
const PDFDocument = require('pdfkit');

// Helper: build bare query
function buildReportQuery(min_value, max_value) {
  let sql = `
    SELECT
      e.employee_name   AS employee_name,
      d.department_name AS department_name,
      s.spending_date   AS spending_date,
      s.value           AS value
    FROM spendings s
    JOIN employees   e ON s.employee_id   = e.employee_id
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

// Helper format angka IDR
function formatIDR(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Helper format tanggal
function formatDate(raw) {
  const d = new Date(raw);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// ─── GET laporan JSON ────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── Export EXCEL ────────────────────────────────────────────
router.get('/export/excel', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PGASOL ICT';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Spending Report', {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true }
    });

    // ── Judul ──
    sheet.mergeCells('A1:E1');
    sheet.getCell('A1').value = 'SPENDING REPORT 2020–2025';
    sheet.getCell('A1').font      = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A1').fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4E89' } };
    sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 32;

    sheet.mergeCells('A2:E2');
    sheet.getCell('A2').value     = `Dicetak: ${new Date().toLocaleDateString('id-ID')}`;
    sheet.getCell('A2').font      = { italic: true, size: 10, color: { argb: 'FF555555' } };
    sheet.getCell('A2').alignment = { horizontal: 'center' };
    sheet.getRow(2).height = 20;

    // ── Header kolom ──
    const headerRow = sheet.getRow(3);
    const headers   = ['No', 'Employee Name', 'Department', 'Spending Date', 'Value (IDR)'];
    headers.forEach((h, i) => {
      const cell        = headerRow.getCell(i + 1);
      cell.value        = h;
      cell.font         = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill         = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
      cell.alignment    = { horizontal: i === 4 ? 'right' : 'center', vertical: 'middle' };
      cell.border       = {
        top:    { style: 'thin', color: { argb: 'FFAAAAAA' } },
        bottom: { style: 'thin', color: { argb: 'FFAAAAAA' } },
        left:   { style: 'thin', color: { argb: 'FFAAAAAA' } },
        right:  { style: 'thin', color: { argb: 'FFAAAAAA' } },
      };
    });
    headerRow.height = 22;

    // ── Lebar kolom ──
    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 28;
    sheet.getColumn(3).width = 24;
    sheet.getColumn(4).width = 16;
    sheet.getColumn(5).width = 22;

    // ── Data rows ──
    rows.forEach((r, i) => {
      const row     = sheet.getRow(i + 4);
      const isEven  = i % 2 === 0;
      const bgColor = isEven ? 'FFF0F4FA' : 'FFFFFFFF';

      const values = [
        i + 1,
        r.employee_name,
        r.department_name,
        formatDate(r.spending_date),
        Number(r.value),
      ];

      values.forEach((v, j) => {
        const cell     = row.getCell(j + 1);
        cell.value     = v;
        cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
        cell.alignment = {
          horizontal: j === 0 ? 'center' : j === 4 ? 'right' : 'left',
          vertical: 'middle',
        };
        cell.border = {
          top:    { style: 'hair', color: { argb: 'FFDDDDDD' } },
          bottom: { style: 'hair', color: { argb: 'FFDDDDDD' } },
          left:   { style: 'hair', color: { argb: 'FFDDDDDD' } },
          right:  { style: 'hair', color: { argb: 'FFDDDDDD' } },
        };
        // Format kolom value sebagai angka IDR
        if (j === 4) {
          cell.numFmt = '#,##0';
        }
      });
      row.height = 18;
    });

    // ── Baris total ──
    const totalRow  = sheet.getRow(rows.length + 4);
    const totalVal  = rows.reduce((s, r) => s + Number(r.value), 0);
    sheet.mergeCells(`A${rows.length + 4}:D${rows.length + 4}`);
    totalRow.getCell(1).value     = `TOTAL (${rows.length} transaksi)`;
    totalRow.getCell(1).font      = { bold: true };
    totalRow.getCell(1).alignment = { horizontal: 'right' };
    totalRow.getCell(5).value     = totalVal;
    totalRow.getCell(5).numFmt   = '#,##0';
    totalRow.getCell(5).font      = { bold: true, color: { argb: 'FF1D4E89' } };
    totalRow.getCell(5).alignment = { horizontal: 'right' };
    totalRow.getCell(5).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E5F3' } };
    totalRow.height = 20;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=spending_report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ─── Export PDF ──────────────────────────────────────────────
router.get('/export/pdf', verifyToken, async (req, res) => {
  try {
    const { min_value, max_value } = req.query;
    const { sql, params } = buildReportQuery(min_value, max_value);
    const [rows] = await pool.execute(sql, params);

    const doc = new PDFDocument({ 
      margin: 40, 
      size: 'A4', 
      layout: 'landscape',
      autoFirstPage: false
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=spending_report.pdf');
    doc.pipe(res);

    const PAGE_W  = 841.89;
    const PAGE_H  = 595.28;
    const MARGIN  = 40;
    const ROW_H   = 16;
    const HEADER_H = 22;
    const TITLE_H  = 55;
    const FOOTER_H = 25;
    const USABLE_H = PAGE_H - MARGIN - TITLE_H - HEADER_H - FOOTER_H - MARGIN;
    const ROWS_PER_PAGE = Math.floor(USABLE_H / ROW_H);

    const COL = {
      no:   MARGIN,
      emp:  MARGIN + 30,
      dept: MARGIN + 200,
      date: MARGIN + 355,
      val:  MARGIN + 450,
      end:  PAGE_W - MARGIN,
    };

    const COLOR_HEADER_BG  = '#1D4E89';
    const COLOR_SUBHDR_BG  = '#2E75B6';
    const COLOR_ROW_ODD    = '#F0F4FA';
    const COLOR_ROW_EVEN   = '#FFFFFF';
    const COLOR_TOTAL_BG   = '#D9E5F3';
    const COLOR_LINE       = '#CCCCCC';
    const COLOR_TEXT       = '#222222';
    const COLOR_WHITE      = '#FFFFFF';
    const COLOR_MUTED      = '#666666';
    const COLOR_BLUE       = '#1D4E89';

    const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);

    function addPage(pageNum) {
      doc.addPage({ size: 'A4', layout: 'landscape', margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } });

      // ── Judul ──
      doc.rect(MARGIN, MARGIN, PAGE_W - MARGIN * 2, 26).fill(COLOR_HEADER_BG);
      doc.fillColor(COLOR_WHITE).fontSize(13).font('Helvetica-Bold')
         .text('SPENDING REPORT 2020–2025', MARGIN, MARGIN + 7,
           { width: PAGE_W - MARGIN * 2, align: 'center' });

      doc.fillColor(COLOR_MUTED).fontSize(8).font('Helvetica')
         .text(
           `Dicetak: ${new Date().toLocaleDateString('id-ID')}   |   Total: ${rows.length} transaksi   |   Grand Total: ${formatIDR(rows.reduce((s, r) => s + Number(r.value), 0))}`,
           MARGIN, MARGIN + 32,
           { width: PAGE_W - MARGIN * 2, align: 'center' }
         );

      // ── Header tabel ──
      const hy = MARGIN + TITLE_H;
      doc.rect(COL.no, hy, COL.end - COL.no, HEADER_H).fill(COLOR_SUBHDR_BG);

      doc.fillColor(COLOR_WHITE).fontSize(9).font('Helvetica-Bold');
      doc.text('No',          COL.no,   hy + 6, { width: 28,                      align: 'center' });
      doc.text('Employee',    COL.emp,  hy + 6, { width: COL.dept - COL.emp - 6,  align: 'left'   });
      doc.text('Department',  COL.dept, hy + 6, { width: COL.date - COL.dept - 6, align: 'left'   });
      doc.text('Date',        COL.date, hy + 6, { width: COL.val  - COL.date - 4, align: 'center' });
      doc.text('Value (IDR)', COL.val,  hy + 6, { width: COL.end  - COL.val,      align: 'right'  });

      // ── Footer / nomor halaman (ditulis langsung di halaman ini) ──
      doc.fillColor(COLOR_MUTED).fontSize(8).font('Helvetica')
         .text(`Halaman ${pageNum} dari ${totalPages}`,
           MARGIN, PAGE_H - MARGIN - 10,
           { width: PAGE_W - MARGIN * 2, align: 'right' });

      // Garis footer
      doc.moveTo(MARGIN, PAGE_H - MARGIN - 14)
         .lineTo(PAGE_W - MARGIN, PAGE_H - MARGIN - 14)
         .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();

      return MARGIN + TITLE_H + HEADER_H;
    }

    let pageNum = 1;
    let y = addPage(pageNum);

    rows.forEach((r, i) => {
      if (i > 0 && i % ROWS_PER_PAGE === 0) {
        doc.rect(COL.no, MARGIN + TITLE_H + HEADER_H, COL.end - COL.no, y - (MARGIN + TITLE_H + HEADER_H))
           .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();

        pageNum++;
        y = addPage(pageNum);
      }

      doc.rect(COL.no, y, COL.end - COL.no, ROW_H)
         .fill(i % 2 === 0 ? COLOR_ROW_ODD : COLOR_ROW_EVEN);

      doc.moveTo(COL.no, y + ROW_H).lineTo(COL.end, y + ROW_H)
         .strokeColor(COLOR_LINE).lineWidth(0.2).stroke();

      doc.fillColor(COLOR_TEXT).fontSize(8).font('Helvetica');
      doc.text(String(i + 1),
        COL.no,   y + 4, { width: 28,                      align: 'center' });
      doc.text(r.employee_name,
        COL.emp,  y + 4, { width: COL.dept - COL.emp - 6,  align: 'left', lineBreak: false });
      doc.text(r.department_name,
        COL.dept, y + 4, { width: COL.date - COL.dept - 6, align: 'left', lineBreak: false });
      doc.text(formatDate(r.spending_date),
        COL.date, y + 4, { width: COL.val  - COL.date - 4, align: 'center' });
      doc.text(formatIDR(r.value),
        COL.val,  y + 4, { width: COL.end  - COL.val,      align: 'right' });

      y += ROW_H;
    });

    y += 2;
    const totalVal = rows.reduce((s, r) => s + Number(r.value), 0);
    doc.rect(COL.no, y, COL.end - COL.no, HEADER_H).fill(COLOR_TOTAL_BG);
    doc.fillColor(COLOR_BLUE).fontSize(9).font('Helvetica-Bold');
    doc.text(`TOTAL (${rows.length} transaksi)`,
      COL.no, y + 6, { width: COL.val - COL.no - 6, align: 'right' });
    doc.text(formatIDR(totalVal),
      COL.val, y + 6, { width: COL.end - COL.val, align: 'right' });

    doc.rect(COL.no, MARGIN + TITLE_H + HEADER_H, COL.end - COL.no, y + HEADER_H - (MARGIN + TITLE_H + HEADER_H))
       .strokeColor(COLOR_LINE).lineWidth(0.5).stroke();

    doc.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;