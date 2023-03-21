import React, { useState, useContext } from 'react'
import muiStyles from '../../styles/muiStyles'
import K_logo from '../../assets/DALLE-K-logo.svg'
import { AuthContext } from '../../context/AuthenticationContext'
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
} = muiStyles

const Header = () => {
  const [searchFocus, setSearchFocus] = useState(false)
  const { user, isDeepLoading, logout } = useContext(AuthContext)

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
        style={{
          width: '240px',
          minWidth: '240px',
          height: '64px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '15px',
          marginRight: '10px',
        }}
      >
        <IconButton style={{ padding: '12px', margin: '0 4px' }}>
          <MenuIcon />
        </IconButton>
        <img src={K_logo} alt="Kmail logo" className="logo-img" />
        <Typography
          variant="subtitle"
          style={{ fontSize: '25px', letterSpacing: '.5px' }}
        >
          Kmail
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} className="header-bar-right">
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

        <div className="header-icons-section-right">
          <IconButton>
            <HelpOutlineOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <AppsOutlinedIcon />
          </IconButton>
          <IconButton onClick={logout}>
            {/* <div className="profile-pic-div">
              <Typography variant='h6'>
                {'M'}
              </Typography>
            </div> */}
            <Avatar
              sx={{ width: 40, height: 40 }}
              alt={user.username}
              src={user.profile_pic}
            />
          </IconButton>
        </div>
      </Box>
    </div>
  )
}

export default Header
