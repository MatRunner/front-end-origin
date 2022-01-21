const betterSqlite3 = require('better-sqlite3')

const db = new betterSqlite3(__dirname + '/database/votedb')

module.exports=db
