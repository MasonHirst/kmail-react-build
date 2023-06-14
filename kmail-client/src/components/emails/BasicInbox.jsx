import React, { useEffect } from 'react'
import muiStyles from '../../styles/muiStyles'
const { Typography } = muiStyles

const BasicInbox = () => {
  useEffect(() => {
    document.title = 'Kmail - inbox'
    return () => {
      document.title = 'Kmail'
    }
  }, [])

  return (
    <div className="emails-page-div-general">
      <Typography variant="h5" sx={{padding: '20px 25px',}}>Basic Inbox</Typography>
    </div>
  )
}

export default BasicInbox
