var net = require('net')
var server = net.createServer()
server.on('connection', conn => {
  conn.on('data', data => {
    console.log(data.toString())
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
      <title>ios-checkbox</title>
      <style>
        *{
          box-sizing: border-box;
        }
        input{
          display: none;
        }
        label{
          box-sizing: content-box;
          margin-top: 50px;
          display: block;
          height: 156px;
          width: 272px;
          border:3px solid rgb(205,205,205);
          border-radius: 156px;
          position: relative;
          xoverflow: hidden;
          background-color:rgb(203,245,210);
          transition: border 0.5s, background-color 2s;
        }
        span{
          box-sizing: content-box;
          background-color: #fff;
          display: inline-block;
          height: 115px;
          width: 115px;
          padding: 10px 10px;
          border-radius: 135px;
          box-shadow: 2px 5px 20px grey;
          position: absolute;
          top:0;
          bottom:0;
          left:10.5px;
          margin:auto;
          z-index: 3;
         transition: width 0.3s 0.2s,left 0.5s cubic-bezier(.29,.76,.57,.97),padding 0.3s 0.1s cubic-bezier(.29,.76,.57,.97);
        }
        input:checked + label > span{
          width:135px;
          padding: 10px 0;
          left:126.5px;
          background-color: #fff;      
          transition: width 0.05s, left 0.5s 0.05s cubic-bezier(.29,.76,.57,.97), padding 0.5s 0.18s ;
        }input:checked + label{
          border-width: 5px;
          border-color: rgb(48,243,75);
          background-color: rgb(48,243,75);
          transition: 0.5s ;
        }
        em{
          display: block;
          position: absolute;
          left:0px;
          top:0px;
          border-radius: 156px;
          height: 156px;
          width: 272px;
          background-color: #fff;
          z-index: 2;
          transition: 0.3s;
        }
        input:checked + label>em{
          transform:scale(0,0);
          transition: 0.35s;
        }
      </style>
    
    </head>
    <body>
      <input type="checkbox" name="ios-check" id="ios-checkbox">
      <label for="ios-checkbox"><span></span><em></em></label>
      <!-- 此处的em可以使用伪元素：：before代替 -->
      <h1><marquee scrollamount="20">太难了，做不动了QAQ</marquee></h1>
    </body>
    </html>
    `)
    conn.end()
  })
})
var port = 8099
server.listen(8099, () => {
  console.log('listen on port:', port)
})


function f(str){
  var [name,massage,age]=str.split('&').map(x=>x.split('=')[1])
}