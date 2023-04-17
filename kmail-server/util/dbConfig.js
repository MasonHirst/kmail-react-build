const Sequelize = require('sequelize')
require('dotenv').config()
const DB_CONNECTION_STR = process.env.DATABASE_CONNECTION_STRING

const db = new Sequelize(
   DB_CONNECTION_STR,
   {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false,
         }
      }
   }
)

module.exports = db