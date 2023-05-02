import React, { useContext, useEffect, useState } from 'react'
import './menus.css'
import LeftButtonsMenu from './LeftButtonsMenu'
import ComposeEmailDialog from './ComposeEmailDialog'
import AllEmails from '../emails/AllEmails'
import RightMenuBar from './RightMenuBar'
import abstractBackgroundImg from '../../assets/abstract-background-fixed.jpg'
import Header from './Header.jsx'
import muiStyles from '../../styles/muiStyles'
import { AuthContext } from '../../context/AuthenticationContext'
import { DarkModeContext } from '../../context/DarkThemeContext'
const { Button, CreateOutlinedIcon, Box } = muiStyles

const AllMenus = () => {
  const { user } = useContext(AuthContext)
  const { setDarkTheme } = useContext(DarkModeContext)
  const [imagePath, setImagePath] = useState(abstractBackgroundImg)
  const [showComposeDialog, setShowComposeDialog] = useState(false)
  
  useEffect(() => {
    setDarkTheme(user.dark_mode)
  }, [user])
  
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
      }}
    >
      <Header />
      <Box
        style={{
          width: {md: '240px', sm: '200px'},
          marginRight: '10px',
        }}
      >
        <div className="left-menu-email-section-container">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              disableElevation={true}
              variant="contained"
              size="large"
              onClick={() => {
                if (!showComposeDialog) setShowComposeDialog(true)
              }}
              startIcon={<CreateOutlinedIcon />}
              sx={{
                backgroundColor: 'white',
                color: '#5F6368',
                textTransform: 'none',
                width: '150px',
                height: '56px',
                borderRadius: '12px',
                margin: ' 8px 0 16px 0',
                marginLeft: '8px',
                display: { xs: 'none', md: 'none', lg: 'flex' },
              }}
            >
              Compose
            </Button>

            <LeftButtonsMenu />
          </div>
          <AllEmails />
          <RightMenuBar />
          {showComposeDialog && <ComposeEmailDialog showComposeDialog={showComposeDialog} setShowComposeDialog={setShowComposeDialog} />}
        </div>
      </Box>
    </div>
  )
}

export default AllMenus
