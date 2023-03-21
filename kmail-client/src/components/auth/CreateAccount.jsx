import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Koogle_logo from '../../assets/Koogle.svg'
import { AuthContext } from '../../context/AuthenticationContext'
import muiStyles from '../../styles/muiStyles'
import axios from 'axios'
import { DarkModeContext } from '../../context/DarkThemeContext'
const {
  Paper,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  LoadingButton,
} = muiStyles

const CreateAccount = () => {
  const [lightLoading, setLightLoading] = useState(false)
  const navigate = useNavigate()
  const name1Input = useRef()
  const name2Input = useRef()
  const usernameInput = useRef()
  const pass1Input = useRef()
  const pass2Input = useRef()
  const { darkTheme } = useContext(DarkModeContext)
  const [nameError, setNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPass, setShowPass] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (lightLoading) return // don't run if state is loading
    const name1 = name1Input.current.value
    const name2 = name2Input.current.value
    const username = usernameInput.current.value
    const pass1 = pass1Input.current.value
    const pass2 = pass2Input.current.value

    if (name1 && name2) {
      setNameError('')
      if (username) {
        setUsernameError('')
        if (pass1 && pass2) {
          setPasswordError('')
          if (pass1 === pass2) {
            setPasswordError('')
            setLightLoading(true)
            axios.post('accounts/create', {name1, name2, username, pass1})
              .then(({data}) => {
                setLightLoading(false)
                if (typeof data === 'object') {
                  navigate('/authenticate/register/finish', { state: { username: data.createAccount.username, accessToken: data.accessToken } })
                } else {
                  if (data === 'Names cannot contain numbers') setNameError(data)
                  if (data === 'The username contains invalid characters') setUsernameError(data)
                  if (data === 'The password contains invalid characters') setPasswordError(data)
                  if (data === 'Password must be at least 8 characters') setPasswordError(data)
                  if (data === 'Username is taken') setUsernameError(data)
                }
              })
              .catch(err => {
                setLightLoading(false)
                console.error('Error in the createAccount: ', err)
              })
          } else setPasswordError('Passwords must match')
        } else setPasswordError('Password fields are required')
      } else setUsernameError('Username is required')
    } else setNameError('First and last names are required')
  }

  function handleSignInInstead() {
    navigate('/authenticate', { state: { from: 'createAccountPage' } })
  }

  return (
    <Paper elevation={0} className="register-paper">
      <form onSubmit={handleSubmit} className="create-acc-left-section">
        <div className="register-top-section">
          <img
            alt="Koogle logo"
            // style={{ margin: '10px 0' }}
            src={Koogle_logo}
            width={80}
          />
          <Typography style={{ margin: '10px 0' }} variant="h5">
            Create your Koogle Account
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            to continue to Kmail
          </Typography>
        </div>

        <div className="register-row-inputs">
          <TextField
            sx={{ fontSize: '10px' }}
            inputRef={name1Input}
            disabled={lightLoading}
            size="small"
            autoFocus
            fullWidth
            color={darkTheme ? 'whiteColor' : 'primary'}
            label="First name"
            error={Boolean(nameError)}
          />
          <TextField
            inputRef={name2Input}
            size="small"
            disabled={lightLoading}
            fullWidth
            color={darkTheme ? 'whiteColor' : 'primary'}
            label="Last name"
            error={Boolean(nameError)}
          />
        </div>
        {Boolean(nameError) ? (
          <Typography variant="subtitle2" className="input-helper-text error">
            {nameError}
          </Typography>
        ) : (
          <Typography
            variant="subtitle2"
            className="input-helper-text"
          ></Typography>
        )}
        <TextField
          inputRef={usernameInput}
          size="small"
          disabled={lightLoading}
          fullWidth
          color={darkTheme ? 'whiteColor' : 'primary'}
          label="Username"
          helperText={
            Boolean(usernameError)
              ? usernameError
              : 'You can use letters, numbers, & underscores'
          }
          error={Boolean(usernameError)}
        />
        <div className="register-row-inputs">
          <TextField
            size="small"
            inputRef={pass1Input}
            disabled={lightLoading}
            fullWidth
            type={showPass ? 'text' : 'password'}
            color={darkTheme ? 'whiteColor' : 'primary'}
            label="Password"
            error={Boolean(passwordError)}
          />
          <TextField
            inputRef={pass2Input}
            size="small"
            disabled={lightLoading}
            fullWidth
            type={showPass ? 'text' : 'password'}
            color={darkTheme ? 'whiteColor' : 'primary'}
            label="Confirm password"
            error={Boolean(passwordError)}
          />
        </div>
        {Boolean(passwordError) && (
          <Typography variant="subtitle2" className="input-helper-text error">
            {passwordError}
          </Typography>
        )}
        <Typography variant="subtitle2" className="input-helper-text">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </Typography>

        <div width="100%">
          <FormControlLabel
            sx={{ marginTop: -4 }}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '45px',
            marginBottom: '25px',
          }}
        >
          <Button
            onClick={handleSignInInstead}
            variant="flat"
            color="secondary"
            className="sign-in-instead-btn"
          >
            Sign in instead
          </Button>
          <LoadingButton
            type="submit"
            color={darkTheme ? 'blueBtn' : 'primary'}
            variant="contained"
            onClick={handleSubmit}
            loading={lightLoading}
            style={{ textTransform: 'none', width: '75px', fontWeight: 600 }}
          >
            Next
          </LoadingButton>
        </div>
      </form>

      <div className="register-right-div">
        <img
          alt="Koogle apps decoration"
          className="register-pic"
          src="https://ssl.gstatic.com/accounts/signup/glif/account.svg"
          width={244}
          height={244}
        />
        <Typography align="center" variant="subtitle1">
          One account. All of Koogle working for you.
        </Typography>
      </div>
    </Paper>
  )
}

export default CreateAccount
