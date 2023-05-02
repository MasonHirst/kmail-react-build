import React, { useContext, useState, useEffect } from 'react'
import muiStyles from '../../../styles/muiStyles'
import axios from 'axios'
import { AuthContext } from '../../../context/AuthenticationContext';
import { ThreeDots } from 'react-loading-icons';
import { DarkModeContext } from '../../../context/DarkThemeContext'
import ChatContactCard from './ChatContactCard'
import { useNavigate } from 'react-router-dom'
const { Button, IconButton, ArrowBackOutlinedIcon, Typography } = muiStyles

const NewChatPage = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const { darkTheme } = useContext(DarkModeContext)
  const { isLightLoading, setIsLightLoading } = useContext(AuthContext)
  const [contacts, setContacts] = useState([])
  const [otherUsers, setOtherUsers] = useState([])
  const [searchMessage, setSearchMessage] = useState('Search for a username')

  useEffect(() => {
    document.title = 'Kmail - new chat'
  }, [])

  useEffect(() => {
    if (searchInput !== '') {
      setIsLightLoading(true)
      axios.get(`users/search/${searchInput}`)
        .then(({data}) => {
          setTimeout(() => {
            setIsLightLoading(false)
          }, 350)
          setOtherUsers(data)
          if (data.length < 1) setSearchMessage('No results')
        })
        .catch(err => {
          setTimeout(() => {
            setIsLightLoading(false)
          }, 350)
          console.error('ERROR IN NEWCHATPAGE: ', err)
        })
    } setSearchMessage('Search for a username')
  }, [searchInput])

  let mappedContacts
  let mappedOtherUsers = otherUsers.map((user, index) => {
    return <ChatContactCard user={user} key={index} />
  })

  return (
    <div style={{ height: '100%' }}>
      <div className="right-chat-header">
        <IconButton sx={{ marginLeft: '5px' }} onClick={() => navigate(-1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: '15px' }}>
          New Conversation
        </Typography>
      </div>
      <div className="right-chat-header">
        <Typography variant="h6" sx={{ marginLeft: '15px' }}>
          To:
        </Typography>
        <input
          autoFocus
          // ref={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={
            darkTheme
              ? 'new-chat-input margin-left-15px dark'
              : 'new-chat-input margin-left-15px light'
          }
          placeholder="type a username"
        />
      </div>
      <div className="new-chat-contacts">{mappedContacts}</div>
      <div className="new-chat-contacts">{isLightLoading ? <ThreeDots color="#007bff" size="50" style={{marginTop: '50px'}}/> : (mappedOtherUsers.length > 0 ? mappedOtherUsers : (<Typography sx={{marginTop: '50px', opacity: .7,}}>{searchMessage}</Typography>))}</div>
    </div>
  )
}

export default NewChatPage
