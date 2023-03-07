import React, { createContext, useState } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(true);
  
  return (
    <DarkModeContext.Provider value={{ darkTheme, setDarkTheme, children }}>
      {children}
    </DarkModeContext.Provider>
  );
};
