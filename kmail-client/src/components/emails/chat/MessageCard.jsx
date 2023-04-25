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
  const [showOptions, setShowOptions] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  function handleClick() {
    setShowDetails(!showDetails)
  }

  function handleMoreOptions(event) {
    event.stopPropagation()
    // setShowOptions(!showOptions)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (event) => {
    event.stopPropagation()
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
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const year = now.getFullYear()
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
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    if (diffDays === 0) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
      return `today at ${formattedHours}:${formattedMinutes}${ampm}`
    } else if (diffDays <= 7) {
      return dayNames[date.getDay()]
    } else if (date.getFullYear() === year) {
      return `${monthNames[date.getMonth()]} ${date.getDate()}`
    } else {
      return `${
        monthNames[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`
    }
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
              <Typography>{message.text}</Typography>
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
            >
              {message.sender_id === user.id && (
                <MenuItem
                  onClick={() => {
                    handleEditMessage(message.id)
                    handleClose()
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
              // color={darkTheme ? 'white' : 'black'}
            >
              {formatTime(message.createdAt)}
            </Typography>
          ) : (
            ''
          )}
        </div>
      ) : (
        <Typography style={{ margin: '15px 0' }}>
          {formatDate(message.createdAt)}
        </Typography>
      )}
    </div>
  )
}

export default MessageCard
