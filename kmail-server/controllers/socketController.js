const { WebSocketServer, WebSocket } = require('ws')
const wss = new WebSocketServer({ port: 8085 })
const { verifyAccessToken } = require('./authController')

const connections = {}
function sendMessageToClient(recipientId, message) {
  if (Array.isArray(recipientId)) {
    for (let i = 0; i < recipientId.length; i++) {
      const client = connections[recipientId[i]]
      if (!client) {
        console.log(`client ${recipientId[i]} person not online`)
        return
      }
      client.send(message)
    }
  } else {
    const client = connections[recipientId]
    if (!client) {
      console.log(`client ${recipientId} person not online`)
      return
    }
    client.send(message)
  }
}

module.exports = {
  sendMessageToClient,
  startSocketServer: async () => {
    wss.on('connection', function connection(ws, req) {
      try {
        // console.log('connection happened')
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
          } else if (event === 'chatMessage') {
            // pull recipient id from parsedData.body
            // send message to that one client
            const { text, recipient_id, createdAt } = body
            const newBody = JSON.stringify({
              event_type: 'newMessage',
              sender_id: ws.userId,
              text,
              createdAt,
            })
            if (!recipient_id) return console.log('recipient_id is required')
            sendMessageToClient(recipient_id, newBody)
          }
        })

        ws.on('close', function (event) {
          delete connections[ws.userId]
        })
      } catch (err) {
        console.error(err)
      }
    })
  },
}
