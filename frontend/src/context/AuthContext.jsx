import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const me = async () => {
        try {
            // asegúrate que /api/users/me devuelve el objeto del usuario
            const { data } = await api.get('/api/users/me');
            setUser(data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        const tk = localStorage.getItem('tp_token');
        if (tk) me();
    }, []);

    // login(payload) acepta email O nombre + contraseña
    const login = async (payload) => {
        const { data } = await api.post('/api/auth/login', payload);
        localStorage.setItem('tp_token', data.token);
        await me();
    };

    const register = async (payload) => {
        const { data } = await api.post('/api/auth/register', payload);
        localStorage.setItem('tp_token', data.token);
        await me();
    };

    const logout = () => {
        localStorage.removeItem('tp_token');
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);
