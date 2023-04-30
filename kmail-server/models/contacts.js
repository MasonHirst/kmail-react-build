const db = require('../util/dbConfig')
const { DataTypes, Sequelize } = require('sequelize')

const Contact = db.define('contact', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  favorited: {
    type: DataTypes.BOOLEAN,
  }
})

module.exports = Contact