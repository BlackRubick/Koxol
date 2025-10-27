import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Recuperar datos de localStorage al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user, cb) => {
    console.log('Iniciando sesión...'); // Depuración
    setIsLoggedIn(true);
    setUserData(user); // Guardar datos del usuario
    localStorage.setItem('userData', JSON.stringify(user)); // Persistir en localStorage
    if (typeof cb === 'function') cb();
  };

  const logout = () => {
    console.log('Cerrando sesión...'); // Depuración
    setIsLoggedIn(false);
    setUserData(null); // Eliminar datos del usuario
    localStorage.removeItem('userData'); // Eliminar de localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
