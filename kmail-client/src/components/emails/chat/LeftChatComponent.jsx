import React, { useContext, useState, useEffect } from 'react'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { SocketContext } from '../../../context/SocketContext'
import { AuthContext } from '../../../context/AuthenticationContext'
import ChatPreviewCard from './ChatPreviewCard'
import muiStyles from '../../../styles/muiStyles'
const { Button, IconButton, MoreVertOutlinedIcon, ChatBubbleOutlineOutlinedIcon, Typography, Box } = muiStyles

const LeftChatComponent = () => {
  const {
    message,
    updatedMessage,
    conversations,
    setConversations,
    getConversations,
  } = useContext(SocketContext)
  const location = useLocation()
  const { setChatId, chatId, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const { darkTheme } = useContext(DarkModeContext)

  // loop through the conversations array and if any of the conversations have a latest_message with a recipient_read value of false and a sender_id that is not the user's id, then return true
  
  const mappedConversations = conversations.map((conv, index) => {
    return <ChatPreviewCard  key={index} data={conv} />
  })

  useEffect(() => {
    getConversations()
  }, [])

  useEffect(() => {
    if (!message || !conversations.length) return
    const newArr = [...conversations]
    const index = newArr.findIndex((item) => item.chat.id === message.chatId)
    const obj = newArr[index]
    obj.latest_message = message
    newArr.splice(index, 1)
    newArr.unshift(obj)
    setConversations(newArr)
  }, [message])
  
  return (
    <Box sx={{display: {xs: 'none', sm: 'none', md: 'block'}}} className='left-chat-div'>
      <div className='left-chat-header'>
        <Typography variant='h6'>Messages</Typography>
        <IconButton>
          <MoreVertOutlinedIcon />
        </IconButton>
      </div>
      <Button
        disableElevation={true}
        variant="contained"
        size="large"
        onClick={() => {
          navigate('new')
          setChatId('')
        }}
        startIcon={<ChatBubbleOutlineOutlinedIcon />}
        color={darkTheme ? 'blueBtn' : 'primary'}
        style={{
          margin: '20px 0 10px 22px',
          textTransform: 'none',
          fontWeight: '600',
          width: '150px',
          height: '45px',
          borderRadius: '10px',
        }}
      >
        Start Chat
      </Button>
      <div className='left-chat-chatlist'>
        {mappedConversations}
      </div>
    </Box>
  )
}

export default LeftChatComponent
