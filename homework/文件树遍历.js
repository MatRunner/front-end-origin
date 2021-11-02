var path = require('path')
var fs = require('fs')
var fsp = fs.promises
function listFilesSync(route) {
  var res = []
  var dirPath = path.resolve(route)//解析出当前文件夹的绝对路径
  var ary = fs.readdirSync(dirPath, 'utf8')//同步读取文件
  //------------------------------------------------小改动版
  // var ary = fs.readdirSync(dirPath, { withFileTypes: true })//传入此参数后，返回的是Dirent类的对象
  // for (let file of ary) {
  //   let fullPath = path.join(route, file.name)
  //   if (file.isFile()) {
  //     res.push(fullPath)
  //   } else if (file.isDirectory()) {
  //     res.push(...listFilesSync(fullPath))
  //   }
  // }
  //----------------------------------------------
  for (let file of ary) {
    let pathPresent = path.join(dirPath, file)//拼接路径
    let stat = fs.statSync(pathPresent)//获取文件描述
    if (stat.isFile()) {
      res.push(pathPresent)
    } else {
      res.push(...listFilesSync(pathPresent))//递归获得深层文件
    }
  }
  return res
}
var a = listFilesSync('/MatRunner.github.io/homework')
console.log(a)



async function listFilesAsync(route) {
  var res = []
  var pathDir = path.resolve(route)
  var ary = await fsp.readdir(pathDir, { withFileTypes: true })
  for (let file of ary) {
    let fullPath = path.join(pathDir, file.name)
    if (file.isFile()) {
      res.push(fullPath)
    } else if (file.isDirectory()) {
      let files = await listFilesAsync(fullPath)//优化，可以放入一个promise数组使用同时读取，使用all判断结束时刻，不必并行等待
      res.push(...files)
    }
  }
  return res
}

listFilesAsync('/MatRunner.github.io/homework').then(val => {
  console.log(val)
})

function listFilesCallback(route, callback) {
  var pathDir = path.resolve(route)
  fs.readdir(pathDir, { withFileTypes: true }, (err, files) => {
    var res = []
    let dircount = 0
    for (let file of files) {
      let fullPath = path.join(pathDir, file.name)
      if (file.isFile()) {
        res.push(fullPath)
      } else if (file.isDirectory()) {
        dircount++
        listFilesCallback(fullPath, vals => {
          dircount--
          res.push(...vals)
          if (dircount == 0) {
            callback(res)
          }
        })
      }
    }
    if (dircount == 0) {
      callback(res)
    }
  })
}
listFilesCallback('./', res => {
  console.log(res)
})



function listFilePromise(route) {
  var pathDir = path.resolve(route)
  return fsp.readdir(pathDir, { withFileTypes: true }).then(files => {
    var res = []
    var dirAry = []
    for (let file of files) {
      let fullPath = path.join(pathDir, file.name)
      if (file.isFile()) {
        res.push(fullPath)
      } else if (file.isDirectory()) {
        let p = listFilePromise(fullPath)
        dirAry.push(p)
      }
    }
    if (dirAry.length > 0) {
      return Promise.all(dirAry).then(arys => {
        return res.concat(...arys)
      })
    } else {
      return res
    }
  })
}
listFilePromise('./').then(val => {
  console.log(val)
})