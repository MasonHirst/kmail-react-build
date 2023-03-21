import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { AuthContext } from '../../context/AuthenticationContext'
import muiStyles from '../../styles/muiStyles'
import { useLocation } from 'react-router-dom'
import Koogle_logo from '../../assets/Koogle.svg'
import axios from 'axios'
import './auth.css'
import { picsArray } from './picsArray'
const {
  Button,
  Paper,
  Avatar,
  LoadingButton,
  TextField,
  Typography,
  Link,
  Stack,
  IconButton,
  HelpOutlineIcon,
} = muiStyles

const FinishProfile = () => {
  const { darkTheme } = useContext(DarkModeContext)
  const { isDeepLoading, setIsDeepLoading } = useContext(AuthContext)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef()
  const [useURL, setUseURL] = useState(false)
  const [highlightedURL, setHighlightedURL] = useState(false)
  const [showHelper, setShowHelper] = useState('')
  const [chosenPic, setChosenPic] = useState(null)
  const { username, accessToken } = location.state

  function handleSubmit(e) {
    e.preventDefault()
    axios
      .put('/accounts/update/picture', { accessToken, chosenPic })
      .then(({ data }) => {
        console.log({ data })
        if (typeof data === 'object') {
          localStorage.setItem('jwtAccessToken', accessToken)
          window.location.reload()
        } else {
          alert(
            'There was an error updating your profile picture. Please try again later'
          )
        }
      })
      .catch((err) => {
        console.log('ERROR IN FINISH PROFILE: ', err)
      })
  }

  function handleSkip() {
    localStorage.setItem('jwtAccessToken', accessToken)
    window.location.reload()
  }

  let mappedProfileButtons = picsArray.map((url) => {
    return (
      <Avatar
        key={url}
        src={url}
        sx={{
          width: 65,
          height: 65,
          cursor: 'pointer',
          border: chosenPic === url ? '3px solid #1664C0' : '',
        }}
        onClick={() => {
          setChosenPic(url)
        }}
      />
    )
  })

  return (
    <Paper elevation={0} className="login-paper">
      <img
        alt="Koogle"
        src={Koogle_logo}
        style={{ width: 'clamp(70px, 40%, 100px)' }}
      />
      <Typography variant="h4" style={{ fontSize: '27px' }}>
        Welcome, {username}
      </Typography>
      <Typography
        style={{ fontSize: '16px', marginBottom: '25px' }}
        variant="h3"
      >
        Choose a profile picture
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 9,
          }}
        >
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Avatar
              alt={username}
              src={chosenPic}
              sx={{ width: 150, height: 150 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              variant="text"
              color={darkTheme ? 'blueBtn' : 'primary'}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              onClick={() => setUseURL(!useURL)}
            >
              {useURL ? 'Choose picture' : 'Use custom url'}
            </Button>
            <Button
              variant="text"
              color={darkTheme ? 'blueBtn' : 'primary'}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              onClick={() => setChosenPic(null)}
            >
              Clear
            </Button>
          </div>
          {useURL ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <IconButton
                onBlur={() => setShowHelper(!showHelper)}
                onClick={() => setShowHelper(!showHelper)}
                sx={{
                  padding: '5px !important',
                  position: 'relative',
                  marginLeft: '-8px',
                }}
              >
                <HelpOutlineIcon width={30} />
                {showHelper ? (
                  <Paper
                    style={{
                      position: 'absolute',
                      padding: 5,
                      zIndex: 3,
                      width: 250,
                      left: -10,
                      top: -60,
                    }}
                  >
                    <Typography>
                      Right click a public image, then select "copy image
                      address"
                    </Typography>
                  </Paper>
                ) : (
                  ''
                )}
              </IconButton>
              <TextField
                inputRef={inputRef}
                disabled={isDeepLoading}
                fullWidth
                variant="filled"
                autoFocus
                color={darkTheme ? 'whiteColor' : 'primary'}
                label="Image url"
                onChange={() => setChosenPic(inputRef.current.value)}
                helperText={errorMessage}
                error={Boolean(errorMessage)}
              />
            </div>
          ) : (
            <Paper elevation={0} className="profile-picker-paper">
              {mappedProfileButtons}
            </Paper>
          )}
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
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <LoadingButton
            color={darkTheme ? 'blueBtn' : 'primary'}
            variant="contained"
            onClick={handleSubmit}
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

export default FinishProfile
