const express = require('express')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = express()

app.use('/abc', express.static('./static1'))
app.use('/abc', express.static('./static2'))
app.get('/aaa', (req, res, next) => {
  let x = res.sendFile(__dirname + '/package.json')
  console.log(x)
})



app.listen(6767, () => {
  console.log('listen on port 6767')
})

function f() {
  let xhr = new XMLHttpRequest()
  xhr.open('DELETE', '/delete-comment')
  xhr.send()
}