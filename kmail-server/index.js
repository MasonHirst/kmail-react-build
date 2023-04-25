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
const { WebSocketServer, WebSocket } = require('ws')
const wss = new WebSocketServer({ port: 8085 })

const connections = {}

wss.on('connection', function connection(ws, req) {
  try {
    // console.log('connection happened')
    ws.on('error', console.error)
    ws.on('message', async function message(data, isBinary) {
      const { event, body } = JSON.parse(data)
      if (event === 'authorize') {
        // validate jwt
        // associate userId to client
        // add to list of clients
        if (!body.authorization) return console.log('no authorization')
        const claims = await verifyAccessToken(body.authorization)
        ws.userId = claims.sub
        connections[claims.sub] = ws
      } else if (event === 'chatMessage') {
        // pull recipient id from parsedData.body
        // get client by userId
        // send message to that one client
        const { text, recipient_id, createdAt } = body
        console.log(createdAt)
        const newBody = JSON.stringify({ sender_id: ws.userId, text, createdAt })
        if (!recipient_id) return console.log('recipient_id is required')
        const client = connections[recipient_id]
        if (!client) return console.log('other person not online')
        client.send(newBody, { binary: isBinary })
      }
    })

    ws.on('close', function (event) {
      delete connections[ws.userId]
    })
  } catch (err) {
    console.error(err)
  }
})

//! Server listen
const { SERVER_PORT } = process.env
db.sync()
  // db.sync({ force: true })
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`SERVER RUNNING ON SERVER_PORT ${SERVER_PORT}`)
    )
  })
