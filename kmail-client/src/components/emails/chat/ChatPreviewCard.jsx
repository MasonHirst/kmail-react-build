import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../../context/SocketContext'
import { AuthContext } from '../../../context/AuthenticationContext'
import muiStyles from '../../../styles/muiStyles'
const { IconButton, Avatar, Typography, Button } = muiStyles

const ChatPreviewCard = ({ data }) => {
  const { chatId, user } = useContext(AuthContext)
  const {
    message,
    updatedMessage,
    updatedReaction,
    hideChatsNotifications,
    setHideChatsNotifications,
  } = useContext(SocketContext)
  const navigate = useNavigate()

  const unreadChat =
    data.latest_message.recipient_read === false &&
    data.latest_message.sender_id !== user.id

  function handleClick() {
    if (data.chat.id !== chatId) {
      navigate(data.chat.id)
    }
  }

  function formatDate(dateInput) {
    const date = new Date(dateInput)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000
    const yesterday = new Date(now.getTime() - oneDay)
    const twoDaysAgo = new Date(now.getTime() - 2 * oneDay)

    if (diff < oneDay && date.getDate() === now.getDate()) {
      // less than 24 hours ago, return time
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    } else if (diff < 7 * oneDay && date > twoDaysAgo) {
      // within the last week, return weekday name or "yesterday"
      if (date.getDate() === yesterday.getDate()) {
        return 'Yesterday'
      } else {
        return date.toLocaleString('en-US', { weekday: 'long' })
      }
    } else if (now.getFullYear() === date.getFullYear()) {
      // within this year, return date in 'MMM D' format
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
    } else {
      // older than this year, return date in 'MM/DD/YYYY' format
      return date.toLocaleDateString()
    }
  }

  return (
    <div onClick={handleClick} className="chat-preview-card">
      <div style={{position: 'relative'}}>
        <Avatar
          sx={{ width: 45, height: 45, color: 'white' }}
          alt={data.otherUser.username}
          src={data.otherUser.profile_pic}
        />
        <Typography
          variant="subtitle"
          sx={{
            fontSize: '16px',
            fontWeight: unreadChat && 'bold',
            position: 'absolute !important',
            top: 0,
            left: '60px',
          }}
        >
          {data.otherUser.username}
        </Typography>
      </div>
      <Typography
        variant="subtitle2"
        sx={{
          marginBottom: '-24px',
          fontSize: '13px',
          opacity: unreadChat ? 1 : 0.75,
          textAlign: 'left',
          textOverflow: 'ellipsis',
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: unreadChat && 'bold',
        }}
      >
        {data.latest_message.sender_id === user.id && 'You: '}{' '}
        {data.latest_message.text}
      </Typography>
      {/* </div> */}
      <Typography
        variant="subtitle"
        sx={{
          fontSize: '12px',
          opacity: unreadChat ? 1 : 0.6,
          whiteSpace: 'nowrap',
        }}
      >
        {formatDate(data.latest_message.createdAt)}
      </Typography>
    </div>
  )
}

export default ChatPreviewCard
