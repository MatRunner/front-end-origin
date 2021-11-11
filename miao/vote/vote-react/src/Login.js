import { useInput } from "./hooks"
import axios from "axios"
import { useState } from "react"

export default function Login(){
  let username=useInput()
  let password=useInput()
  let captcha=useInput()
  let [src,setSrc]=useState('/account/captcha')
  let update=function(){
    setSrc('/account/captcha?date'+Date.now())
  }
  let submit=async function(){
    let info={
      username:username.value,
      password:password.value,
      captcha:captcha.value,
    }
    try{
      let res=await axios.post('/account/login',info)
      console.log(res)
      if(res.code==-2){
        alert('验证码错误，请重新输入')
        update()
      }
    }catch(e){
      throw e
    }
  }
  return(
    <div>
      <input type='text' {...username}/>用户名
      <br/>
      <input type='password' {...password}/>密码
      <br/>
      <img src={src} alt="验证码加载失败" onClick={update}/>
      <input type="text" {...captcha}/>验证码
      <button onClick={submit}>登录</button>
    </div>
  )
}