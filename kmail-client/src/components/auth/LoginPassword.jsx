import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DarkModeContext } from '../../context/DarkThemeContext'
import muiStyles from '../../styles/muiStyles'
import Koogle_logo from '../../assets/Koogle.svg'
import './auth.css'
import { AuthContext } from '../../context/AuthenticationContext'
import axios from 'axios'
const {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Stack,
  ExpandMoreIcon,
  Avatar,
  LoadingButton
} = muiStyles

const LoginPassword = () => {
  const { darkTheme } = useContext(DarkModeContext)
  const { isLoading, setIsLoading, setAccessToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef()
  const [picUrl, setpicUrl] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [usernameState, setUsernameState] = useState(location.state.username)

  useEffect(() => {
    axios.get(`/accounts/picture/${usernameState}`).then(({ data }) => {
      setpicUrl(data)
    })
  }, [])

  function handleClick() {
    if (isLoading) return
    let input = inputRef.current.value
    if (input.length > 0) {
      setIsLoading(true)
      axios
        .post('verify/login', { username: usernameState, password: input })
        .then(({ data }) => {
          setIsLoading(false)
          console.log(data)
          setAccessToken(data.accessToken)
          setUser(data.user)
          localStorage.setItem('jwtAccessToken', data.accessToken)
        })
        .catch(err => {
          setIsLoading(false)
          console.error('ERROR IN LOGINPASSWORD', err)
        })
    } else setErrorMessage('Password is required bro')
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleClick()
    }
  }
  setIsLoading(true)

  return (
    <Paper elevation={0} className="login-paper">
      <img
        alt="Koogle"
        src={Koogle_logo}
        style={{ width: 'clamp(70px, 40%, 100px)', marginBottom: '10px' }}
      />
      <Typography variant="h4" style={{ fontSize: '27px' }}>
        Welcome
      </Typography>
      <button
        className={`login-dropdown-btn ${darkTheme ? 'btn-dark' : 'btn-light'}`}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          alt={usernameState}
          src={picUrl}
        />
        <Typography variant="subtitle" sx={{ fontWeight: '600' }}>
          {usernameState}
        </Typography>
        <ExpandMoreIcon />
      </button>

      <div style={{ width: '100%' }}>
        <Typography
          style={{ fontSize: '14px', marginBottom: '25px' }}
          variant="h3"
        >
          To continue, first verify it's you
        </Typography>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        <TextField
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          fullWidth
          type={showPass ? 'text' : 'password'}
          autoFocus
          color={darkTheme ? 'whiteColor' : 'primary'}
          label="Enter your password"
          helperText={errorMessage}
          error={Boolean(errorMessage)}
        />
        <FormControlLabel
          color={darkTheme ? 'whiteColor' : 'primary'}
          control={
            <Checkbox
              checked={showPass}
              onChange={() => setShowPass(!showPass)}
              color={darkTheme ? 'blueBtn' : 'primary'}
            />
          }
          label="Show password"
        />
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
          onClick={() => navigate('/recovery/password')}
        >
          Forgot password?
        </Button>
        <LoadingButton
          color={darkTheme ? 'blueBtn' : 'primary'}
          variant="contained"
          onClick={handleClick}
          loading={isLoading}
          style={{ textTransform: 'none', width: '75px', fontWeight: 600 }}
        >
          Next
        </LoadingButton>
      </Stack>
    </Paper>
  )
}

export default LoginPassword
