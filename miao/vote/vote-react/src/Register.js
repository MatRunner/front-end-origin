import React from 'react';
import { useInput } from './hooks';
import axios from 'axios';

export default function Register(){
  let username=useInput()
  let email=useInput()
  let password=useInput()
  let register=async function(){
    let info={
      username:username.value,
      email:email.value,
      password:password.value,
    }
    let res,error
    await axios.post('/account/register',info).then(response=>{
      res=response
    }).catch(e=>{
      error=e
    })
  }
  return(
    <div>
      <input type='text' {...username}/>用户名
      <br/>
      <input type='email' {...email}/>邮箱
      <br/>
      <input type='password' {...password}/>密码
      <br/>
      <button onClick={register}>注册</button>
    </div>
  )
}