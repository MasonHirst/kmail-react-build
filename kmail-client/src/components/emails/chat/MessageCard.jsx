import React, { useContext, useState, useEffect } from 'react'
import muiStyles from '../../../styles/muiStyles'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { AuthContext } from '../../../context/AuthenticationContext'
import Emoji from "react-emoji-render";

const {
  Button,
  Card,
  Typography,
  Avatar,
  IconButton,
  MoreVertIcon,
  MenuItem,
  Menu,
} = muiStyles

const MessageCard = ({ message, otherUser, handleEditMessage, openDialog }) => {
  const { darkTheme } = useContext(DarkModeContext)
  const [showDetails, setShowDetails] = useState(false)
  const { user } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [messageBubbleClass, setMessageBubbleClass] = useState('message-bubble')
  
  useEffect(() => {
    let className = 'message-bubble'
    if (message.sender_id !== user.id) {
      className += ' message-bubble-left'
      if (!darkTheme) className += ' message-bubble-left-light'
    }
    else className +=' message-bubble-right'
    if (message.reaction.length) className += ' message-bubble-with-reaction'
    setMessageBubbleClass(className)
  }, [darkTheme])

  console.log(message.reaction)
  
  function handleClick() {
    setShowDetails(!showDetails)
  }

  function handleMoreOptions(event) {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
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
              className={messageBubbleClass}
            >
              <div>
                {message.text}{' '}
                {message.edited && (
                  <p
                    style={{
                      fontSize: 14,
                      opacity: 0.7,
                      textAlign:
                        message.sender_id !== user.id ? 'left' : 'right',
                    }}
                  >
                    (edited)
                  </p>
                )}
              </div>
              {!!message.reaction.length && (
                <Card
                  className={
                    darkTheme
                      ? 'reactions-card reactions-card-dark'
                      : 'reactions-card reactions-card-light'
                  }
                >
                  {/* <p style={{fontSize: '14px'}}>&#x1F44D;</p> */}
                  {/* <p style={{fontSize: '14px'}}>&#x{message.reaction[0].emoji.unified};</p> */}
                  <Emoji text={message.reaction[0].emoji.unified} />
                </Card>
              )}
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

              <MenuItem
                onClick={() => {
                  handleClose()
                  openDialog(message)
                }}
              >
                React
              </MenuItem>
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
