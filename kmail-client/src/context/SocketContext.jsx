import React, { createContext, useState, useEffect, useCallback, } from 'react'
import notificationSound from '../assets/positive-tone.mp3'

export const SocketContext = createContext()

const send = (socket, event, body) => {
    socket?.send(JSON.stringify({ event, body }))
}

export const SocketProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [updatedMessage, setUpdatedMessage] = useState('')
  const [socket, setSocket] = useState()
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8085')
    const token = localStorage.getItem('jwtAccessToken')
    ws.addEventListener('open', function () {
      send(ws, 'authorize', {
        authorization: token,
      })
    })

    ws.addEventListener('message', function (event) {
      // console.log(JSON.parse(event.data));
      if (!event?.data) return
      let messageData = JSON.parse(event.data)
      if (messageData.event_type === 'newMessage') {
        setMessage(messageData)
      } else if (messageData.event_type === 'updatedMessage') {
        setUpdatedMessage(messageData)
      }
    })
    
    setSocket(ws)
  }, [])

  useEffect(() => {
    if (!message) return
    const sound = new Audio(notificationSound)
    sound.volume = .3
    sound.play()
  }, [message])

  const sendMessage = useCallback((body) => {
    // console.log(!!socket)
    send(socket, 'chatMessage', body)
  }, [socket])

  return (
    <SocketContext.Provider value={{ message, sendMessage, updatedMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
