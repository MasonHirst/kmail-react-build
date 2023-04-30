const db = require('../util/dbConfig')
const { DataTypes, Sequelize } = require('sequelize')

const Reactions = db.define('reaction', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  emoji: {
    type: DataTypes.JSON,
  },
})

module.exports = Reactions
