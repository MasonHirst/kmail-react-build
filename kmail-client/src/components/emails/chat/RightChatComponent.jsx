import React, { useContext, useState } from 'react'
import { DarkModeContext } from '../../../context/DarkThemeContext'
import { Route, Routes, Navigate } from 'react-router-dom'
import NoChatPage from './NoChatPage'
import NewChatPage from './NewChatPage'
import ChatPage from './ChatPage'
import muiStyles from '../../../styles/muiStyles'
const { Button } = muiStyles

const RightChatComponent = () => {
  const { darkTheme } = useContext(DarkModeContext)

  return (
    <div className="right-chat-div">
      <Routes>
        <Route path="/" element={<NoChatPage />} />
        <Route path="new" element={<NewChatPage />} />
        <Route path=":chat_id" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default RightChatComponent
