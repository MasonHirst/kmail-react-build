import React from 'react'
import './emails.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AllChats from './chat/AllChats'
import BasicInbox from './BasicInbox'
import muiStyles from '../../styles/muiStyles'
const { Paper } = muiStyles

const AllEmails = () => {
  return (
    <Paper
      sx={{
        marginLeft: { xs: 0, sm: 0, md: 0, lg: '15px' },
        minWidth: { xs: '200px', sm: '200px', md: '200px', lg: '700px' },
        height: {xs: 'calc(100vh - 64px)', lg: 'calc(100vh - 80px)'},
        borderRadius: {xs: 0, lg: '20px'}
      }}
      className="emails-page-div-general"
    >
      <Routes>
        <Route path="/inbox" element={<BasicInbox />} />
        <Route path="chats/*" element={<AllChats />} />
        <Route path="*" element={<Navigate to="/inbox" />} />
      </Routes>
    </Paper>
  )
}

export default AllEmails
