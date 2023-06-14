const { WebSocketServer, WebSocket } = require('ws')
const { verifyAccessToken } = require('./authController')
const seed = require('../util/seed')

const connections = {}
function sendMessageToClient(recipientId, event_type, message) {
  let array = Array.isArray(recipientId) ? [...recipientId] : [recipientId]

  for (let i = 0; i < array.length; i++) {
    const client = connections[array[i]]
    if (!client) {
      // console.log(`client ${array[i]} person not online`)
    } else {
      const body = JSON.stringify({ event_type, message })
      client.send(body)
    }
  }
}

async function startServer(app, port, db) {
  db.sync()
    .then(() => {
      const wss = new WebSocketServer({ server: app.listen(port) })
      wss.on('listening', () => console.log('SERVER LISTENING ON PORT 8080'))
      wss.on('connection', function connection(ws, req) {
        try {
          console.log('connection happened')
          ws.on('error', console.error)
          ws.on('message', async function message(data, isBinary) {
            const { event, body } = JSON.parse(data)
            if (event === 'authorize') {
              // validate jwt
              // associate userId to client
              // add to list of clients
              if (!body.authorization) return console.log('no authorization')
              const claims = await verifyAccessToken(body.authorization)
              ws.userId = claims.sub
              connections[claims.sub] = ws
            }
          })

          ws.on('close', function (event) {
            delete connections[ws.userId]
          })
        } catch (err) {
          console.error(err)
        }
      })
    })
}

module.exports = {
  sendMessageToClient,
  startServer,
}
