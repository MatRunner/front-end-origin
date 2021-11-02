function promisify(callback) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      callback(...args, (err, data) => {//一般回调在最后一个参数
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

function callbackStyle(promise) {
  return function (...args) {
    var f = args.pop()
    promise(...args).then(val => {
      f(null, val)
    }, err => {
      f(err)
    })
  }
}