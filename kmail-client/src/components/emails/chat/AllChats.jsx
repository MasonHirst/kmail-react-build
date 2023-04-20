import React, { useState, useContext } from 'react'
import LeftChatComponent from './LeftChatComponent'
import RightChatComponent from './RightChatComponent'
import { AuthContext } from '../../../context/AuthenticationContext'
import io from 'socket.io-client'
import muiStyles from '../../../styles/muiStyles'
const {} = muiStyles

const AllChats = () => {


  return (
    <div className="chats-general-div">
      <LeftChatComponent />
      <RightChatComponent />
    </div>
  )
}

export default AllChats
