const { createServer } = require('http')
var net = require('net')
var fs = require('fs')
var server = net.createServer()
var storage = parseStorage()
server.on('connection', conn => {
  conn.on('data', data => {
    let str = data.toString()
    let [head, body] = str.split('\r\n\r\n')
    let header = head.split('\r\n')[0]
    let [method, url] = header.split(' ')
    if (method == 'POST') {
      let [title, content] = body.split('&').map(x => x.split('=')[1])
      let time = new Date().toString()
      let mess = {
        'title': decodeURIComponent(title),
        'content': decodeURIComponent(content),
        'time': time,
      }
      storage.push(mess)
      save(storage)
      conn.write('HTTP/1.1 301 MOVE\r\n')//应该是跳转命令
      conn.write('Location: /\r\n')
      conn.write('\r\n')
      conn.end()
    }
    if (method == 'GET' && url == '/favicon.ico') {
      let img = fs.readFileSync('./icon.png')
      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('Content-Type: image/png\r\n')
      conn.write('\r\n')
      conn.write(img)
      conn.end()
    }
    if (url == '/' && method == 'GET') {
      let message = ''
      for (let i = storage.length - 1; i >= 0; i--) {
        message += '<h2>' + storage[i].title + '</h2>'
        message += '<div>' + storage[i].content + '</div>'
        message += '<em>' + storage[i].time + '</em>'
      }
      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('Content-Type: text/html\r\n')
      conn.write('\r\n')
      conn.write(`
      <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>公告板</title>
    </head>
    <style>
      * {
        box-sizing: border-box;
      }
    
      body,
      html {
        margin: 0;
        width: 100%;
        height: 100%;
      }
    
      body {
        display: flex;
      }
    
      aside {
        width: 20%;
        height: 500px;
        border: 1px solid;
        height: 100%;
      }
    
      form {
        width: 100%;
        height: 100%;
      }
    
      main {
        width: 80%;
        height: 100%;
      }
    
      textarea {
        width: 100%;
        height: 80%;
      }
    
      input {
        width: 100%;
        height: 10%;
      }
    </style>
    
    <body>
      <aside>
        <form method="POST" action="">
          <input type="text" name='title'><br>
          <textarea name="content" id="" cols="30" rows="10"></textarea><br>
          <button type="submit">提交</button><br>
        </form>
      </aside>
      <main>
      ${message}
      </main>
    </body>
    
    </html>`)
      conn.end()
    }
  })
})
server.listen(8848, () => {
  console.log('listening port 8848')
})


function parseStorage() {
  try {
    let str = fs.readFileSync('./storage.json')
    return JSON.parse(str)
  } catch (e) {
    return []
  }
}
function save(message) {
  let str = JSON.stringify(message)
  fs.writeFileSync('./storage.json', str)
}