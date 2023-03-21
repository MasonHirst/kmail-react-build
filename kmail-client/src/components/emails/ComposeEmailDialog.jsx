import React from 'react'
import muiStyles from '../../styles/muiStyles'
const { Paper, Typography } = muiStyles

const ComposeEmailDialog = () => {
  return (
    <Paper elevation={5} className='compose-email-dialog' >
      <div className='compose-email-header'>
        <Typography variant='subtitle' fontSize={15} >New Message</Typography>
        <div>
          
        </div>
      </div>
    </Paper>
  )
}

export default ComposeEmailDialog