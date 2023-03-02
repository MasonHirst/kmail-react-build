import React from 'react'
import Login from './Login'
import muiStyles from '../../styles/muiStyles'
import './auth.css'
const { Paper } = muiStyles

const AllAuth = () => {
  return (
    <Paper className='login-fullpage-div'>
      <Login />
    </Paper>
  )
}

export default AllAuth