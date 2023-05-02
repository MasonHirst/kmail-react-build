import React, { useEffect } from 'react'
import LeftChatComponent from './LeftChatComponent'
import RightChatComponent from './RightChatComponent'

const AllChats = () => {
  useEffect(() => {
    document.title = 'Kmail - chats'
    return () => {
      document.title = 'Kmail'
    }
  }, [])

  return (
    <div className="chats-general-div">
      <LeftChatComponent />
      <RightChatComponent />
    </div>
  )
}

export default AllChats
