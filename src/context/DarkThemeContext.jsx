import React, { createContext, useState } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(false);
  
  return (
    <DarkModeContext.Provider value={{ darkTheme, setDarkTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};
