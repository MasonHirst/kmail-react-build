const User = require('../models/users')
const passwordValidator = require('password-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { JWT_SIGNING_SECRET } = process.env

function signAccessToken(claims) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      claims,
      JWT_SIGNING_SECRET,
      { algorithm: 'HS256' },
      (error, token) => {
        if (error) reject(error)
        else resolve(token)
      }
    )
  })
}

function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SIGNING_SECRET, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}

module.exports = {
  checkUsernameAvailability: async (req, res) => {
    console.log('token: ', req.headers.authorization)
    try {
      let usernameTaken = await User.findAll({
        where: { username: req.params.username },
      })
      if (usernameTaken.length !== 0) {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    } catch (err) {
      res.status(403).send(err)
    }
  },

  createAccount: async (req, res) => {
    const { username, password, darkMode, picUrl } = req.body
    try {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      let createAccount = await User.create({
        username,
        hashed_pass: hash,
        dark_mode: darkMode,
        profile_pic: picUrl,
        api_connected: false,
        admin: false,
        one_time_pass: null,
      })

      res.status(200).send(createAccount)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  findProfilePic: async (req, res) => {
    console.log(req.params.username)
    try {
      let user = await User.findAll({
        where: { username: req.params.username },
      })
      let picUrl = user[0].profile_pic
      res.send(picUrl)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  verifyLogin: async (req, res) => {
    const { username, password } = req.body
    try {
      let user = await User.findOne({ where: { username } })
      let authenticated
      if (user) {
        authenticated = bcrypt.compareSync(password, user.hashed_pass)
        delete user.dataValues.hashedPass
      } else return res.status(200).send('incorrect username or password')

      if (authenticated && user) {
        const accessToken = await signAccessToken({ sub: user.id })
        return res.status(200).send({
          accessToken,
          user,
        })
      } else return res.status(200).send('incorrect username or password')
    } catch (err) {
      res.status(403).send(err)
    }
  },
}
