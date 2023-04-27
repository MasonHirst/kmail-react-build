import React, { useEffect, useState, useContext, useRef } from 'react'
import muiStyles from '../../../styles/muiStyles'
import axios from 'axios'
import ThreeDots from 'react-loading-icons/dist/esm/components/three-dots'
import MessageCard from './MessageCard'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthenticationContext'
import { SocketContext } from '../../../context/SocketContext'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const { Button, Typography, Avatar, IconButton, SendIcon, Dialog } = muiStyles

const ChatPage = () => {
  const { isLightLoading, setIsLightLoading, user, setChatId } =
    useContext(AuthContext)
  const [messageLoading, setMessageLoading] = useState(false)
  const { darkTheme } = useContext(DarkModeContext)
  const { message, sendMessage, updatedMessage, setMessage, updatedReaction } =
    useContext(SocketContext)
  const { chat_id } = useParams()
  const [otherUser, setOtherUser] = useState({})
  const [messageInput, setMessageInput] = useState('')
  const [messageToEdit, setMessageToEdit] = useState(null)
  const inputRef = useRef()
  const [messages, setMessages] = useState([])
  const [pageOffset, setPageOffset] = useState(0)
  const [messagesEnd, setMessagesEnd] = useState(false)
  const conversationDivRef = useRef()
  const [showDownBtn, setShowDownBtn] = useState(false)
  const [showEmojiDialog, setShowEmojiDialog] = useState(false)
  const [messageToReact, setMessageToReact] = useState({})
  const limit = 50

  function openDialog(messageObj) {
    setMessageToReact(messageObj)
    setShowEmojiDialog(true)
  }

  function handleSubmitEmoji(emoji, user) {
    axios
      .put('chats/messages/edit/reaction', { emoji, reactMessage: messageToReact, user })
      .then(() => {})
      .catch(console.error)
  }

  useEffect(() => {
    if (!updatedReaction.length) return
    const newArr = [...messages]
    for (let i = 0; i < updatedReaction.length; i++) {
      const messageId = updatedReaction[i].reactMessage.id
      const react = updatedReaction[i].reactMessage.reaction
      for (let j = 0; j < newArr.length; j++) {
        if (messageId === newArr[j].id) {
          newArr[j].reaction = react
          break
        }
      }
    }
    setMessages(newArr)
  }, [updatedReaction])

  useEffect(() => {
    if (!updatedMessage) return
    const newArray = messages.map((obj) => {
      if (obj.id === updatedMessage.id) {
        obj.text = updatedMessage.text
        obj.edited = true
        return obj
      } else {
        return obj
      }
    })
    setMessages(newArray)
  }, [updatedMessage])

  function focusInput() {
    setTimeout(() => {
      const input = inputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }, 100)
  }

  function handleEditMessage(target) {
    setMessageInput(target.text)
    setMessageToEdit(target.id)
    focusInput()
  }

  function handleCancelEdit() {
    setMessageInput('')
    setMessageToEdit(null)
    focusInput()
  }

  function handleScroll() {
    const div = conversationDivRef.current
    if (div.scrollTop < -500 && !showDownBtn) {
      setShowDownBtn(true)
    } else if (div.scrollTop > -500 && showDownBtn) {
      setShowDownBtn(false)
    }
    if (messagesEnd) return
    if (div.scrollTop === div.clientHeight - div.scrollHeight) {
      setPageOffset(pageOffset + 1)
    }
  }

  function handleScrollDown() {
    const div = conversationDivRef.current
    div.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    setMessageToEdit(null)
    setMessageInput('')
    if (chat_id !== '') setChatId(chat_id)
    axios
      .get(`chats/get/${chat_id}`)
      .then(({ data }) => {
        setMessages([])
        if (user.id === data.user1.id) {
          setOtherUser(data.user2)
        } else {
          setOtherUser(data.user1)
        }
      })
      .catch(console.error)
  }, [chat_id])

  useEffect(() => {
    setIsLightLoading(true)
    axios
      .get(`chat/${chat_id}/messages/${pageOffset}/${limit}`)
      .then(({ data }) => {
        setTimeout(() => {
          setIsLightLoading(false)
          if (data.length < 50) setMessagesEnd(true)
          if (!data.length) {
            setMessagesEnd(true)
            return
          }
          if (messages.length && data[0].chat_id !== messages[0].chat_id) {
            setMessages(data)
          } else {
            setMessages([...messages, ...data])
          }
        }, 350)
      })
      .catch((err) => {
        setTimeout(() => {
          setIsLightLoading(false)
        }, 350)
        console.error('ERROR IN CHATPAGE MESSAGES: ', err)
      })
  }, [chat_id, pageOffset])

  useEffect(() => {
    if (!message || message.sender_id !== otherUser.id) return
    setMessages([message, ...messages])
  }, [message])

  function submitEditMessage(type) {
    setMessageInput('')
    focusInput()
    setMessageToEdit(null)
    axios
      .put('chats/messages/edit', {
        event: type,
        editorId: user.id,
        recipient_id: otherUser.id,
        messageId: messageToEdit,
        text: messageInput,
      })
      .then(({ data }) => {})
      .catch(console.error)
  }

  function handleSubmit(event) {
    setMessageInput('')
    setMessageLoading(true)
    axios
      .post('chats/messages/create', {
        text: messageInput,
        recipient: otherUser.id,
        chat: chat_id,
      })
      .then(() => {
        focusInput()
      })
      .catch((err) => {
        console.error('ERROR IN CHAT PAGE MESSAGESENDER: ', err)
      })
      .finally(() => setMessageLoading(false))
  }

  function addDateMarkers(messages) {
    const markedMessages = []
    for (let i = messages.length - 1; i >= 0; i--) {
      const currentMessage = messages[i]
      const prevMessage = messages[i + 1]
      // If this is the last message, add a date marker for the message's createdAt date
      if (i === messages.length - 1) {
        markedMessages.push({
          sender_id: 'date marker',
          createdAt: currentMessage.createdAt,
          reaction: [],
        })
      }
      // If this message and the next message are on different days, add a date marker for the current message's createdAt date
      if (
        prevMessage &&
        !isSameDay(currentMessage.createdAt, prevMessage.createdAt)
      ) {
        markedMessages.push({
          sender_id: 'date marker',
          createdAt: currentMessage.createdAt,
          reaction: [],
        })
      }
      markedMessages.push(currentMessage)
    }
    return markedMessages.reverse()
  }
  function isSameDay(d1, d2) {
    const date1 = new Date(d1)
    const date2 = new Date(d2)
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  let mappedMessages = addDateMarkers(messages).map((message, index) => {
    return (
      <MessageCard
        handleEditMessage={handleEditMessage}
        key={index}
        message={message}
        otherUser={otherUser}
        openDialog={openDialog}
      />
    )
  })

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {showDownBtn && (
        <Button onClick={handleScrollDown} className={darkTheme ? "to-bot-btn to-bot-btn-dark" : "to-bot-btn to-bot-btn-light"}>
          Back to bottom
        </Button>
      )}
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
      <div
        ref={conversationDivRef}
        onScroll={handleScroll}
        className="chat-conversation-container"
      >
        {mappedMessages}
        {isLightLoading && (
          <ThreeDots
            color="#007bff"
            size="50"
            style={{
              position: 'absolute',
              top: '100px',
              zIndex: 5,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )}
        {messagesEnd && !isLightLoading && (
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
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (messageToEdit) {
            submitEditMessage('editMessage')
          } else handleSubmit()
        }}
        className="chat-message-input-div"
      >
        <div
          className={
            darkTheme
              ? 'chat-message-input-holder background-dark'
              : 'chat-message-input-holder background-light'
          }
        >
          <input
            disabled={messageLoading}
            value={messageInput}
            ref={inputRef}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Message"
            className={
              darkTheme ? 'chat-message-input dark' : 'chat-message-input light'
            }
          />
          {messageToEdit && (
            <Button
              onClick={handleCancelEdit}
              variant="contained"
              color={darkTheme ? 'blueBtn' : 'primary'}
              className="cancel-edit-btn"
            >
              Cancel edit
            </Button>
          )}
        </div>
        <IconButton
          disabled={messageInput === '' || messageLoading}
          type="submit"
          sx={{ padding: '18px' }}
          className={darkTheme ? 'background-dark' : 'background-light'}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Dialog onClose={() => setShowEmojiDialog(false)} open={showEmojiDialog}>
        <Picker
          data={data}
          autoFocus
          onEmojiSelect={(event) => {
            handleSubmitEmoji(event, user)
            setShowEmojiDialog(false)
          }}
          theme={darkTheme ? 'dark' : 'light'}
        />
      </Dialog>
    </div>
  )
}

export default ChatPage
