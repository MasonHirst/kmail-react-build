import React, { useState, useContext } from 'react'
import muiStyles from '../../styles/muiStyles'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../context/SocketContext'
import './menus.css'
import LeftMenuLabelCard from './LeftMenuLabelCard'
const {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InboxIcon,
  DraftsIcon,
  StarBorderIcon,
  AccessTimeIcon,
  SendIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  ScheduleSendIcon,
  ReportGmailerrorredIcon,
  DeleteOutlineIcon,
  MessageIcon,
  IconButton,
  Typography,
  AddIcon,
  Badge,
  ChatOutlinedIcon,
} = muiStyles

const LeftButtonsMenu = () => {
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [showMore, setShowMore] = useState(true)
  const { hideChatsNotifications } = useContext(SocketContext)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  // test array of label names
  const labelNamesArr = [
    'test label',
    'cool label',
    'thick emails',
    'secret emails',
  ]
  const mappedLabels = labelNamesArr.map((label) => {
    return <LeftMenuLabelCard key={label} labelName={label} />
  })

  return (
    <Box sx={{ width: '100%', maxWidth: 240, bgcolor: 'transparent' }}>
      <List
        component="nav"
        aria-label="main mailbox folders"
        dense
        className="rounded-right"
      >
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => {
            handleListItemClick(event, 0)
            navigate('/')
          }}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText className="text" primary="Inbox" />
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => {
            handleListItemClick(event, 1)
            navigate('/chats')
          }}
        >
          <ListItemIcon>
            <Badge
              color="error"
              variant="dot"
              overlap="circular"
              invisible={hideChatsNotifications}
            >
              <ChatOutlinedIcon />
            </Badge>
          </ListItemIcon>
          <Typography
            className="text"
            sx={!hideChatsNotifications ? {
              fontWeight: 'bold',
              fontSize: '15px !important',
            } : {}}
          >
            Chats
          </Typography>
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <StarBorderIcon />
          </ListItemIcon>
          <ListItemText className="text" primary="Starred" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText className="text" primary="Snoozed" />
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 4}
          onClick={(event) => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText className="text" primary="Sent" />
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 5}
          onClick={(event) => handleListItemClick(event, 5)}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText className="text" primary="Drafts" />
        </ListItemButton>

        <ListItemButton onClick={() => setShowMore(!showMore)}>
          <ListItemIcon>
            {showMore ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </ListItemIcon>
          <ListItemText primary={showMore ? 'More' : 'Less'} className="text" />
        </ListItemButton>

        {!showMore ? (
          <div>
            <ListItemButton
              selected={selectedIndex === 6}
              onClick={(event) => handleListItemClick(event, 6)}
            >
              <ListItemIcon>
                <ScheduleSendIcon />
              </ListItemIcon>
              <ListItemText className="text" primary="Scheduled" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 7}
              onClick={(event) => handleListItemClick(event, 7)}
            >
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText className="text" primary="Chats" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 8}
              onClick={(event) => handleListItemClick(event, 8)}
            >
              <ListItemIcon>
                <ReportGmailerrorredIcon />
              </ListItemIcon>
              <ListItemText className="text" primary="Spam" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 9}
              onClick={(event) => handleListItemClick(event, 9)}
            >
              <ListItemIcon>
                <DeleteOutlineIcon />
              </ListItemIcon>
              <ListItemText className="text" primary="Trash" />
            </ListItemButton>
          </div>
        ) : (
          ''
        )}
      </List>
      <div
        style={{
          width: '240px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: '16px',
          }}
        >
          <Typography variant="h6">Labels</Typography>
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>

        {/* Test label */}
        <List dense>{mappedLabels}</List>
      </div>
    </Box>
  )
}

export default LeftButtonsMenu
