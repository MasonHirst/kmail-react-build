const db = require('../util/dbConfig')
const { DataTypes, Sequelize } = require('sequelize')

const Chat = db.define('chat', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  last_message: {
    type: DataTypes.DATE
  }
})

module.exports = Chat