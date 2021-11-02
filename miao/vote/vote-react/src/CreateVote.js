import { useImmer } from "use-immer"
import {useInput,useBooleanChecked} from './hooks'
import * as moment from 'moment'
import axios from "axios"
import {useLocation,useHistory} from 'react-router-dom'
import { useMemo } from "react"

export default function CreateVote(){
  let [options,setOptions]=useImmer(['',''])
  let title=useInput('')
  let extraInfo=useInput('')
  let deadline=useInput(moment().add(1,'M').format("YYYY-MM-DD"))
  let anonymous=useBooleanChecked(false)
  
  let search=useLocation().search
  let multiple=useMemo(()=>search,[search])


  function editOption(e,idx){
    setOptions(options=>{
      options[idx]=e.target.value
    })
  }
  function deleteOption(idx){
    setOptions(options=>{
      options.splice(idx,1)
    })
  }
  function addOption(){
    setOptions(options=>{
      options.push('')
    })
  }
  async function submit(){
    let info={
      title:title.value,
      extraInfo:extraInfo.value,
      options:options,
      deadline:deadline.value,
      isAnonymous:anonymous.checked,
      multiple:multiple=="?multiple=1"?true:false,
    }
    let res=await axios.post('vote//create-vote',info)
    console.log(res)

  }
  return(
    <div>
      <h1>创建投票</h1>
      <div><input type="text" {...title}/>投票标题</div>
      <div><input type="text" {...extraInfo} />补充描述（选填）</div>
      {
      options.map((it,idx)=>{
        return <div key={idx}><input type="text" placeholder="选项" value={it} onChange={e=>editOption(e,idx)}/><button onClick={()=>deleteOption(idx)}>删除选项</button></div>
      })
      }
      <div><button onClick={addOption}>添加选项</button></div>
      <div><input type="date" {...deadline}/>截止日期</div>
      <div><input type="checkbox" {...anonymous}/>匿名投票</div>
      <div><button onClick={submit}>提交投票</button></div>
    </div>
  )
}