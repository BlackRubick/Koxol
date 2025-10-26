import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
