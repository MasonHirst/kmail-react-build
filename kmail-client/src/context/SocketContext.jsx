import React, { createContext, useState, useEffect, useCallback, } from 'react'


export const SocketContext = createContext()

const send = (socket, event, body) => {
    socket?.send(JSON.stringify({ event, body }))
}

export const SocketProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState()
  
  // const send = useCallback(
  // }, [socket])
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8085')
    const token = localStorage.getItem('jwtAccessToken')
    ws.addEventListener('open', function () {
      console.log({token});
      send(ws, 'authorize', {
        authorization: token,
      })
    })

    ws.addEventListener('message', function (event) {
      console.log('inside of listener: ', event.data)
      if (!event?.data) return
      let message = JSON.parse(event.data)
      setMessage(message)
    })
    
    setSocket(ws)
  }, [])

  // useEffect(() => {
  //   if (!socket) return
    
  // }, [socket])

  const sendMessage = useCallback((body) => {
    console.log(!!socket)
    send(socket, 'chatMessage', body)
  }, [socket])

  return (
    <SocketContext.Provider value={{ message, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
