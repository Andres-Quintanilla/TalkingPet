import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
    const { user } = useAuth();
    const loc = useLocation();
    if (!user) return <Navigate to="/login" replace state={{ returnTo: loc.pathname + loc.search }} />;
    return children;
}

export function RequireRole({ role, children }) {
    const { user } = useAuth();
    const loc = useLocation();
    if (!user) return <Navigate to="/admin/login" replace state={{ returnTo: loc.pathname + loc.search }} />;
    if (user.rol !== role) return <Navigate to="/" replace />;
    return children;
}
