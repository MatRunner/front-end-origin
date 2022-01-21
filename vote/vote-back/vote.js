const express=require('express')

const voteWsMap = require('./app').voteWsMap

const app=express.Router()
const db = require('./db')


app.use((req,res,next)=>{
  if(!req.isLogin){
    res.json({
      code:-3,
      message:'user needs to log in'
    })
    return
  }
  next()
})
app.post('/create-vote',(req,res,next)=>{

  let info=req.body//获得投票的主体信息
  let stmt=db.prepare('INSERT INTO votes(title,extraInfo,deadline,anonymous,multiple,createBy) VALUES(?,?,?,?,?,?)')
  let result=stmt.run(info.title,info.extraInfo,info.deadline,Number(info.isAnonymous),Number(info.multiple),req.loginUser)
  let belongTo=result.lastInsertRowid
  let stmt2=db.prepare('INSERT INTO options(belongTo,content) values (?,?)')
  info.options.forEach(it=>{
    stmt2.run(Number(belongTo),it)
  })
})
app.get('/view/:id',(req,res,next)=>{
  let id=req.params.id
  //数据库查询投票主题
  let stmt=db.prepare('SELECT * FROM votes WHERE id=?')
  let vote=stmt.get(id)
  if(!vote){
    res.json({
      code:-1,
      message:'vote unexist'
    })
  }else{
    //数据库查询投票选项
    let stmt2=db.prepare('SELECT * FROM options WHERE belongTo=?')
    let options=stmt2.all(id)
    //总票数查询
    let totalVote=db.prepare('SELECT * FROM voteOptions WHERE voteId=?').all(id).length
    //将后端获取的数据处理一下再发往前端，组合的信息为 [{option:xxx,votedBy:[a,b,c]}]
    let stmt3=db.prepare('SELECT * FROM voteOptions WHERE voteId=? and optionId=?')
    let votedOptions=options.map(option=>{
      let isLoginUserVoted=db.prepare('SELECT * FROM voteOptions WHERE voteId=? and votedBy=? and optionId=?').get(id,req.loginUser,option.id)
      let votedBys=stmt3.all(id,option.id).map(it=>it.votedBy)
      return {
        optionId:option.id,
        content:option.content,
        votedBys:votedBys,
        ratio:((votedBys.length/totalVote*100)||0).toFixed(2),
        isVoted:Boolean(isLoginUserVoted),
      }
    })
    res.json({
      code:0,
      result:{
        title:vote.title,
        extraInfo:vote.extraInfo,
        options:votedOptions,
        deadline:vote.deadline,
        isAnonymous:vote.anonymous,
        multiple:vote.multiple,
        createBy:vote.createBy,
      }
    })
  }
})

app.post('/view/:id',(req,res,next)=>{
  let id=req.params.id
  let info=req.body
  //前端发来的信息需要包括，哪个用户，在哪个投票，新选了什么，取消了什么
  let vote=db.prepare('SELECT * FROM votes WHERE id=?').get(id)
  if(vote.multiple){
    if(info.action=='add'){
      db.prepare('INSERT INTO voteOptions (voteId,optionId,votedBy) VALUES (?,?,?)').run(id,info.optionId,req.loginUser)
    }else if(info.action=='cancel'){
      db.prepare('DELETE FROM voteOptions WHERE voteId=? and optionId=? and votedBy=?').run(id,info.optionId,req.loginUser)
    }
  }else{
    if(info.action=='add'){
      let isVoted=db.prepare('SELECT * FROM voteOptions WHERE voteId=? and votedBy=?').get(id,req.loginUser)
      if(isVoted){
        db.prepare('UPDATE voteOptions SET optionId=? WHERE voteId=? and votedBy=?').run(info.optionId,id,req.loginUser)
      }else{
        db.prepare('INSERT INTO voteOptions (voteId,optionId,votedBy) VALUES (?,?,?)').run(id,info.optionId,req.loginUser)
      }
    }else if(info.action=='cancel'){
      db.prepare('DELETE FROM voteOptions WHERE voteId=? and optionId=? and votedBy=?').run(id,info.optionId,req.loginUser)
    }
  }
  res.json({
    code:0,
    result:'update finish'
  })
  if(voteWsMap[id]){
    //数据库查询投票选项
    let stmt2=db.prepare('SELECT * FROM options WHERE belongTo=?')
    let options=stmt2.all(id)
    //总票数查询
    let totalVote=db.prepare('SELECT * FROM voteOptions WHERE voteId=?').all(id).length
    //将后端获取的数据处理一下再发往前端，组合的信息为 [{option:xxx,votedBy:[a,b,c]}]
    let stmt3=db.prepare('SELECT * FROM voteOptions WHERE voteId=? and optionId=?')
    let votedOptions=options.map(option=>{
      let isLoginUserVoted=db.prepare('SELECT * FROM voteOptions WHERE voteId=? and votedBy=? and optionId=?').get(id,req.loginUser,option.id)
      let votedBys=stmt3.all(id,option.id).map(it=>it.votedBy)
      return {
        optionId:option.id,
        content:option.content,
        votedBys:votedBys,
        ratio:((votedBys.length/totalVote*100)||0).toFixed(2),
        isVoted:Boolean(isLoginUserVoted),
      }
    })
    let res={
      code:0,
      result:{
        title:vote.title,
        extraInfo:vote.extraInfo,
        options:votedOptions,
        deadline:vote.deadline,
        isAnonymous:vote.anonymous,
        multiple:vote.multiple,
        createBy:vote.createBy,
      }
    }
    voteWsMap[id].forEach(ws=>{
      console.log('发送')
      ws.send(JSON.stringify(res))
    })
  }
})

app.get('/myvotes',(req,res,next)=>{
  let votes=db.prepare('SELECT * FROM votes WHERE createBy=?').all(req.loginUser)
  res.json({
    code:0,
    result:votes,
  })
  return
})
app.delete('/delete/:id',(req,res,next)=>{
  let id=req.params.id
  try{
    db.prepare('DELETE FROM votes WHERE id=?').run(id)
    db.prepare('DELETE FROM options WHERE belongTo=?').run(id)
    db.prepare('DELETE FROM voteOptions WHERE voteId=?').run(id)
    res.json({
      code:0,
      result:'delete vote which id is'+id,
    })
    return
  }catch(e){
    console.log('删除投票出错：',e)
    res.json({
      code:-1,
      message:'delete error',
    })
  }
})

module.exports=app