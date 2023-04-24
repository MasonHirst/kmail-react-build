import React, { useContext } from 'react'
import muiStyles from '../../../styles/muiStyles'
import axios from 'axios'
import { AuthContext } from '../../../context/AuthenticationContext'
import { useNavigate } from 'react-router-dom'
const { Avatar, Button, Typography } = muiStyles

const ChatContactCard = ({ user }) => {
  const { isLightLoading, setIsLightLoading, setChatId } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleClick() {
    setIsLightLoading(true)
    axios.post('chats/create', {recipient: user.id})
      .then(({data}) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350);
        // console.log(data.id)
        setChatId(data.id)
        navigate(`/chats/${data.id}`)
      })
      .catch(err => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350);
        console.error('ERROR IN CHAT CONTACT CARD:', err)
      })
  }
  
  return (
    <Button fullWidth disabled={isLightLoading} className='contact-card-btn' onClick={handleClick}>
      <Avatar
        sx={{ width: 50, height: 50, color: 'white' }}
        alt={user.username}
        src={user.profile_pic}
      />
      <Typography variant='body' sx={{fontSize: '20px', fontWeight: 'bold',}}>{user.username}</Typography>
    </Button>
  )
}

export default ChatContactCard
