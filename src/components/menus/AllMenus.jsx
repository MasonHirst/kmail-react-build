import React from 'react'
import './menus.css'
import LeftButtonsMenu from './LeftButtonsMenu'
import AllEmails from '../emails/AllEmails'
import RightMenuBar from './RightMenuBar'
import Header from './Header.jsx'
import muiStyles from '../../styles/muiStyles'
const { Button, CreateOutlinedIcon } = muiStyles

const AllMenus = () => {
  const imagePath = 'https://drive.google.com/uc?export=view&id=1TBx3mnoBpKI3RzCLzzO414Su0m_PCpX_'
  
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
      }}
    >
      <Header />
      <div
        style={{
          width: '240px',
          marginRight: '10px',
        }}
      >
        <div className="left-menu-email-section-container">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              disableElevation={true}
              variant="contained"
              size="large"
              startIcon={<CreateOutlinedIcon />}
              style={{
                backgroundColor: 'white',
                color: '#5F6368',
                textTransform: 'none',
                width: '150px',
                height: '56px',
                borderRadius: '12px',
                margin: ' 8px 0 16px 0',
                marginLeft: '8px',
              }}
            >
              Compose
            </Button>

            <LeftButtonsMenu />
          </div>
          <AllEmails />
          <RightMenuBar />
        </div>
      </div>
    </div>
  )
}

export default AllMenus
