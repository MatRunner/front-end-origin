
const express = require('express')
const multer = require('multer')
const cookie_parser=require('cookie-parser')
const db = require('./db')
const { WebSocketServer } = require('ws')
const http=require('http')
const server=http.createServer()
const wss=new WebSocketServer({server})

const voteWsMap={}
module.exports.voteWsMap = voteWsMap

const app = express()
const accountRouter=require('./account')
const voteRouter=require('./vote')
const port = 6688
//导出的位置十分重要

wss.on('connection',(ws,req)=>{
  //ws仅对用户作分组处理
  console.log('ws in')
  
  if(req.url.match(/^\/instant\/vote\/\d+$/)){
    let voteId=req.url.match(/\d+$/)
    let exist=db.prepare('SELECT * FROM votes WHERE id=?').get(voteId)
    if(exist){
      if(voteId in voteWsMap){
        voteWsMap[voteId].push(ws)
      }else{
        voteWsMap[voteId]=[ws]
      }
      ws.on('close',()=>{
        let idx=voteWsMap[voteId].indexOf(ws)
        voteWsMap[voteId].splice(idx,1)
      })
    }else{
      console.log('ws out')
      // ws.close()
      return
    }
  }
  
})


app.use(express.json())
app.use(cookie_parser('hahalolo'))



//预检测：登录用户状态检测
app.use((req, res, next) => {
  let userDB = db.prepare('SELECT * FROM users WHERE username=?')
  let state = req.signedCookies.loginUser
  let user = userDB.get(state)
  if (state) {//若数据库内存在该用户
    req.loginUser = user.username
    req.isLogin = true
    console.log("当前用户为：",req.loginUser)
  } else {
    req.isLogin = false
    res.clearCookie('loginUser')
    console.log("当前未有用户登录")
  }
  console.log('请求方法为：', req.method)
  console.log('请求地址为', req.url)
  next()
})
//账户路由
app.use('/account',accountRouter)
//投票路由
app.use('/vote',voteRouter)
 

app.use((req,res,next)=>{
  res.end('ok')
})

server.on('request',app)
server.listen(port,()=>{
  console.log('listen on port:',port)
})

