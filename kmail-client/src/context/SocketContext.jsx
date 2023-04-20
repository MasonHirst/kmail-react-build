import React, { createContext, useState, useEffect, useCallback, useLocalStorage } from 'react'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState()
  const [token] = useLocalStorage('jwtAccessToken')
  console.log({token});

  const send = useCallback((event, body) => {
    socket?.send(JSON.stringify({ event, body }))
  }, [socket])

  useEffect(() => {
    if (!token) return
    const ws = new WebSocket('ws://localhost:8085')
    ws.addEventListener('open', function (event) {
      send('authorize', {
        authorization: token,
      })
    })
    setSocket(ws)
  }, [token])

  useEffect(() => {
    if (!socket) return
    socket.addEventListener('message', function (event) {
      console.log('inside of listener: ', event.data)
      if (!event?.data) return
      let message = JSON.parse(event.data)
      setMessage(message)
    })
  }, [socket])

  const sendMessage = useCallback((body) => {
    send('chatMessage', body)
  }, [])

  return (
    <SocketContext.Provider value={{ message, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
