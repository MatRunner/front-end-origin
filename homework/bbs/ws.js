const { WebSocketServer } = require('ws')
const wss = new WebSocketServer({ port: 8686 })

wss.on('connection', function (ws) {
  console.log('comes!')
  var i = 0
  ws.on('message', function (message) {
    console.log(message)
  })
  setInterval(() => {
    ws.send(i++)
  }, 1000)
})