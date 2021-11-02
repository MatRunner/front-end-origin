//作为server的逻辑文件
const express = require('express')
const fs = require('fs')
const path = require('path')
const cookie_parser = require('cookie-parser')
const betterSqlite3 = require('better-sqlite3')
const multer = require('multer')
const svgCaptcha = require('svg-captcha')
const { nanoid } = require('nanoid')
const { render } = require('pug')

const db = new betterSqlite3(__dirname + '/database/bbsDB')
const app = express()
const port = 6699
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
const upload = multer({ storage: storage })
const session = {}

app.use(cookie_parser('hahalolo'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.set('views', __dirname + '/tmps')

//session检测
app.use((req, res, next) => {
  console.log(session)
  if (!req.cookies.sessionId) {
    let id = nanoid()
    session[id] = {}
    res.cookie('sessionId', id)
    req.session = session[id]
  } else {
    let id = req.cookies.sessionId
    if (!session[id]) {
      res.clearCookie('sessionId')
      res.redirect(req.url)
    } else {
      req.session = session[id]
    }
  }
  next()
})

//登录用户检测
var isLogin = false
var loginUser = null
app.use((req, res, next) => {
  var userDB = db.prepare('SELECT * FROM users WHERE username=?')
  var state = req.signedCookies.username
  var user = userDB.get(state)
  if (state) {
    loginUser = user
    isLogin = true
  } else {
    isLogin = false
  }
  console.log('请求方法为：', req.method)
  console.log('请求地址为', req.url)
  next()
})
//主页
app.get('/', async (req, res, next) => {
  let themeDB = db.prepare('SELECT * FROM posts')
  let themes = themeDB.all()
  res.render('home-page.pug', {
    themeMess: themes,
    isLogin: isLogin,
    loginUser: loginUser,
  })
})
//路由，注册处理
app.route('/register')
  .get((req, res, next) => {
    res.render('register.pug')
  })
  .post(upload.single('avatar'), (req, res, next) => {
    console.log(req.file)
    let mess = req.body//获得注册信息
    let stmt = db.prepare('INSERT INTO users(username,email,password,avatar) VALUES(?,?,?,?)')
    try {
      let result = stmt.run(mess.username, mess['E-mail'], mess.password, req.file.filename)
      res.end('success!')
    } catch (e) {
      console.log(e)
      if (e.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        res.end('username or email exist, please register again')
      }
    }
  })
//路由，登录处理  
app.route('/login')
  .get((req, res, next) => {
    let fromWitch = req.headers.referer
    if (fromWitch) {
      res.cookie('fromWitch', fromWitch)
    }
    res.render('login.pug')
  })
  .post((req, res, next) => {
    let loginMess = req.body
    if (loginMess.captcha !== req.session.captcha) {
      res.end('captcha mistake!')
      return
    }
    let logInSearch = db.prepare('SELECT * FROM users WHERE email=? AND password=?')
    let target = logInSearch.get(loginMess['E-mail'], loginMess.password)
    if (target) {
      res.cookie('username', target.username, {
        signed: true,
      })
      let fromWitch = req.cookies.fromWitch
      if (fromWitch) {
        res.clearCookie('fromWitch')
        res.redirect(fromWitch)
        res.end()
      } else {
        res.end(target.username + ' login')
      }
    } else {
      res.end('login failed')
    }
  })
//路由，发帖处理  
app.route('/post-theme')
  .get((req, res, next) => {
    res.render('post-theme.pug', {
      isLogin: isLogin,
    })
  })
  .post((req, res, next) => {
    let userName = req.signedCookies.username
    if (userName) {
      let msg = req.body
      let msgDB = db.prepare('INSERT INTO posts(title,content,timestamp,username) VALUES(?,?,?,?)')
      msg.timestamp = new Date().toLocaleString()
      let result = msgDB.run(msg.title, msg.content, msg.timestamp, userName)
      res.redirect(`/post-theme/${result.lastInsertRowid}`)
    } else {
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.write('请<a href="/login">登录</a>')
      res.end()
    }
  })
//帖子详情
app.get('/post-theme/:id', (req, res, next) => {
  let mesDB = db.prepare('select * from posts where postId=?')
  let commentsDB = db.prepare('SELECT * FROM comments where themeId=?')
  let mes = mesDB.get(req.params.id)
  console.log(mes)
  console.log(loginUser)
  let cms = commentsDB.all(req.params.id)
  if (mes) {
    res.render('theme-page.pug', {
      theme: mes,
      isLogin: isLogin,
      comments: cms,
      loginUser: loginUser,
    })
  } else {
    res.end('no such theme')
  }
})
//帖子发评
app.post('/post-theme/:id', (req, res, next) => {
  let mes = req.body
  let username = req.signedCookies.username
  if (username) {
    mes.postBy = username
    mes.timestamp = new Date().toLocaleString()
    mes.themeId = req.params.id
    let commentsDB = db.prepare('INSERT INTO comments (content, postBy, timestamp, themeId, commentsId) VALUES(?,?,?,?,?)')
    commentsDB.run(mes.content, mes.postBy, mes.timestamp, mes.themeId, mes.themeId + '-' + mes.postBy + '-' + Date.now())
    res.redirect('/post-theme/' + req.params.id)
  }
})
//删评处理
app.delete('/delete-comment/:id', (req, res, next) => {
  let deleteCM = db.prepare('DELETE FROM comments WHERE commentsId=?')
  console.log(req.params.id)
  deleteCM.run(req.params.id)
  res.end()
})
//登出处理
app.get('/logout', (req, res, next) => {
  res.clearCookie('username')
  res.redirect('/')
})
app.route('/password-replace')
  .get((req, res, next) => {
    render('password-replace.pug')
  })
  .post((req, res, next) => {

  })
//验证码
app.get('/captcha', function (req, res) {
  let captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});


app.listen(port, () => {
  console.log('listen on port', port)
})
