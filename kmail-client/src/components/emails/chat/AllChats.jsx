import React, { useState, useContext } from 'react'
import LeftChatComponent from './LeftChatComponent'
import RightChatComponent from './RightChatComponent'
import { AuthContext } from '../../../context/AuthenticationContext'
import muiStyles from '../../../styles/muiStyles'
const {} = muiStyles

const AllChats = () => {
  // const { setUpdateMessages, updateMessages } = useContext(AuthContext)

  return (
    <div className="chats-general-div">
      <LeftChatComponent />
      <RightChatComponent />
    </div>
  )
}

export default AllChats
