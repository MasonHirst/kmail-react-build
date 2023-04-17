import React from 'react'
import './emails.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AllChats from './chat/AllChats'
import BasicInbox from './BasicInbox'
import muiStyles from '../../styles/muiStyles'
const {Paper} = muiStyles

const AllEmails = () => {
  return (
    <Paper className='emails-page-div-general'>
      <Routes>
        <Route path='/inbox' element={<BasicInbox />} />
        <Route path='chats/*' element={<AllChats />} />
        <Route path='*' element={<Navigate to="/inbox" />} />
      </Routes>
    </Paper>
  )
}

export default AllEmails