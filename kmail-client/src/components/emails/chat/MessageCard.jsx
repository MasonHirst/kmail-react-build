import React, { useContext } from 'react'
import muiStyles from '../../../styles/muiStyles'
import { AuthContext } from '../../../context/AuthenticationContext'
const { Button, Typography, Avatar } = muiStyles

const MessageCard = ({ message, otherUser }) => {
  const { user } = useContext(AuthContext)

  function handleClick() {
    console.log('you clicked a message')
  }

  return (
    <div
      onClick={handleClick}
      className={
        message.sender_id !== user.id
          ? 'message-bubble-btn message-left'
          : 'message-bubble-btn message-right'
      }
    >
      {message.sender_id !== user.id && (<Avatar
        sx={{ width: 46, height: 46, color: 'white' }}
        alt={otherUser.username}
        src={otherUser.profile_pic}
      />)}
      <div
        className={
          message.sender_id !== user.id
            ? 'message-bubble message-bubble-left'
            : 'message-bubble message-bubble-right'
        }
      >
        <Typography>{message.text}</Typography>
      </div>
    </div>
  )
}

export default MessageCard
