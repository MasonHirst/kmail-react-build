import React, { useEffect, useContext } from 'react'
import Login from './Login'
import LoginPassword from './LoginPassword'
import SelectAccount from './SelectAccount'
import CreateAccount from './CreateAccount'
import FinishProfile from './FinishProfile'
import muiStyles from '../../styles/muiStyles'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { Routes, Route } from 'react-router-dom'
import './auth.css'
const { Paper, FormControlLabel, Switch } = muiStyles

const AllAuth = () => {
  const { darkTheme, setDarkTheme } = useContext(DarkModeContext)

  useEffect(() => {
    if (localStorage.getItem('dark_mode') === null) {
      localStorage.setItem('dark_mode', '')
    } else {
      setDarkTheme(Boolean(localStorage.getItem('dark_mode')))
    }
  }, [])

  function toggleDarkMode() {
    setDarkTheme(!darkTheme)
    localStorage.setItem('dark_mode', !darkTheme ? true : '')
  }

  return (
    <Paper className="login-fullpage-div">
      <Routes>
        <Route path='/' element={<SelectAccount />} />
        <Route path="login" element={<Login />} />
        <Route path="login/password" element={<LoginPassword />} />
        <Route path="register" element={<CreateAccount />} />
        <Route path="register/finish" element={<FinishProfile />} />
      </Routes>

      <FormControlLabel
        style={{ position: 'fixed', top: 15, right: 15 }}
        control={
          <Switch
            checked={darkTheme}
            color={darkTheme ? 'success' : 'primary'}
            onChange={toggleDarkMode}
            name="darkMode"
          />
        }
        label="Dark Mode"
      />
    </Paper>
  )
}

export default AllAuth
