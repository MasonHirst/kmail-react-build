//! Imports
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
// const path = require('path')
const db = require('./util/dbConfig')

const User = require('./models/users')
const Contact = require('./models/contacts')
const Message = require('./models/messages')
const Chat = require('./models/chats')

//! Middleware
app.use(express.json())
app.use(cors())

//! Relationships
Message.belongsTo(User, { foreignKey: 'sender_id' })
Message.belongsTo(User, { foreignKey: 'recipient_id' })
Message.belongsTo(Chat, { foreignKey: 'chat_id' })

Chat.belongsTo(User, { foreignKey: 'user1' })
Chat.belongsTo(User, { foreignKey: 'user2' })

User.hasMany(Contact)
Contact.belongsTo(User, { foreignKey: 'contact_id' })

//! Endpoints
const {
  checkUsernameAvailability,
  createAccount,
  validateToken,
  findProfilePic,
  getUser,
  registerUser,
  updateProfilePic,
  verifyLogin,
  getLocalUser,
  verifyAccessToken,
} = require('./controllers/authController')
const {
  updateDarkMode,
  getOtherUsers,
  createChat,
  getChat,
  getConversations,
  getLatestMessage,
  createMessage,
  getAllMessages,
  editMessage,
} = require('./controllers/userController')
// const { getLabels, getTestInfo } = require('./emailFetch')
const { getTestInfo } = require('./controllers/emailApiController')

// Unprotected endpoints
app.get('/validate/username/:username', checkUsernameAvailability)
app.post('/verify/login', verifyLogin)
app.get('/accounts/picture/:username', findProfilePic)
app.post('/accounts/create', createAccount)
app.get('/accounts/local/:id', getLocalUser)
app.put('/accounts/update/picture', updateProfilePic)

// Protected endpoints
app.get('/accounts/users', validateToken, getUser)
app.get('/user/emails/get/all', getTestInfo) //add back validation
app.put('/user/update/dark_mode', validateToken, updateDarkMode)
app.get('/users/search/:string', validateToken, getOtherUsers)
app.post('/chats/create', validateToken, createChat)
app.get('/chats/get/:id', validateToken, getChat)
app.get('/user/conversations/get', validateToken, getConversations)
app.get('/chat/:id/messages', validateToken, getLatestMessage)
app.post('/chats/messages/create', validateToken, createMessage)
app.get('/chat/:id/messages/:offset/:limit', validateToken, getAllMessages)
app.put('/chats/messages/edit', validateToken, editMessage)

//! Socket server
const { startSocketServer } = require('./controllers/socketController')
startSocketServer()

//! Server listen
const { SERVER_PORT } = process.env
db.sync()
  // db.sync({ force: true })
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`SERVER RUNNING ON SERVER_PORT ${SERVER_PORT}`)
    )
  })
