import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Koogle_logo from '../../assets/Koogle.svg'
import muiStyles from '../../styles/muiStyles'
import SelectAccountCard from './SelectAccountCard'
const { Paper, Typography, AddIcon, Button } = muiStyles

const SelectAccount = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const usersArr = JSON.parse(localStorage.getItem('localUsersArray'))

  let userCards

  if (usersArr) {
    userCards = usersArr.map((id) => {
      return <SelectAccountCard key={id} userId={id} />
    })
  }

  useEffect(() => {
    if (location.state?.from === 'createAccountPage') {
      navigate('login')
      return
    }
    if (!usersArr) navigate('/authenticate/register')
  }, [location.state?.from, navigate, usersArr])

  function handleAddUser() {
    navigate('login')
  }

  return (
    <Paper elevation={0} className="login-paper">
      <img
        alt="Koogle"
        src={Koogle_logo}
        style={{ width: 'clamp(70px, 40%, 100px)' }}
      />
      <Typography variant="h4" style={{ fontSize: '27px' }}>
        Choose an account
      </Typography>
      <div style={{ width: '100%' }}>{userCards}</div>
      <Button
        fullWidth
        disableFocusRipple
        disableRipple
        variant="flat"
        onClick={handleAddUser}
        className="account-card-btn"
      >
        <AddIcon sx={{ margin: '8px 0' }} />
        <Typography>Add user</Typography>
      </Button>
    </Paper>
  )
}

export default SelectAccount
