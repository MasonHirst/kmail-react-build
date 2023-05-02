const db = require('../util/dbConfig')
const { DataTypes, Sequelize } = require('sequelize')

const Message = db.define('message', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  text: {
    type: DataTypes.STRING({ length: 1000 }),
  },
  edited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  type: { type: DataTypes.STRING },
  recipient_read: { type: DataTypes.BOOLEAN, },
  sender_deleted: { type: DataTypes.BOOLEAN, },
  recipient_deleted: { type: DataTypes.BOOLEAN, },
})

module.exports = Message
