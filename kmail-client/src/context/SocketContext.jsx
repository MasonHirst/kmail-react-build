import React, { createContext } from 'react'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socket = new WebSocket('ws://localhost:8085')

  socket.addEventListener('open', function (event) {
    console.log('connected to ws server ')
  })
  socket.addEventListener('message', function (data) {
    console.log('message from the bro: ', data)
  })

  return (
    <SocketContext.Provider value={{ socket, children }}>
      {children}
    </SocketContext.Provider>
  )
}
