import React, { useState, useContext } from 'react'
import LeftChatComponent from './LeftChatComponent'
import RightChatComponent from './RightChatComponent'
import { AuthContext } from '../../../context/AuthenticationContext'
import io from 'socket.io-client'
import muiStyles from '../../../styles/muiStyles'
const {} = muiStyles

const AllChats = () => {
  // const { setUpdateMessages, updateMessages } = useContext(AuthContext)

  // const socket = io('http://localhost:8080')
  // socket.on('connect', () => {
  //   console.log('Connected to socket.io server!')
  // })

  return (
    <div className="chats-general-div">
      <LeftChatComponent />
      <RightChatComponent />
    </div>
  )
}

export default AllChats
