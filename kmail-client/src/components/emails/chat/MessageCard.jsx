import React, { useContext, useState, useEffect } from 'react'
import muiStyles from '../../../styles/muiStyles'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { AuthContext } from '../../../context/AuthenticationContext'
import Emoji from 'react-emoji-render'

const {
  Button,
  Card,
  Typography,
  Avatar,
  IconButton,
  MoreVertIcon,
  MenuItem,
  Menu,
  Box,
} = muiStyles

const MessageCard = ({
  message,
  otherUser,
  handleEditMessage,
  openEmojiPickerDialog,
  openEmojiReactionsDialog,
}) => {
  const { darkTheme } = useContext(DarkModeContext)
  const [showDetails, setShowDetails] = useState(false)
  const { user } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const notUser = message.sender_id !== user.id

  let bubbleClass = 'message-bubble'
  if (notUser) {
    bubbleClass += ' message-bubble-left'
    if (!darkTheme) bubbleClass += ' message-bubble-left-light'
  } else bubbleClass += ' message-bubble-right'
  if (message.reactions.length) bubbleClass += ' message-bubble-with-reaction'

  function formatTime(time) {
    const date = new Date(time)
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    var time = hours + ':' + minutes + ' ' + ampm
    return time
  }

  function formatDate(val) {
    const date = new Date(val)
    const now = new Date()
    // Check if date is today
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return 'Today'
    }
    // Check if date is yesterday
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday'
    }
    // Check if date is in the same year
    if (date.getFullYear() === now.getFullYear()) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return `${monthNames[date.getMonth()]} ${date.getDate()}`
    }
    // Date is not in the same year
    return `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getDate()}, ${date.getFullYear()}`
  }

  const emojiArray = []
  message.reactions.map((emoji) => {
    if (!emojiArray.length) emojiArray.push({ emoji, count: 0 })
    for (let i = 0; i < emojiArray.length; i++) {
      if (emojiArray[i].emoji.emoji.shortcodes === emoji.emoji.shortcodes) {
        emojiArray[i].count++
      } else {
        emojiArray.push({ emoji, count: 0 })
      }
    }
  })

  const mappedEmojis = emojiArray.map((emoji, index) => {
    return (
      <Emoji key={index}>
        {emoji.emoji.emoji.shortcodes}{' '}
        {emoji.count > 1 && (
          <span
            style={{
              fontSize: '13px',
              position: 'relative',
              margin: '0 3px 0 2px',
            }}
          >
            {emoji.count}
          </span>
        )}
      </Emoji>
    )
  })

  return (
    <Box
      onClick={() => setShowDetails(!showDetails)}
      sx={{}}
      className={
        message.sender_id !== 'date marker'
          ? notUser
            ? 'message-bubble-btn message-left'
            : 'message-bubble-btn message-right'
          : 'date-marker-container'
      }
    >
      {message.sender_id !== 'date marker' ? (
        <Box
          sx={{
            alignItems: message.sender_id === user.id && 'flex-end',
            maxWidth: 'min(80%, 800px)',
          }}
          className={
            notUser
              ? 'message-bubble-container bubble-container-left'
              : 'message-bubble-container bubble-container-right'
          }
        >
          <Box
            sx={{
              display: 'flex',
              gap: '3px',
              alignItems: 'flex-start',
              flexDirection: notUser ? 'row' : 'row-reverse',
            }}
          >
            {notUser && (
              <Avatar
                sx={{
                  width: {xs: 30, sm: 46},
                  height: {xs: 30, sm: 46},
                  color: 'white',
                  marginRight: '5px',
                  marginBottom: message.reactions.length ? '12px' : '0',
                }}
                alt={otherUser.username}
                src={otherUser.profile_pic}
              />
            )}
            <Box
              className={bubbleClass}
              sx={{ position: 'relative', }}
            >
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                className="message-options-btn"
                sx={
                  notUser
                    ? { right: '-45px', display: { xs: 'none', sm: 'none' } }
                    : { left: '-45px', display: { xs: 'none', sm: 'none' } }
                }
              >
                <MoreVertIcon width={30} />
              </IconButton>
              <div>
                {message.text}{' '}
                {message.edited && (
                  <p
                    style={{
                      fontSize: 14,
                      opacity: 0.7,
                      textAlign: notUser ? 'left' : 'right',
                    }}
                  >
                    (edited)
                  </p>
                )}
              </div>
              {!!message.reactions.length && (
                <Card
                  onClick={() => openEmojiReactionsDialog(message.reactions)}
                  className={
                    darkTheme
                      ? 'reactions-card reactions-card-dark'
                      : 'reactions-card reactions-card-light'
                  }
                >
                  {mappedEmojis}
                </Card>
              )}
            </Box>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              elevation={2}
            >
              {message.sender_id === user.id && (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null)
                    handleEditMessage(message)
                  }}
                >
                  Edit
                </MenuItem>
              )}

              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  openEmojiPickerDialog(message)
                }}
              >
                React
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>Delete</MenuItem>
            </Menu>
          </Box>
          {showDetails ? (
            <Typography
              variant="subtitle1"
              className={
                notUser
                  ? 'message-details-text details-left'
                  : 'message-details-text details-right'
              }
            >
              {formatTime(message.createdAt)}
            </Typography>
          ) : (
            ''
          )}
        </Box>
      ) : (
        <Typography sx={{ margin: '15px 0', fontSize: 14, opacity: 0.8 }}>
          {formatDate(message.createdAt) +
            ' - ' +
            formatTime(message.createdAt)}
        </Typography>
      )}
    </Box>
  )
}

export default MessageCard
