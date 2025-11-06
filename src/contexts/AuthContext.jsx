import React, { createContext, useContext, useState, useEffect } from 'react';
import { getJSON, setJSON, removeKey } from '../utils/storage';

// Default to localhost for developer convenience, but prefer explicit VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Recuperar datos de localStorage al cargar la aplicación
  useEffect(() => {
    const init = async () => {
      if (!API_BASE) {
        // shouldn't happen because we default to localhost, but keep a guard
        console.warn('VITE_API_BASE not configured — falling back to http://localhost:4000');
        return;
      }
      const token = getJSON('authToken', null);
      if (!token) return; // no token -> not logged in
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          // token invalid or expired
          removeKey('authToken');
          return;
        }
        const json = await res.json();
        setUserData(json.user);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error fetching /auth/me:', err);
      }
    };
    init();
  }, []);

  const login = (user, cb) => {
    console.log('Iniciando sesión...'); // Depuración
    setIsLoggedIn(true);
    setUserData(user); // Guardar datos del usuario
    setJSON('userData', user); // Persistir en localStorage de forma segura
    if (user && user.token) setJSON('authToken', user.token);
    if (typeof cb === 'function') cb();
  };

  const logout = () => {
    console.log('Cerrando sesión...'); // Depuración
  setIsLoggedIn(false);
  setUserData(null);
  removeKey('userData');
  removeKey('authToken');
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
