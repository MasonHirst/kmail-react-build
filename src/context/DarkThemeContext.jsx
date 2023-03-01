import React, { createContext, useState } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(true);
  
  const toggleDarkMode = () => {
    setDarkTheme(!darkTheme);
  };
  
  return (
    <DarkModeContext.Provider value={{ darkTheme, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
