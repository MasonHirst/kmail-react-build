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
import Emoji from 'react-emoji-render'
const { Button, Card, Typography, Avatar, IconButton, SendIcon, Dialog } =
  muiStyles

const ChatPage = () => {
  const { isLightLoading, setIsLightLoading, user, setChatId } =
    useContext(AuthContext)
  const { darkTheme } = useContext(DarkModeContext)
  const { message, updatedMessage, updatedReaction } =
    useContext(SocketContext)
  const { chat_id } = useParams()
  const [messageLoading, setMessageLoading] = useState(false)
  const [otherUser, setOtherUser] = useState({})
  const [messageInput, setMessageInput] = useState('')
  const [messageToEdit, setMessageToEdit] = useState(null)
  const inputRef = useRef()
  const [messages, setMessages] = useState([])
  const [pageOffset, setPageOffset] = useState(0)
  const [messagesEnd, setMessagesEnd] = useState(false)
  const [showDownBtn, setShowDownBtn] = useState(false)
  const [showEmojiDialog, setShowEmojiDialog] = useState(false)
  const [showEmojiReactions, setShowEmojiReactions] = useState(false)
  const [messageToReact, setMessageToReact] = useState({})
  const [reactionToShow, setReactionToShow] = useState([])
  const conversationDivRef = useRef()
  const limit = 50

  function openEmojiPickerDialog(messageObj) {
    setMessageToReact(messageObj)
    setShowEmojiDialog(true)
  }

  function openEmojiReactionsDialog(reactions) {
    setReactionToShow(reactions)
    setShowEmojiReactions(true)
  }
  
  function handleSubmitEmoji(emoji) {
    axios
      .put('chats/messages/edit/reaction', {
        emoji,
        reactMessage: messageToReact,
        protocall: 'newReaction'
      })
      .then(({ data }) => {
      })
      .catch(console.error)
  }

  useEffect(() => {
    // each message in the messages array has a reaction array. I want to add the updated reaction to the message that has the same id as the updated reaction, unless there is already a reaction with the same user.id, in which case I want to remove that reaction from the message and add the updated reaction to the message
    if (!updatedReaction) return
    const newArray = messages.map((obj) => {
      if (obj.id === updatedReaction.messageId) {
        const reactionIndex = obj.reactions.findIndex(
          (reaction) => reaction.user.id === updatedReaction.user.id
        )
        if (reactionIndex === -1) {
          obj.reactions.push(updatedReaction)
        } else {
          obj.reactions.splice(reactionIndex, 1)
          obj.reactions.push(updatedReaction)
        }
        return obj
      } else {
        return obj
      }
    })
    setMessages(newArray)

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
        // console.log('DATA: ', data)
        setTimeout(() => {
          setIsLightLoading(false)
          if (data.length < 50) setMessagesEnd(true)
          if (!data.length) {
            setMessagesEnd(true)
            return
          }
          if (messages.length && data[0].chatId !== messages[0].chatId) {
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
    if (!message) return
    setMessages([message, ...messages])
  }, [message])

  useEffect(() => {
    if (!updatedReaction.length) return
    const itemIndex = messages.findIndex(
      (item) => item.id === updatedReaction[0].reactMessage.id
    )
    const newArr = [...messages]
    newArr[itemIndex].reaction = updatedReaction
    setMessages(newArr)
  }, [updatedReaction])

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
          reactions: [],
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
          reactions: [],
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

  const mappedMessages = addDateMarkers(messages).map((message, index) => {
    return (
      <MessageCard
        handleEditMessage={handleEditMessage}
        key={index}
        message={message}
        otherUser={otherUser}
        openEmojiPickerDialog={openEmojiPickerDialog}
        openEmojiReactionsDialog={openEmojiReactionsDialog}
      />
    )
  })

  const mappedReactions = reactionToShow.map((item, index) => {
    return (
      <div key={index} className='reaction-dialog-item'>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px',}}>
          <Avatar
            sx={{ width: 30, height: 30, color: 'white' }}
            alt={item.user.username}
            src={item.user.profile_pic}
          />
          <Typography variant='h6'>{item.user.username}</Typography>
        </div>
        <Emoji style={{fontSize: '30px'}}>{item.emoji.shortcodes}</Emoji>
      </div>
    )
  })

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {showDownBtn && (
        <Button
          onClick={handleScrollDown}
          className={
            darkTheme
              ? 'to-bot-btn to-bot-btn-dark'
              : 'to-bot-btn to-bot-btn-light'
          }
        >
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
            handleSubmitEmoji(event)
            setShowEmojiDialog(false)
          }}
          theme={darkTheme ? 'dark' : 'light'}
        />
        {/* <Button variant='text' color={darkTheme ? 'blueBtn' : 'primary'} onClick={() => setShowEmojiDialog(false)}>Close</Button> */}
      </Dialog>
      <Dialog
        onClose={() => setShowEmojiReactions(false)}
        open={showEmojiReactions}
      >
        <Card className='reactions-dialog-card'>
          {mappedReactions}
          <Button variant='text' color={darkTheme ? 'blueBtn' : 'primary'} sx={{textTransform: 'none', fontSize: '18px'}} onClick={() => setShowEmojiReactions(false)}>close</Button>
        </Card>
      </Dialog>
    </div>
  )
}

export default ChatPage
