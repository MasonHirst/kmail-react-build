import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { AuthContext } from '../../context/AuthenticationContext'
import muiStyles from '../../styles/muiStyles'
import Koogle_logo from '../../assets/Koogle.svg'
import axios from 'axios'
import './auth.css'
const { Button, Paper, LoadingButton, TextField, Typography, Link, Stack } =
  muiStyles

const Login = () => {
  const { darkTheme } = useContext(DarkModeContext)
  const { isDeepLoading, setIsDeepLoading } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef()

  function checkUsername(event) {
    event.preventDefault()
    if (isDeepLoading) return // don't run the function if function is already going
    setErrorMessage('')
    const input = inputRef.current.value
    if (input.length > 2) {
      setIsDeepLoading(true)
      axios
        .get(`/validate/username/${input}`)
        .then(({ data }) => {
          setIsDeepLoading(false)
          if (data) {
            setErrorMessage('')
            navigate('password', { state: { username: input } })
          } else setErrorMessage('Username not found')
        })
        .catch((err) => {
          setIsDeepLoading(false)
          console.error('ERROR IN LOGIN: ', err)
          setErrorMessage('Error - please try again')
        })
    } else {
      setErrorMessage('Username must be at least 3 characters')
    }
  }

  return (
    <Paper elevation={0} className="login-paper">
      <img
        alt="Koogle"
        src={Koogle_logo}
        style={{ width: 'clamp(70px, 40%, 100px)' }}
      />
      <Typography variant="h4" style={{ fontSize: '27px' }}>
        Sign in
      </Typography>
      <Typography
        style={{ fontSize: '16px', marginBottom: '25px' }}
        variant="h3"
      >
        To continue to Kmail
      </Typography>
      <form onSubmit={checkUsername} style={{width: '100%'}}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
          }}
        >
          <TextField
            inputRef={inputRef}
            disabled={isDeepLoading}
            fullWidth
            autoFocus
            color={darkTheme ? 'whiteColor' : 'primary'}
            label="username"
            helperText={errorMessage}
            error={Boolean(errorMessage)}
          />
          <Link
            color={darkTheme ? 'blueBtn' : 'primary'}
            sx={{ fontWeight: 'bold', fontSize: '14px', color: '#1E65CA' }}
            href="recover_email"
            underline="none"
          >
            Forgot username?
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
            onClick={() => navigate('/authenticate/register')}
          >
            Create account
          </Button>
          <LoadingButton
            color={darkTheme ? 'blueBtn' : 'primary'}
            variant="contained"
            onClick={checkUsername}
            loading={isDeepLoading}
            style={{ textTransform: 'none', width: '75px', fontWeight: 600 }}
          >
            Next
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  )
}

export default Login
