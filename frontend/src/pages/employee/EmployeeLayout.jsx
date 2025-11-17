// src/pages/employee/EmployeeLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  LogOut,
} from 'lucide-react';

export default function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isVet = user?.rol === 'empleado_veterinario';

  return (
    <div className="employee-layout admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Empleado</h2>
        <nav>
          <NavLink to="dashboard">
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="citas">
            <CalendarDays size={18} /> Mis Citas
          </NavLink>
          {isVet && (
             <NavLink to="medical">
                <Heart size={18} /> Hist. Médicos
             </NavLink>
          )}
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}