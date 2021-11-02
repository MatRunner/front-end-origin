function express() {
  let ary = []
  let app = function (httpreq, httpres) {
    run()
    function run() {
      if (ary.length > 0) {
        let f = ary.shift()//为啥说不能pop？
        process.nextTick(() => {
          f(httpreq, httpres, function next() {
            run()
          })
        })
      }
    }
  }
  app.use = function (midware) {
    ary.push(midware)
  }
  app.listen = function (...args) {
    let server = http.createServer()
    server.listen(...args)
  }
  return app
}