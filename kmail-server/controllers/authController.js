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
    if (!token) throw new Error('token is required')
    jwt.verify(token, JWT_SIGNING_SECRET, (error, data) => {
      if (error) reject(error)
      else resolve(data)
    })
  })
}
 

module.exports = {
  verifyAccessToken,
  validateToken: async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization
      const { sub } = await verifyAccessToken(accessToken)
      if (!sub) return res.status(401).send('bro, your access token is no good')
      if (!accessToken) return res.status(401).send('where is your access token bro?')
      req.body.userId = sub
      next()
    } catch (err) {
      console.log(err)
      res.status(403).send(err)
    }
  },
  
  checkUsernameAvailability: async (req, res) => {
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
    const { name1, name2, username, pass1 } = req.body
    try {
      if (/\d/.test(name1) || /\d/.test(name2)) return res.status(200).send('Names cannot contain numbers')
      if (/[^a-zA-Z0-9_]/.test(username)) return res.status(200).send("The username contains invalid characters")
      if (/[^a-zA-Z0-9$!#@%^&*()_<>?+]/.test(pass1)) return res.status(200).send("The password contains invalid characters")
      if (pass1.length < 8) return res.status(200).send('Password must be at least 8 characters')
      const foundUsername = await User.findAll({ where: { username } })
      if (foundUsername.length > 0) return res.status(200).send('Username is taken')

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(pass1, salt)

      let createAccount = await User.create({
        first_name: name1,
        last_name: name2,
        username,
        hashed_pass: hash,
        dark_mode: true,
        profile_pic: '',
        api_connected: false,
        admin: false,
        one_time_pass: null,
      })
      delete createAccount.dataValues.hashed_pass

      if (createAccount) {
        const accessToken = await signAccessToken({ sub: createAccount.id })
        return res.status(200).send({
          accessToken,
          createAccount,
        })
      } else return res.status(200).send('incorrect username or password')

      // res.status(200).send(createAccount)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  findProfilePic: async (req, res) => {
    try {
      let user = await User.findAll({
        where: { username: req.params.username },
      })
      let basicUser = {
        profile_pic: user[0].profile_pic,
        username: user[0].username
      }
      res.send(basicUser)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  updateProfilePic: async (req, res) => {
    const { accessToken, chosenPic } = req.body
    try {
      const { sub } = await verifyAccessToken(accessToken)
      if (!sub) return res.status(200).send('Invalid access token')
      const updatedPic = await User.update({ profile_pic: chosenPic }, { where: { id: sub } })
      res.status(200).send(updatedPic)
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

  getUser: async (req, res) => {
    const accessToken = req.headers.authorization
    try {
      const { sub } = await verifyAccessToken(accessToken)
      if (!sub) throw new Error('unauthorized')
      let user = await User.findOne({ where: { id: sub }})
      delete user.dataValues.hashed_pass
      return res.send(user)
    } catch (err) {
      res.status(403).send(err)
    }
  },

  getLocalUser: async (req, res) => {
    const {id} = req.params 
    try {
      const user = await User.findOne({ where: { id } })
      const basicUser = {
        username: user.username,
        profile_pic: user.profile_pic
      }
      res.status(200).send(basicUser)
    } catch (err) {
      res.status(403).send(err)
    }
  },

}
