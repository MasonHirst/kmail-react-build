import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { DarkModeProvider, DarkModeContext } from './context/DarkThemeContext'

const darkModeOn = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#121212',
    },
    secondary: {
      main: '#2F2F2F',
    },
    blueBtn: {
      main: '#1D66C9'
    },
    whiteColor: {
      main: '#FFFFFF'
    },
  },
  
})

const lightModeOn = createTheme({
  palette: {
    mode: 'light',
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
    <DarkModeProvider>
      <DarkModeContext.Consumer>
        {(context) => (
          <ThemeProvider theme={context.darkTheme ? darkModeOn : lightModeOn}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        )}
      </DarkModeContext.Consumer>
    </DarkModeProvider>
  </BrowserRouter>
)
