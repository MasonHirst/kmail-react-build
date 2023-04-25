const User = require('../models/users')
const { sendMessageToClient } = require('./socketController')
const Message = require('../models/messages')
const Chat = require('../models/chats')
require('dotenv').config()
const { Op } = require('sequelize')

module.exports = {
  updateDarkMode: async (req, res) => {
    const { darkMode, userId } = req.body
    try {
      const updated = await User.update(
        { dark_mode: darkMode },
        { where: { id: userId } }
      )
      res.status(200).send(updated)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  getOtherUsers: async (req, res) => {
    const { string } = req.params
    const { userId } = req.body
    try {
      const otherUsers = await User.findAll({
        where: {
          username: {
            [Op.iLike]: `%${string}%`,
          },
          id: {
            [Op.not]: userId,
          },
        },
      })
      const filteredUsers = otherUsers.map((user) => {
        let object = {
          id: user.id,
          profile_pic: user.profile_pic,
          username: user.username,
        }
        return object
      })
      res.status(200).send(filteredUsers)
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },

  createChat: async (req, res) => {
    const { recipient, userId } = req.body
    try {
      const findChat = await Chat.findOne({
        where: {
          [Op.or]: [
            { user1: recipient, user2: userId },
            { user1: userId, user2: recipient },
          ],
        },
      })
      // console.log(findChat)
      if (findChat) {
        return res.status(200).send(findChat)
      } else {
        const createChat = await Chat.create({
          last_message: null,
          user1: userId,
          user2: recipient,
        })
        res.status(200).send(createChat)
      }
    } catch (err) {
      res.status(403).send(err)
    }
  },

  getChat: async (req, res) => {
    const { id, offset } = req.params
    try {
      const chat = await Chat.findOne({ where: { id } })
      const user1 = await User.findOne({ where: { id: chat.user1 } })
      const user2 = await User.findOne({ where: { id: chat.user2 } })

      chat.user1 = {
        id: user1.id,
        username: user1.username,
        profile_pic: user1.profile_pic,
      }
      // delete chat.dataValues.user
      chat.user2 = {
        id: user2.id,
        username: user2.username,
        profile_pic: user2.profile_pic,
      }
      res.status(200).send(chat)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  getConversations: async (req, res) => {
    const { userId } = req.body
    try {
      const conversations = await Chat.findAll({
        where: {
          [Op.or]: [{ user1: userId }, { user2: userId }],
        },
        order: [['last_message', 'DESC']],
      })

      let loopedConversations = []
      for (i = 0; i < conversations.length; i++) {
        let hasMessage = await Message.findOne({
          where: { chat_id: conversations[i].id },
        })
        if (hasMessage) {
          if (conversations[i].user1 === userId) {
            let otherUser = await User.findOne({
              where: { id: conversations[i].user2 },
            })
            loopedConversations.push({
              chat: conversations[i],
              username: otherUser.username,
              profile_pic: otherUser.profile_pic,
            })
          } else {
            let otherUser = await User.findOne({
              where: { id: conversations[i].user1 },
            })
            loopedConversations.push({
              chat: conversations[i],
              username: otherUser.username,
              profile_pic: otherUser.profile_pic,
            })
          }
        }
      }

      res.status(200).send(loopedConversations)
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },

  getLatestMessage: async (req, res) => {
    const { id } = req.params
    try {
      const message = await Message.findOne({
        where: { chat_id: id },
        order: [['createdAt', 'DESC']],
      })
      res.send(message)
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },

  getAllMessages: async (req, res) => {
    const { id, offset, limit } = req.params
    try {
      const messages = await Message.findAll({
        where: { chat_id: id },
        order: [['createdAt', 'DESC']],
        limit: limit, // load only 'limit' number of messages
        offset: offset * limit,
      })
      res.send(messages)
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },

  createMessage: async (req, res) => {
    const { userId, text, recipient, chat } = req.body
    try {
      let message = Message.create({
        text,
        edited: false,
        reaction: { emoji: '' },
        sender_id: userId,
        recipient_id: recipient,
        chat_id: chat,
        recipient_read: false,
        sender_deleted: false,
        recipient_deleted: false,
      })
      if (message) {
        let updateChat = await Chat.update(
          { last_message: new Date() },
          { where: { id: chat } }
        )
      }
      res.send(message)
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },

  editMessage: async (req, res) => {
    const { event, editorId, recipient_id, text, messageId } = req.body
    try {
      if (event === 'editMessage') {
        const updatedText = await Message.update(
          { text, edited: true },
          { where: { id: messageId } }
        )
        const body = JSON.stringify({
          event_type: 'updatedMessage',
          messageId,
          text,
          id: messageId,
        })
        sendMessageToClient([editorId, recipient_id], body)
        return res.send(updatedText)
      } else if (event === 'newReaction') {
        res.send('function needs finishing')
      }
      res.send('unknown protocall request')
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },
}

// {
//   text: '',
//   edited: false,
//   reaction: {emoji: ''},
//   sender_id: userId,
//   recipient_id: recipient,
// }

// try {
//   res.send('you made it')
// } catch (err) {
//   console.log(err)
//   res.status(403).send(err)
// }
