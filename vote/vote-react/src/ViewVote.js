import axios from "axios"
import { useEffect,useState,useCallback } from "react"
import {useParams,useHistory} from 'react-router-dom'
import {Row,Col,Typography, Layout, Progress} from 'antd'
import produce from "immer"
import './ViewVote.css'
const {Title,Text} =Typography
const {Content}=Layout
export default function ViewVote(){
  let {id}=useParams()
  let [vote,setVote]=useState({})
  let history=useHistory()

  useEffect(()=>{
    //这种异步请求后端数据的方式会导致有一段时间的白屏，另一种做法是借助一个逻辑判断显示一个loading界面，但是感觉会闪一下，不如直接从白屏加载到有内容？
    const CancelToken=axios.CancelToken
    const Source=CancelToken.source()
    axios.get('/vote/view/'+id,{
      cancelToken:Source.token,
    }).then(res=>{
      if(res.data.code==-3){
        alert('请先登录！')
        history.push('/')
      }
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
  let submit=useCallback(function(e,idx,optionId){
    if(vote.multiple){
      setVote(produce(draft=>{
        draft.options[idx]=e.target.checked
      }))
    }else{
      setVote(produce(draft=>{
        for(let i=0;i<draft.options.length;i++){
          if(i==idx){
            draft.options[idx].isVoted=e.target.checked
          }else{
            draft.options[i].isVoted=false
          }
        }
      }))
    }
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
    <div className="viewvote-layout"><Layout className="viewvote-layout"><Content><Row><Col span={8} offset={8}>
      <Title level={2}>{vote?.title}</Title>
      <Text>{vote?.extraInfo}{vote?.multiple?<Text type="success">[多选]</Text>:<Text type="success">[单选]</Text>}</Text>
      </Col></Row>
      {vote?.options?.map((it,idx)=>{
        return(
          <Row key={idx}><Col span={8} offset={8} className="viewvote-option">
            <label><Row justify="space-between" className="viewvote-label"><Text strong>{it.content}</Text><input style={{display:'none'}} type="checkbox" checked={it.isVoted} onChange={(e)=>submit(e,idx,it.optionId)}/><Text>{it?.votedBys?.length}票，{it.ratio}%</Text></Row></label>
            <Row><Progress percent={it.ratio} showInfo={false} strokeWidth={2} trailColor={'transparent'} strokeColor="#1890ff"/></Row>
            <Row>{it?.votedBys?.map(it=><span className='viewvote-votedby'> {vote.isAnonymous?'匿':it} </span>)}</Row>  
          </Col></Row>
        )
      })}
    </Content></Layout></div>
  )
}