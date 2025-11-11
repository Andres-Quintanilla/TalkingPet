// src/components/Header.jsx
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { ShoppingCart, Wallet, Sun, Moon, User2 } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    const { totals } = useCart();
    const [open, setOpen] = useState(false);

    // --- Tema ---
    const getInitialTheme = () => {
        const saved = localStorage.getItem('tp-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('tp-theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

    return (
        <header className="header" role="banner">
            <nav className="nav container" aria-label="Navegación principal">
                {/* Izquierda: marca */}
                <div className="nav__brand">
                    <Link to="/" className="nav__link nav__link--icon" aria-label="Ir al inicio">
                        <strong aria-hidden="true">TalkingPet</strong>
                    </Link>
                </div>

                {/* Centro: navegación principal */}
                <ul className="nav__menu nav__menu--primary" role="menubar">
                    <li className="nav__item"><NavLink to="/" className="nav__link">Inicio</NavLink></li>
                    <li className="nav__item"><NavLink to="/productos" className="nav__link">Productos</NavLink></li>
                    <li className="nav__item"><NavLink to="/servicios" className="nav__link">Servicios</NavLink></li>
                    <li className="nav__item"><NavLink to="/cursos" className="nav__link">Cursos</NavLink></li>
                </ul>

                {/* Derecha: utilidades */}
                <ul className="nav__menu nav__menu--utilities" role="menubar">
                    {/* Carrito */}
                    <li className="nav__item">
                        <NavLink to="/carrito" className="nav__link nav__link--icon" aria-label="Ir al carrito">
                            <ShoppingCart className="icon" aria-hidden="true" />
                            <span className="badge badge--primary">{totals.count}</span>
                        </NavLink>
                    </li>

                    {/* Toggle tema */}
                    <li className="nav__item">
                        <button
                            type="button"
                            className="nav__link nav__link--icon theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                            title={`Tema: ${theme === 'dark' ? 'Oscuro' : 'Claro'}`}
                        >
                            {theme === 'dark'
                                ? <Moon className="icon" aria-hidden="true" />
                                : <Sun className="icon" aria-hidden="true" />}
                        </button>
                    </li>

                    {/* Autenticación */}
                    {!user ? (
                        <li className="nav__item nav__auth">
                            <NavLink to="/login" className="btn btn--outline-primary btn--sm">Ingresar</NavLink>
                            <NavLink to="/registro" className="btn btn--primary btn--sm">Crear cuenta</NavLink>
                        </li>
                    ) : (
                        <li className="nav__item nav__user">
                            <button
                                className="nav__link nav__link--icon"
                                onClick={() => setOpen(v => !v)}
                                aria-haspopup="menu"
                                aria-expanded={open}
                            >
                                <User2 className="icon" aria-hidden="true" />
                                {user.nombre}
                            </button>

                            {open && (
                                <div className="dropdown" role="menu" onMouseLeave={() => setOpen(false)}>
                                    <div className="dropdown__item" aria-disabled>
                                        <Wallet className="icon icon--left" aria-hidden="true" />
                                        Saldo: Bs&nbsp;{(user.saldo ?? 0).toFixed(2)}
                                    </div>
                                    <NavLink to="/mis-cursos" className="dropdown__item" onClick={() => setOpen(false)}>
                                        Mis cursos
                                    </NavLink>
                                    <NavLink to="/pedidos" className="dropdown__item" onClick={() => setOpen(false)}>
                                        Mis pedidos
                                    </NavLink>
                                    <button className="dropdown__item" onClick={() => { setOpen(false); logout(); }}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}
