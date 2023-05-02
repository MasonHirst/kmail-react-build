import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import axios from 'axios'
import notificationSound from '../assets/positive-tone.mp3'
import { AuthContext } from './AuthenticationContext'

export const SocketContext = createContext()

const send = (socket, event, body) => {
  socket?.send(JSON.stringify({ event, body }))
}

export const SocketProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [updatedReaction, setUpdatedReaction] = useState([])
  const { user } = useContext(AuthContext)
  const [updatedMessage, setUpdatedMessage] = useState('')
  const [socket, setSocket] = useState()
  const [hideChatsNotifications, setHideChatsNotifications] = useState(true)
  const [conversations, setConversations] = useState([])

  console.success = function(message) {
    console.log("%c✅ " + message, "color: #04A57D; font-weight: bold;")
  }
  
  console.warning = function(message) {
    console.log("%c⚠️ " + message, "color: yellow; font-weight: bold;")
  }

  function getConversations() {
    axios.get('user/conversations/get')
      .then(({data}) => {
        setConversations(data)
      })
      .catch(err => {
        console.error('ERROR IN LEFT CHAT COMPONENT: ', err)
      })
  }
  useEffect(() => {
    getConversations()
  }, [message])
  useEffect(() => {
    if (!conversations.length) return
    const unreadChat = conversations.some((conv) => {
      return conv.latest_message.recipient_read === false && conv.latest_message.sender_id !== user.id
    })
    setHideChatsNotifications(!unreadChat)
  }, [conversations])

  let connectCounter = 0
  useEffect(() => {
    function connectClient() {
      const ws = new WebSocket('ws://localhost:8085')
      const token = localStorage.getItem('jwtAccessToken')

      ws.addEventListener('open', function () {
        if (connectCounter > 0) console.success('Reconnected to socket server')
        send(ws, 'authorize', {
          authorization: token,
        })
      })

      ws.addEventListener('message', function (event) {
        if (!event?.data) return
        let messageData = JSON.parse(event.data)
        if (messageData.event_type === 'newMessage') {
          setMessage(messageData.message)
        } else if (messageData.event_type === 'updatedMessage') {
          setUpdatedMessage(messageData.message)
        } else if (messageData.event_type === 'newReaction') {
          setUpdatedReaction(messageData.message)
        }
      })

      ws.addEventListener('close', function () {
        console.warning('Disconnected from socket server')
        connectCounter++
        setTimeout(() => {
          console.warning('Reconnecting...')
          connectClient() // try to reconnect after a delay
        }, 1000) // wait for 1 second before reconnecting
      })

      setSocket(ws)
    }
    connectClient()
  }, [])

  useEffect(() => {
    if (!message || message.sender_id === user.id) return
    const sound = new Audio(notificationSound)
    sound.volume = 0.3
    sound.play()
  }, [message])

  return (
    <SocketContext.Provider
      value={{
        message,
        setMessage,
        hideChatsNotifications,
        setHideChatsNotifications,
        updatedMessage,
        updatedReaction,
        conversations,
        setConversations,
        getConversations,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
