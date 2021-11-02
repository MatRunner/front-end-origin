const fs = require('fs')
const path = require('path')
const http = require('http')
const fsp = fs.promises
const url = require('url')
const mime = require('mime')
const Mode = require('stat-mode')
const argvs = require('minimist')(process.argv.slice(2))
const open = require('open')

/*
主体内容较为简单，仅需开启http服务器，对client端的请求地址加以解析，返回对应文件即可
细节上：
1. url中对文字的编码处理
2. 使用url对地址进行解析，要去除掉？之后的部分，只得到地址的主体部分
3. 使用mime模块来识别服务器端的文件类型以便正确响应给client
4. file类型返回本身，directory类型返回文件列表
5. 使用模块转义文件的读取权限
6. 文件夹不带/时，要保证跳转路径的正确性，两种做法，一是href把路径写绝对路径，而是文件夹后面必加一个/
7. 将访问限制在目录内部，可以对请求路径先化简，也可以对请求后的文件做判断
8. 文件访问限制，对请求的隐藏类型文件的禁止，server端对隐藏文件的不展示
9. 文件显示的排序，由于显示了stat的相关信息，而排序是一个同步操作，stat必须等待完成后才能进行排序
10. 文件夹返回上一层
11. 文件夹直接显示index.html
12. 通过命令行传入参数来控制服务器的服务地址，是否开启cors，设定端口，是否自动开启页面
*/
var port = argvs.port || argvs.p || 8848
var baseDir = argvs._[0] || path.resolve('./')
var cors = argvs.cors || false
var isOpen = argvs.o || argvs.open || false
var server = http.createServer()
server.on('request', async (req, res) => {
  console.log('请求方法为：', req.method, '请求地址为：', req.url)

  let parseUrl = url.parse(req.url)//使用url模块解析地址
  let decodeUrl = decodeURIComponent(parseUrl.pathname)//对地址进行解码
  let normalizeUrl = path.normalize(decodeUrl)
  //对隐藏文件的处理，虽然不一定有这个隐藏文件,要使用当前系统的分隔符进行split，因为path方法处理后都会转换成当前系统的分隔符
  if (normalizeUrl.split(path.sep).some(ele => ele.startsWith('.'))) {
    res.writeHead(403, {
      'Content-Type': 'text/html;charset=utf-8'
    })
    res.write('access forbidden')
    res.end()
    return
  }


  let reqPath = path.join(baseDir, normalizeUrl)//拼接出请求的地址，顺便化简，直接避免请求越界
  let type = mime.getType(path.extname(reqPath))//使用mime模块获得文件的mime类型以便正确response
  console.log('最终请求地址为：', reqPath)
  try {
    var stat = await fsp.stat(reqPath)//根据文件还是文件夹，对响应进行分支处理
  } catch (e) {
    console.log('出错：', e)
    if (e.code == 'ENOENT') {
      res.write('no such file or directory')
    } else {
      res.write(e.code)
    }
    res.end()
    return//直接结束掉，否则下面还报错
  }



  //对于文件类型不加/的处理
  if (stat.isDirectory() && !decodeUrl.endsWith('/')) {
    res.writeHead(302, {
      Location: decodeUrl + '/' + (parseUrl.search ? parseUrl.search : '')
    })
    res.end()
    return
  }



  if (stat.isFile()) {
    fs.readFile(reqPath, (err, data) => {
      if (err) {
        console.log('出错：', err)
        if (err.code == 'ENOENT') {
          res.write('no such file or directory')
        } else {
          res.write(err.code)
        }
        res.end()
      } else {
        if (cors) {
          res.setHeader('Access-Control-Allow-Access', '*')
        }
        res.writeHead(200, {
          'Content-Type': `${type};charset=utf-8`
        })
        res.write(data)
        res.end()
      }
    })
  } else if (stat.isDirectory()) {
    let rootMode = new Mode(stat)
    let files = await fsp.readdir(reqPath, { withFileTypes: true })
    if (cors) {
      res.setHeader('Access-Control-Allow-Access', '*')
    }
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8'
    })
    //跳转到index页面
    let index = files.filter(file => file.name == 'index.html' && file.isFile())
    if (index.length > 0) {
      let indexData = await fsp.readFile(path.join(reqPath, 'index.html'))
      res.write(indexData)
      res.end()
      return
    }

    let body = `
    <h1>Index of ${decodeUrl}</h1>
    <table>
      <tbody>
      <tr><td>(${rootMode.toString()})</td><td></td><td><a href='../'>../</a></td></tr>

    `
    //文件的并行读取写法，由于还要获得文件的读取权限和大小，所以必须使用stat
    //此处的Promise.all写的比较复杂，filter过滤掉隐藏文件夹，map将file映射为promise并等待所有文件
    //出大问题：排序是一个同步操作，而且又需要读取stat，因此stat必须是同步的，promise.all不能使用
    await Promise.all(files.filter(file => !file.name.startsWith('.')).sort((a, b) => {
      if (a.isFile() && b.isDirectory()) {
        return 1
      }
      if (a.isDirectory() && b.isFile()) {
        return -1
      }
      if (a.isFile() && b.isFile()) {
        if (a.name > b.name) { return 1 }
        if (a.name < b.name) { return -1 }
        if (a.name == b.name) { return 0 }
      }
      if (a.isDirectory() && b.isDirectory()) {
        if (a.name > b.name) { return 1 }
        if (a.name < b.name) { return -1 }
        if (a.name == b.name) { return 0 }
      }
    }).map(file => fsp.stat(path.join(reqPath, file.name)).then(stat => {
      if (stat.isFile()) {
        let mode = new Mode(stat)
        let fileSize = stat.size
        let displaySize = ''
        if (fileSize < 1024) {
          displaySize += fileSize + 'B'
        } else if (fileSize >= 1024 && fileSize < 1024 * 1024) {
          displaySize += (fileSize / 1024).toFixed(1) + 'KB'
        } else if (fileSize >= 1024 * 1024) {
          displaySize += (fileSize / 1024 / 1024).toFixed(1) + 'MB'
        }
        body += `<tr><td>(${mode.toString()})</td><td>${displaySize}</td><td><a href='${file.name}'>${file.name}</a></td></tr>`
      } else if (stat.isDirectory()) {
        let dirMode = new Mode(stat)
        body += `<tr><td>(${dirMode.toString()})</td><td></td><td><a href='${file.name}/'>${file.name}/</a></td></tr>`
      }
    })))


    //文件串行读取,先过滤隐藏，后排序;虽然硬盘只能是串行读取的，效果没差，但还是优先保证逻辑的正确性
    // let treatedFiles = files.filter(file => !file.name.startsWith('.')).sort((a, b) => {
    //   if (a.isFile() && b.isDirectory()) {
    //     return 1
    //   }
    //   if (a.isDirectory() && b.isFile()) {
    //     return -1
    //   }
    //   if (a.isFile() && b.isFile()) {
    //     if (a.name > b.name) { return 1 }
    //     if (a.name < b.name) { return -1 }
    //     if (a.name == b.name) { return 0 }
    //   }
    //   if (a.isDirectory() && b.isDirectory()) {
    //     if (a.name > b.name) { return 1 }
    //     if (a.name < b.name) { return -1 }
    //     if (a.name == b.name) { return 0 }
    //   }
    // })
    // for (let file of treatedFiles) {
    //   if (file.isFile()) {
    //     let fileStat = await fsp.stat(path.join(reqPath, file.name))
    //     let mode = new Mode(fileStat)
    //     let fileSize = fileStat.size
    //     let displaySize = ''
    //     if (fileSize < 1024) {
    //       displaySize += fileSize + 'B'
    //     } else if (fileSize >= 1024 && fileSize < 1024 * 1024) {
    //       displaySize += (fileSize / 1024).toFixed(1) + 'KB'
    //     } else if (fileSize >= 1024 * 1024) {
    //       displaySize += (fileSize / 1024 / 1024).toFixed(1) + 'MB'
    //     }
    //     body += `<tr><td>(${mode.toString()})</td><td>${displaySize}</td><td><a href='${file.name}'>${file.name}</a></td></tr>`
    //   } else if (file.isDirectory()) {
    //     let dirStat = await fsp.stat(path.join(reqPath, file.name))
    //     let dirMode = new Mode(dirStat)
    //     body += `<tr><td>(${dirMode.toString()})</td><td></td><td><a href='${file.name}/'>${file.name}/</a></td></tr>`
    //   }
    // }
    body += `</tbody>
    </table>
    <br/>
    <address>Node.js ${process.version} / server running @ ${req.socket.localAddress}:${port}</address>
    `
    res.write(body)
    res.end()
  }
})

server.listen(port, () => {
  console.log('listen on port:', port)
  if (isOpen) {
    open('http://127.0.0.1:' + port)
  }
})