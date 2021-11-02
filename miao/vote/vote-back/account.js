
const express = require('express')
const svgCaptcha = require('svg-captcha')
const cookie_parser=require('cookie-parser')
const { nanoid } = require('nanoid')
const multer = require('multer')

const md5=val=>val

const app = express.Router()
const session={}
const db = require('./db')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
const upload = multer({ storage: storage })

app.use(cookie_parser('hahalolo'))


//session检测，虽然目前的session仅做验证码使用
app.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    //如果不存在会话，则生成一个
    let id = nanoid()
    session[id] = {}
    res.cookie('sessionId', id)
    req.session = session[id]
  } else {
    //如果存在
    let id = req.cookies.sessionId
    if (!session[id]) {//但是服务器找不到，则清除
      res.clearCookie('sessionId')
      res.json({
        code:-1,
        message:'invilid account'
      })
    } else {//找到了，把id挂在请求上
      req.session = session[id]
    }
  }
  next()
})

//注册
app.post('/register',(req,res,next)=>{
  let info=req.body
  console.log(info)
  let infoReg=/^[0-9a-z_]+$/i
  if(!infoReg.test(info.username)){
    res.status(400).json({
      code:-1,
      message:'invalid username'
    })
  }else if(info.password.length==0){
    res.status(400).json({
      code:-1,
      message:'password must not be empty'
    })
  }else{
    let addCommand=db.prepare('insert into users (username,password,email,avatar) values (?,?,?,?)')
    let result=addCommand.run(info.username,md5(info.password),info.email,info.avatar)
    console.log(result)
    res.json({
      code:0,
      result:{...info},
    })
  }
})

//登录
app.post('/login',(req,res,next)=>{
  let info=req.body
  if(info.captcha!==req.session.captcha){
    res.json({
      code:-2,
      message:'error captcha!'
    })
    return
  }
  let user=db.prepare('select * from users where username=? and password=?').get(info.username,md5(info.password))
  if(user){
    res.cookie('loginUser',info.username,{
      signed:true,
    })
    res.json({
      code:0,
      result:user.username,
    })
  }else{
    res.status(400).json({
      code:-1,
      message:'account incorrect'
    })
  }
})
app.get('/logout',(req,res,next)=>{
  res.clearCookie('loginUser')
  res.json({
    code:0,
    result:{},
  })
})
app.get('/captcha',(req,res,next)=>{
  let captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  console.log(session)
  res.type('svg');
  res.status(200).send(captcha.data);
})
// app.post('/upload',upload.single('avatar'), (req, res, next) => {
//   console.log(req.file)
//   let mess = req.body//获得注册信息
//   let stmt = db.prepare('INSERT INTO users(username,email,password,avatar) VALUES(?,?,?,?)')
//   try {
//     let result = stmt.run(mess.username, mess.email, mess.password, req.file.filename)
//     res.end('success!')
//   } catch (e) {
//     console.log(e)
//     if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
//       res.end('username or email exist, please register again')
//     }
//   }
// })

module.exports=app