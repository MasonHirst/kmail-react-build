const User = require('../models/users')
const { sendMessageToClient } = require('./socketController')
const Message = require('../models/messages')
const Chat = require('../models/chats')
const Reaction = require('../models/reactions')
require('dotenv').config()
const { Op } = require('sequelize')
const { Sequelize } = require('sequelize')

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
      console.error(err)
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

      if (findChat) {
        return res.status(200).send(findChat)
      } else {
        const createChat = await Chat.create({
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
        include: [
          {
            model: Message,
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
          {
            model: User,
          },
        ],
      })
      let loopedConversations = []
      for (let i = 0; i < conversations.length; i++) {
        const convo = conversations[i].dataValues
        const otherUser = userId === convo.user1 ? convo.user2 : convo.user1
        const user = await User.findOne({ where: { id: otherUser } })
        let obj = { chat: convo, otherUser: user.dataValues, latest_message: convo.messages[0], }
        if (obj.latest_message) loopedConversations.push(obj)
      }

      const sortedConvos = loopedConversations.sort((a, b) => {
        const dateA = new Date(a.latest_message.createdAt)
        const dateB = new Date(b.latest_message.createdAt)
        return dateB - dateA
      })
      res.send(sortedConvos)
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  getLatestMessage: async (req, res) => {
    const { id } = req.params
    try {
      const message = await Message.findOne({
        where: { chatId: id },
        order: [['createdAt', 'DESC']],
      })
      res.send(message)
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  getAllMessages: async (req, res) => {
    const { id, offset, limit } = req.params
    try {
      const messages = await Message.findAll({
        where: { chatId: id },
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset * limit,
        include: [
          {
            model: Reaction,
            as: 'reactions',
            required: false,
            include: [
              {
                model: User,
                as: 'user',
              },
            ],
          },
        ],
      })

      res.send(messages)
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  createMessage: async (req, res) => {
    const { userId, text, recipient, chat, messageType } = req.body
    try {
      const message = await Message.create({
        text,
        edited: false,
        sender_id: userId,
        recipient_id: recipient,
        chatId: chat,
        recipient_read: false,
        sender_deleted: false,
        recipient_deleted: false,
        type: messageType
      })
      await message.reload({
        include: [
          {
            model: Reaction,
            as: 'reactions',
          },
        ],
      })
      if (message) {
        sendMessageToClient(
          [message.recipient_id, message.sender_id],
          'newMessage',
          message.dataValues
        )
        // let updateChat = await Chat.update(
        //   { last_message: new Date() },
        //   { where: { id: chat } }
        // )
      }
      res.send(message)
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  editMessage: async (req, res) => {
    const { editorId, recipient_id, text, messageId } = req.body
    try {
      const updatedText = await Message.update(
        { text, edited: true },
        { where: { id: messageId } }
      )
      const body = {
        messageId,
        text,
        id: messageId,
      }
      sendMessageToClient([editorId, recipient_id], 'updatedMessage', body)
      res.send(updatedText)
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  editReaction: async (req, res) => {
    const { emoji, reactMessage, userId } = req.body
    try {
      // I need to determine if the user has already reacted to this message, if so, I need to update the reaction instead of creating a new one
      const reaction = await Reaction.findOne({
        where: {
          messageId: reactMessage.id,
          userId,
        },
      })
      if (reaction) {
        const updatedReaction = await Reaction.update(
          { emoji },
          { where: { id: reaction.id }, returning: true, plain: true }
        )
        await updatedReaction[1].reload({
          include: [{ model: User, as: 'user' }],
        })
        sendMessageToClient(
          [reactMessage.sender_id, reactMessage.recipient_id],
          'newReaction',
          updatedReaction[1]
        )
        res.send(updatedReaction[1])
      } else {
        const newReaction = await Reaction.create({
          emoji,
          messageId: reactMessage.id,
          userId,
        })

        await newReaction.reload({
          include: [{ model: User, as: 'user' }],
        })
        delete newReaction.user.dataValues.hashed_pass
        sendMessageToClient(
          [reactMessage.sender_id, reactMessage.recipient_id],
          'newReaction',
          newReaction
        )
        res.send(newReaction)
      }
    } catch (err) {
      console.error(err)
      res.status(403).send(err)
    }
  },

  markMessagesRead: async (req, res) => {
    const { chat_id } = req.params
    const { userId } = req.body
    try {
      const readMessages = await Message.update(
        { recipient_read: true },
        {
          where: {
            chatId: chat_id,
            recipient_id: userId,
            recipient_read: false,
          },
        }
      )
      res.send(readMessages)
    } catch (err) {
      res.status(403).send(err)
    }
  },
}
