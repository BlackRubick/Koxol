import React, { createContext, useContext, useState, useEffect } from 'react';
import { getJSON, setJSON, removeKey } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Recuperar datos de localStorage al cargar la aplicación
  useEffect(() => {
    const storedUser = getJSON('userData', null);
    if (storedUser) {
      setUserData(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user, cb) => {
    console.log('Iniciando sesión...'); // Depuración
    setIsLoggedIn(true);
  setUserData(user); // Guardar datos del usuario
  setJSON('userData', user); // Persistir en localStorage de forma segura
    if (typeof cb === 'function') cb();
  };

  const logout = () => {
    console.log('Cerrando sesión...'); // Depuración
  setIsLoggedIn(false);
  setUserData(null);
  removeKey('userData');
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
