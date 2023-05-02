import React, { useState, useContext, useRef, useEffect } from 'react'
import muiStyles from '../../styles/muiStyles'
import { PopupModal } from '../../styles/reusableStyles'
import K_logo from '../../assets/DALLE-K-logo.svg'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { AuthContext } from '../../context/AuthenticationContext'
import axios from 'axios'
const {
  MenuIcon,
  Typography,
  SearchIcon,
  HelpOutlineOutlinedIcon,
  Box,
  IconButton,
  TuneIcon,
  SettingsOutlinedIcon,
  AppsOutlinedIcon,
  Avatar,
  FormControlLabel,
  Switch,
  Button,
  Drawer,
} = muiStyles

const Header = () => {
  const [searchFocus, setSearchFocus] = useState(false)
  const { user, isDeepLoading, logout } = useContext(AuthContext)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const { darkTheme, setDarkTheme } = useContext(DarkModeContext)
  const settingsRef = useRef(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showNavDrawer, setShowNavDrawer] = useState(false)
  const profileRef = useRef(null)

  // This use effect closes the settings popup when you click outside it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsModal(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [settingsRef])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [profileRef])

  function handleToggleDarkTheme() {
    setDarkTheme(!darkTheme)
    axios.put('/user/update/dark_mode', {darkMode: !darkTheme})
      .then(() => {})
      .catch(err => {
        console.error('ERROR IN HEADER: ', err)
      })
  }

  return (
    <div
      style={{
        backgroundcolor: 'transparent',
        width: '100vw',
        height: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '240px',
          minWidth: {xs: '0', sm: '240px'},
          height: '64px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '15px',
          marginRight: '10px',
        }}
      >
        <IconButton sx={{ padding: {xs: '0', sm: '12px'}, margin: '0 4px', display: {lg: 'none'} }} onClick={() => setShowNavDrawer(!showNavDrawer)}>
          <MenuIcon />
        </IconButton>
        <img src={K_logo} alt="Kmail logo" className="logo-img" />
        <Typography
          variant="subtitle"
          sx={{ fontSize: '25px', letterSpacing: '.5px', display: {xs: 'none', sm: 'block'} }}
        >
          Kmail
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }} className="header-bar-right">
        <div
          className={
            searchFocus
              ? 'header-search-div-focused'
              : 'header-search-div-unfocused'
          }
        >
          <IconButton>
            <SearchIcon className={searchFocus ? 'font-grey' : 'font-white'} />
          </IconButton>
          <input
            className="header-search-input-unfocused"
            placeholder="Search mail"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
          <IconButton>
            <TuneIcon className={searchFocus ? 'font-grey' : 'font-white'} />
          </IconButton>
        </div>

        <Box sx={{ gap: {xs: '0', sm: '5px'} }} className="header-icons-section-right">
          <IconButton>
            <HelpOutlineOutlinedIcon />
          </IconButton>
          <div ref={settingsRef}>
            <IconButton
              onClick={() => setShowSettingsModal(!showSettingsModal)}
            >
              <SettingsOutlinedIcon />
            </IconButton>
            {/* --------------- Show settings modal ----------------- */}
            {showSettingsModal && (
              <PopupModal>
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkTheme}
                        color={darkTheme ? 'success' : 'primary'}
                        onChange={handleToggleDarkTheme}
                        name="darkMode"
                      />
                    }
                    label="Dark Mode"
                  />
                </div>
              </PopupModal>
            )}
          </div>
          <IconButton>
            <AppsOutlinedIcon />
          </IconButton>
          <div ref={profileRef}>
            <IconButton onClick={() => setShowProfile(!showProfile)}>
              <Avatar
                sx={{ width: 40, height: 40, color: 'white' }}
                alt={user.username}
                src={user.profile_pic}
              />
            </IconButton>
            {showProfile && (
              <PopupModal>
                <Typography>{user.first_name + ' ' + user.last_name}</Typography>
                <Button variant='filled' color={darkTheme ? 'bluBtn' : 'primary'} onClick={logout} sx={{textTransform: 'none'}}>Logout</Button>
              </PopupModal>
            )}
          </div>
        </Box>
      </Box>
    </div>
  )
}

export default Header
