const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports=function(app){
  app.use(
    createProxyMiddleware('/vote',{target:'http://localhost:6688'}),
    createProxyMiddleware('/account',{target:'http://localhost:6688'}),
    createProxyMiddleware('/instant',{target:'ws://localhost:6688',ws:true})
  )
}