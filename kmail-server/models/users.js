const db = require('../util/dbConfig')
const { DataTypes, Sequelize } = require('sequelize')

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING({ length: 35 }),
    allowNull: false,
  },
  hashed_pass: {
    type: DataTypes.STRING({ length: 500 }),
    allowNull: false,
  },
  dark_mode: DataTypes.BOOLEAN,
  profile_pic: DataTypes.STRING({ length: 500 }),
  api_connected: DataTypes.BOOLEAN,
  admin: DataTypes.BOOLEAN,
  one_time_pass: DataTypes.STRING({ length: 500 }),
})

module.exports = User