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

  const unreadChat = data.latest_message.recipient_read === false && data.latest_message.sender_id !== user.id
  
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
    <Button onClick={handleClick} fullWidth className="chat-preview-card">
      <Avatar
        sx={{ width: 45, height: 45, color: 'white' }}
        alt={data.username}
        src={data.profile_pic}
      />
      <div
        style={{
          width: 'calc(100% - 50px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="subtitle" sx={{ fontSize: '16px', fontWeight: unreadChat && 'bold', }}>
          {data.username}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '13px',
            opacity: unreadChat ? 1 : 0.75,
            textAlign: 'left',
            textOverflow: 'ellipsis !important',
            maxWidth: '130px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontWeight: unreadChat && 'bold',
          }}
        >
          {data.latest_message.sender_id === user.id && 'You: '}{' '}
          {data.latest_message.text}
        </Typography>
      </div>
      <Typography
        variant="subtitle"
        sx={{ fontSize: '12px', opacity: unreadChat ? 1 : 0.6, whiteSpace: 'nowrap' }}
      >
        {formatDate(data.latest_message.createdAt)}
      </Typography>
    </Button>
  )
}

export default ChatPreviewCard
