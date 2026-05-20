import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage      from './pages/LoginPage';
import EmployeesPage  from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import SpendingsPage  from './pages/SpendingsPage';
import ReportPage     from './pages/ReportPage';

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<LoginPage />} />
        <Route path="/employees"   element={<PrivateRoute><EmployeesPage /></PrivateRoute>} />
        <Route path="/departments" element={<PrivateRoute><DepartmentsPage /></PrivateRoute>} />
        <Route path="/spendings"   element={<PrivateRoute><SpendingsPage /></PrivateRoute>} />
        <Route path="/report"      element={<PrivateRoute><ReportPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}