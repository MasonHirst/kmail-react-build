//! Imports
const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const path = require('path')
const db = require('./util/dbConfig')
// const seed = require('./util/seed')

const User = require('./models/users')
const Message = require('./models/chats')
const Contact = require('./models/contacts')

//! Middleware
app.use(express.json())
app.use(cors())

//! Relationships
Message.belongsTo(User, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'recipient_id' });

User.hasMany(Contact)
Contact.belongsTo(User, { foreignKey: 'contact_id' })

//! Endpoints
const { checkUsernameAvailability, createAccount, findProfilePic, getUser, verifyLogin } = require('./controllers/authController')

// Unauthenticated endpoints
app.get('/validate/username/:username', checkUsernameAvailability)
app.post('/verify/login', verifyLogin)
app.get('/accounts/picture/:username', findProfilePic)
app.post('/accounts/create', createAccount)
app.get('/accounts/users', getUser)

// Authenticated endpoints


//! Server listen
const { SERVER_PORT } = process.env
db.sync()
// db.sync({force: true})
  .then(() => {
    app.listen(SERVER_PORT, () => console.log(`SERVER RUNNING ON SERVER_PORT ${SERVER_PORT}`))
  })