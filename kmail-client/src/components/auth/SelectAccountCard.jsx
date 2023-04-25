import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import muiStyles from '../../styles/muiStyles'
import axios from 'axios'
import { DarkModeContext } from '../../context/DarkThemeContext'
import { AuthContext } from '../../context/AuthenticationContext'
const { Button, Typography, IconButton, Avatar, Card } = muiStyles

const SelectAccountCard = ({ userId }) => {
  const navigate = useNavigate()
  const { darkTheme } = useContext(DarkModeContext)
  const [user, setUser] = useState({})

  useEffect(() => {
    axios
      .get(`accounts/local/${userId}`)
      .then(({ data }) => {
        setUser(data)
      })
      .catch((err) => {
        console.error('ERROR IN SELECT ACCOUNT CARD: ', err)
      })
  }, [])

  function handleClick() {
    navigate('login/password', { state: { username: user.username } })
  }

  return (
    <div style={{width: '100%'}}>
      <Button
        disableFocusRipple
        disableRipple
        fullWidth
        onClick={handleClick}
        variant="flat"
        className="account-card-btn"
      >
        <Avatar
          sx={{ width: 40, height: 40, bgcolor: 'purple', color: 'white' }}
          alt={user.username}
          src={user.profile_pic}
        />
        <Typography>{user.username}</Typography>
      </Button>
      <div className='account-select-divider'/>
    </div>
  )
}

export default SelectAccountCard
