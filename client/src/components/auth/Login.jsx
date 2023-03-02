import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DarkModeContext } from '../../context/DarkThemeContext'
import muiStyles from '../../styles/muiStyles'
import Koogle_logo from '../../assets/Koogle.svg'
import './auth.css'
const { Button, Paper, TextField, Typography, Link, Stack, FormControlLabel, Switch } = muiStyles

const Login = () => {
  const { darkTheme, setDarkTheme } = useContext(DarkModeContext)
  const navigate = useNavigate()
  const inputRef = useRef()
  
  
  return (
    <Paper elevation={0} className="login-paper">
      <img src={Koogle_logo} style={{ width: 'clamp(70px, 40%, 100px)' }} />
      <Typography variant="h4" style={{ fontSize: '27px' }}>
        Sign in
      </Typography>
      <Typography
        style={{ fontSize: '16px', marginBottom: '25px' }}
        variant="h3"
      >
        To continue to Kmail
      </Typography>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        <TextField inputRef={inputRef} fullWidth color={darkTheme ? 'whiteColor' : 'primary'}  label="Email or phone" />
        <Link
          style={{ fontWeight: 'bold', fontSize: '14px' }}
          href="recover_email"
          underline="none"
        >
          Forgot email?
        </Link>
      </div>
      <Stack
        sx={{
          margin: '35px 0 0 0',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          color={darkTheme ? 'blueBtn' : 'primary'} 
          variant="text"
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            position: 'relative',
            right: 7,
          }}
          onClick={() => navigate('/register')}
        >
          Create account
        </Button>
        <Button color={darkTheme ? 'blueBtn' : 'primary'}  variant="contained" style={{textTransform: 'none', width: '75px', fontWeight: 600}}>Next</Button>
      </Stack>

        <FormControlLabel
          style={{position: 'fixed', top: 15, right: 15}}
          control={
            <Switch checked={darkTheme} color={darkTheme ? 'success' : 'primary'} onChange={() => setDarkTheme(!darkTheme)} name="darkMode" />
          }
          label="Dark Mode"
        />
      
    </Paper>
  )
}

export default Login
