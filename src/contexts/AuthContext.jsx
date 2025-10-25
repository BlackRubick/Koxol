import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Leer de localStorage al cargar
    return localStorage.getItem('koxol_isLoggedIn') === 'true';
  });

  const [userData, setUserData] = useState(() => {
    // Leer datos del usuario de localStorage al cargar
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    // Guardar en localStorage cuando cambie
    localStorage.setItem('koxol_isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    // Guardar datos del usuario en localStorage cuando cambien
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  const login = (user, cb) => {
    console.log('Iniciando sesión...'); // Depuración
    setIsLoggedIn(true);
    setUserData(user); // Guardar datos del usuario
    if (typeof cb === 'function') cb();
  };

  const logout = () => {
    console.log('Cerrando sesión...'); // Depuración
    setIsLoggedIn(false);
    setUserData(null); // Eliminar datos del usuario
    localStorage.removeItem('koxol_isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
