const fs = require('fs')
const http = require('http')

var methods = Object.create(null)
var port = 8976
var ipAddress = '127.0.0.1'


var server = http.createServer((req, res) => {
  function respond(code, body, type) {
    //该函数抽象了server响应
    if (!type) {
      type = 'text/plain'
    }
    res.writeHead(code, {
      'Content-Type': type,
    })
    if (body && body.pipe) {//如果body是一个可读流
      body.pipe(res)
    } else {
      res.end(body)
    }
  }
  if (req.method in methods) {
    //如果是已知的请求方法，则调用已有的方法
    methods[req.method](urlToPath(req.url), respond, req)
  } else {
    //如果是未知的方法，则返回设定好的response
    respond(405, 'Method' + req.method + 'not allowed')
  }
})
server.listen(port, ipAddress)

function urlToPath(url) {
  let path = require('path').parse(url).pathname
  return '.' + decodeURIComponent(path)
}

//在method上挂上处理各种请求的方法
//get 方法的处理，需要接路径和返回处理函数
methods.GET = function (path, respond) {
  fs.stat(path, function (err, stats) {
    if (err && err.code == 'ENOENT') {
      respond(404, 'File not found')
    } else if (stats.isDirectory()) {
      fs.readdir(path, function (err, files) {
        if (err) {
          respond(500, err.toString())
        } else {
          respond(200, files.join('\n'))
        }
      })
    } else {
      respond(200, fs.createReadStream(path), require('mime').getType(path))
    }
  })
}
methods.DELETE = function (path, respond) {
  return function (err) {
    if (err) {
      respond(500, err.toString())
    } else {
      respond(204)
    }
  }
}
