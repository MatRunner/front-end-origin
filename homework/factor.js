var num = +process.argv[2]
var prime = 2
var res = []
while (prime <= num) {
  if (num % prime == 0) {
    res.push(prime)
    num /= prime
  } else {
    prime++
  }
}
var data = res.join(' ')
var figlet = require('figlet')
figlet.text(data, {
  font: 'Train',
}, (err, data) => {
  console.log(data)
})