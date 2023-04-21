import React, { useEffect, useState, useContext, useRef } from 'react'
import muiStyles from '../../../styles/muiStyles'
import axios from 'axios'
import MessageCard from './MessageCard'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthenticationContext'
import { SocketContext } from '../../../context/SocketContext'
const { Button, Typography, Avatar, IconButton, SendIcon } = muiStyles

const ChatPage = () => {
  const {
    isLightLoading,
    setIsLightLoading,
    user,
    setChatId,
  } = useContext(AuthContext)
  const { darkTheme } = useContext(DarkModeContext)
  const { message, sendMessage } = useContext(SocketContext)
  const { chat_id } = useParams()
  const [otherUser, setOtherUser] = useState({})
  const [messageInput, setMessageInput] = useState('')
  const inputRef = useRef()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setIsLightLoading(true)
    setChatId(chat_id)
    axios
      .get(`chats/get/${chat_id}`)
      .then(({ data }) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350)
        // console.log('data: ', data)
        if (user.id === data.user1.id) {
          setOtherUser(data.user2)
        } else {
          setOtherUser(data.user1)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350)
        console.error('ERROR IN CHATPAGE: ', err)
      })
  }, [chat_id])

  useEffect(() => {
    setIsLightLoading(true)
    axios
      .get(`chat/${chat_id}/messages/all`)
      .then(({ data }) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350)
        // console.log('data: ', data)
        setMessages(data)
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350)
        console.error('ERROR IN CHATPAGE MESSAGES: ', err)
      })
  }, [chat_id])

    useEffect(() => {
      console.log('Value: ', message)
      if (!message) return
      setMessages([{
        
        sender_id: message.sender_id,
        text: message.text,
      }, ...messages])
    }, [message])

  function handleSubmit(event) {
    event.preventDefault()
    setMessages([{
      sender_id: user.id,
      text: messageInput,
    }, ...messages])
    sendMessage({text: messageInput, recipient_id: otherUser.id})

    setIsLightLoading(true)
    axios
      .post('chats/messages/create', {

        text: messageInput,
        recipient: otherUser.id,
        chat: chat_id,
      })
      .then(({ data }) => {
        setMessageInput('')
        setTimeout(() => {
          inputRef.current.focus()
        }, 300)

        
      })
      .catch((err) => {
        setTimeout(() => {
        }, 350)
        console.error('ERROR IN CHAT PAGE MESSAGESENDER: ', err)
      })
      .finally(() => setIsLightLoading(false))
  }

  let mappedMessages = messages.map((message, index) => {
    return <MessageCard key={index} message={message} otherUser={otherUser} />
  })

  return (
    <div style={{ height: '100%' }}>
      <div className="right-chat-header" style={{ paddingLeft: '25px' }}>
        <Avatar
          sx={{ width: 65, height: 65, color: 'white' }}
          alt={otherUser.username}
          src={otherUser.profile_pic}
        />
        <Typography variant="h6" sx={{ marginLeft: '15px' }}>
          {otherUser.username}
        </Typography>
      </div>
      <div className="chat-conversation-container">
        {mappedMessages}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            margin: '15px 0',
            opacity: 0.6,
          }}
        >
          ----- This is the start of your chat history with{' '}
          <span style={{ fontWeight: 'bold', opacity: 1.5 }}>
            {otherUser.username}
          </span>{' '}
          -----
        </div>
      </div>
      <form onSubmit={handleSubmit} className="chat-message-input-div">
        <div
          className={
            darkTheme
              ? 'chat-message-input-holder background-dark'
              : 'chat-message-input-holder background-light'
          }
        >
          <input
            disabled={isLightLoading}
            value={messageInput}
            ref={inputRef}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Message"
            className={
              darkTheme ? 'chat-message-input dark' : 'chat-message-input light'
            }
          />
        </div>
        <IconButton
          disabled={messageInput === '' || isLightLoading}
          type="submit"
          sx={{ padding: '18px' }}
          className={darkTheme ? 'background-dark' : 'background-light'}
        >
          <SendIcon />
        </IconButton>
      </form>
    </div>
  )
}

export default ChatPage
