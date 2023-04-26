import React from 'react'
import LeftChatComponent from './LeftChatComponent'
import RightChatComponent from './RightChatComponent'

const AllChats = () => {
  return (
    <div className="chats-general-div">
      <LeftChatComponent />
      <RightChatComponent />
    </div>
  )
}

export default AllChats
