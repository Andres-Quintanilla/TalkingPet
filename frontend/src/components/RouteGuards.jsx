// src/components/RouteGuards.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Redirige al login si el usuario NO está autenticado.
 */
export function RequireAuth({ children }) {
  const { user, loading } = useAuth(); // Usamos loading
  const loc = useLocation();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ returnTo: loc.pathname + loc.search }} />;
  }

  return children;
}

/**
 * Redirige si el usuario no tiene UNO de los roles permitidos.
 * @param {{roles: string[]}} props
 */
export function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  // Define a dónde enviar si falla la autenticación
  const loginPath = roles.includes('admin') ? '/admin/login' : '/login';

  if (!user) {
    return <Navigate to={loginPath} replace state={{ returnTo: loc.pathname + loc.search }} />;
  }

  // Comprueba si el rol del usuario está en el array de roles permitidos
  if (!roles.includes(user.rol)) {
    // Si no tiene el rol, lo mandamos al inicio
    return <Navigate to="/" replace />;
  }

  return children;
}