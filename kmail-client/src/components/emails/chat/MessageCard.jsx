import React, { useContext, useState } from 'react'
import muiStyles from '../../../styles/muiStyles'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { AuthContext } from '../../../context/AuthenticationContext'
const { Button, Typography, Avatar, IconButton, MoreVertIcon, MenuItem, Menu } =
  muiStyles

const MessageCard = ({ message, otherUser, handleEditMessage }) => {
  const { darkTheme } = useContext(DarkModeContext)
  const [showDetails, setShowDetails] = useState(false)
  const { user } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  function handleClick() {
    setShowDetails(!showDetails)
  }

  function handleMoreOptions(event) {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (event) => {
    setAnchorEl(null)
  }

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

  return (
    <div
      onClick={handleClick}
      className={
        message.sender_id !== 'date marker'
          ? message.sender_id !== user.id
            ? 'message-bubble-btn message-left'
            : 'message-bubble-btn message-right'
          : 'date-marker-container'
      }
    >
      {message.sender_id !== 'date marker' ? (
        <div
          className={
            message.sender_id !== user.id
              ? 'message-bubble-container bubble-container-left'
              : 'message-bubble-container bubble-container-right'
          }
        >
          <div
            style={{
              display: 'flex',
              gap: '3px',
              alignItems: 'center',
              flexDirection:
                message.sender_id !== user.id ? 'row' : 'row-reverse',
            }}
          >
            {message.sender_id !== user.id && (
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  color: 'white',
                  marginRight: '5px',
                }}
                alt={otherUser.username}
                src={otherUser.profile_pic}
              />
            )}
            <div
              className={
                message.sender_id !== user.id
                  ? 'message-bubble message-bubble-left'
                  : 'message-bubble message-bubble-right'
              }
            >
              <div>
                {message.text}{' '}
                {message.edited && <p style={{fontSize: 14, opacity: .7, textAlign: message.sender_id !== user.id ? 'left' : 'right'}}>(edited)</p>}
              </div>
            </div>
            <IconButton
              onClick={handleMoreOptions}
              className="message-options-btn"
              sx={{
                padding: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                width: '40px',
              }}
            >
              <MoreVertIcon width={30} />
            </IconButton>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              elevation={2}
            >
              {message.sender_id === user.id && (
                <MenuItem
                  onClick={() => {
                    handleClose()
                    handleEditMessage(message)
                  }}
                >
                  Edit
                </MenuItem>
              )}

              <MenuItem onClick={handleClose}>React</MenuItem>
              <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>
          </div>
          {showDetails ? (
            <Typography
              variant="subtitle1"
              className={
                message.sender_id !== user.id
                  ? 'message-details-text details-left'
                  : 'message-details-text details-right'
              }
            >
              {formatTime(message.createdAt)}
            </Typography>
          ) : (
            ''
          )}
        </div>
      ) : (
        <Typography sx={{ margin: '15px 0', fontSize: 14, opacity: 0.8 }}>
          {formatDate(message.createdAt) +
            ' - ' +
            formatTime(message.createdAt)}
        </Typography>
      )}
    </div>
  )
}

export default MessageCard
