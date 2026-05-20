SELECT 
    department_id   AS 'Department ID',
    department_name AS 'Department Name'
FROM departments
ORDER BY department_id;


SELECT
    e.employee_id   AS 'Employee ID',
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name'
FROM employees e
JOIN departments d ON e.department_id = d.department_id
ORDER BY e.employee_id;


SELECT
    s.spending_id   AS 'Spending ID',
    e.employee_name AS 'Employee Name',
    s.spending_date AS 'Spending Date',
    s.value         AS 'Spending Value'
FROM spendings s
JOIN employees e ON s.employee_id = e.employee_id
ORDER BY s.spending_id;


SELECT
    e.employee_name   AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date   AS 'Spending Date',
    s.value           AS 'Spending Value'
FROM spendings s
JOIN employees   e ON s.employee_id   = e.employee_id
JOIN departments d ON e.department_id = d.department_id;


SELECT
    e.employee_name   AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date   AS 'Spending Date',
    s.value           AS 'Spending Value'
FROM spendings s
JOIN employees   e ON s.employee_id   = e.employee_id
JOIN departments d ON e.department_id = d.department_id
ORDER BY s.value ASC;

-- ============================================================
-- 4. Laporan spending tahun 2020 s/d 2025,
--    bulan Januari s/d Desember,
--    filter range value 500.000 s/d 5.000.000 (WHERE)
-- ============================================================
SELECT
    e.employee_name   AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date   AS 'Spending Date',
    s.value           AS 'Spending Value'
FROM spendings s
JOIN employees   e ON s.employee_id   = e.employee_id
JOIN departments d ON e.department_id = d.department_id
WHERE
    YEAR(s.spending_date)  BETWEEN 2020 AND 2025
    AND MONTH(s.spending_date) BETWEEN 1   AND 12
    AND s.value            BETWEEN 500000 AND 5000000
ORDER BY s.value ASC;