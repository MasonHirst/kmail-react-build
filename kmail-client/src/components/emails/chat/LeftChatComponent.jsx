import React, { useContext, useState, useEffect } from 'react'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { SocketContext } from '../../../context/SocketContext'
import { AuthContext } from '../../../context/AuthenticationContext'
import axios from 'axios'
import ChatPreviewCard from './ChatPreviewCard'
import muiStyles from '../../../styles/muiStyles'
const { Button, IconButton, MoreVertOutlinedIcon, ChatBubbleOutlineOutlinedIcon, Typography } = muiStyles

const LeftChatComponent = () => {
  const location = useLocation();
  const { setChatId, chatId } = useContext(AuthContext)
  const navigate = useNavigate()
  const { darkTheme } = useContext(DarkModeContext)
  const { message } = useContext(SocketContext)
  const [conversations, setConversations] = useState([])
  
  const mappedConversations = conversations.map((conv, index) => {
    return <ChatPreviewCard key={index} data={conv} />
  })

  useEffect(() => {
    if (!message) return
    const newArr = [...conversations]
    const index = newArr.findIndex((item) => item.chat.id === message.chatId)
    const obj = newArr[index]
    obj.latest_message = message
    newArr.splice(index, 1)
    newArr.unshift(obj)
    setConversations(newArr)
  }, [message])

  useEffect(() => {
    axios.get('user/conversations/get')
      .then(({data}) => {
        setConversations(data)
      })
      .catch(err => {
        console.error('ERROR IN LEFT CHAT COMPONENT: ', err)
      })

      return () => {
        // setChatId('')
        // can't remember why this is here, but it messes up other functions
      }
  }, [chatId])
  
  return (
    <div className='left-chat-div'>
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
    </div>
  )
}

export default LeftChatComponent
