import React, { useContext, useState, useRef, useEffect } from 'react'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { Route, Routes, Navigate } from 'react-router-dom'
import NoChatPage from './NoChatPage'
import NewChatPage from './NewChatPage'
import ChatPage from './ChatPage'
import { SocketContext } from '../../../context/SocketContext'
import muiStyles from '../../../styles/muiStyles'
const { Button, Box } = muiStyles

const RightChatComponent = () => {
  const { setRightChatRef } = useContext(SocketContext)
  const { darkTheme } = useContext(DarkModeContext)
  const rightChatRef = useRef()

  useEffect(() => {
    setRightChatRef(rightChatRef)
  }, [rightChatRef])

  return (
    <Box ref={rightChatRef} className="right-chat-div" >
      <Routes>
        <Route path="/" element={<NoChatPage />} />
        <Route path="new" element={<NewChatPage />} />
        <Route path=":chat_id" element={<ChatPage rightChatRef={rightChatRef} />} />
      </Routes>
    </Box>
  )
}

export default RightChatComponent
