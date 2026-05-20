CREATE DATABASE IF NOT EXISTS pgasol_db;
USE pgasol_db;

-- Tabel Departments
CREATE TABLE departments (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL
);

-- Tabel Employees
CREATE TABLE employees (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_name VARCHAR(100) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Tabel Spendings
CREATE TABLE spendings (
  spending_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  spending_date DATE NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Tabel Users (untuk auth)
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL
);