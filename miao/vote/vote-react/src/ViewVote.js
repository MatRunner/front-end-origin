import axios from "axios"
import { useEffect,useState,useCallback } from "react"
import {useParams} from 'react-router-dom'
export default function ViewVote(){
  let {id}=useParams()
  let [vote,setVote]=useState({})

  useEffect(()=>{
    //这种异步请求后端数据的方式会导致有一段时间的白屏，另一种做法是借助一个逻辑判断显示一个loading界面，但是感觉会闪一下，不如直接从白屏加载到有内容？
    const CancelToken=axios.CancelToken
    const Source=CancelToken.source()
    axios.get('/vote/view/'+id,{
      cancelToken:Source.token,
    }).then(res=>{
      setVote(res.data.result)
    })
    return ()=>{Source.cancel()}
  },[id])
  useEffect(()=>{
    let url=`ws://${window.location.host}/instant/vote/${id}`
    let ws=new WebSocket(url)
    ws.onmessage=function(e){
      setVote(JSON.parse(e.data).result)
    }
    return ()=>ws.close()
  },[id])
  let submit=useCallback(function(e,optionId){
    if(e.target.checked){
      axios.post('/vote/view/'+id,{
        optionId,
        action:'add',
      })
    }else{
      axios.post('/vote/view/'+id,{
        optionId,
        action:'cancel',
      })
    }
  },[id])
  return (
    <div>
      <h2>标题：{vote?.title}</h2>
      <div>补充信息：{vote?.extraInfo}</div>
      {vote?.options?.map((it,idx)=>{
        return(
          <div key={idx}>
            {it.content}<input type="checkbox" defaultChecked={it.isVoted} onChange={(e)=>submit(e,it.optionId)}/><div>{it.votedBys.length}票，{it.ratio}%</div>
            <div>{it.votedBys.map(it=><span> {it} </span>)}</div>  
          </div>
        )
      })}
    </div>
  )
}