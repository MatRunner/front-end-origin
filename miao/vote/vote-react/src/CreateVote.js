import { useImmer } from "use-immer"
import {useInput,useBooleanChecked} from './hooks'
import * as moment from 'moment'
import {useLocation} from 'react-router-dom'
import { useMemo } from "react"
import { Layout,Row,Col,Typography,Input, Button,Switch } from "antd"
import {PlusOutlined,MinusOutlined} from '@ant-design/icons'
import './CreateVote.css'
import Authentication from "./Authentication"

const {Content}=Layout
const {Title,Text}=Typography

export default function CreateVote(){
  let [options,setOptions]=useImmer(['',''])
  let title=useInput('')
  let extraInfo=useInput('')
  let deadline=useInput(moment().add(1,'M').format("YYYY-MM-DD"))
  let anonymous=useBooleanChecked(false)
  let search=useLocation().search
  let multiple=useMemo(()=>search,[search])
  //更好的做法是表单验证
  let info={
    title:title.value,
    extraInfo:extraInfo.value,
    options:options,
    deadline:deadline.value,
    isAnonymous:anonymous.checked,
    multiple:multiple=="?multiple=1"?true:false,
  }

  function editOption(e,idx){
    setOptions(options=>{
      options[idx]=e.target.value
    })
  }
  function deleteOption(idx){
    if(options.length>2){
      setOptions(options=>{
        options.splice(idx,1)
      })
    }
  }
  function addOption(){
    setOptions(options=>{
      options.push('')
    })
  }

  return(
    <Layout><Content className="create-vote-layout"><Row><Col span={8} offset={8}>
      <div className='create-vote-layout-in'>
      <Title level={2}>创建{multiple?'多选':'单选'}投票</Title>
      <Input bordered={false} size="large" placeholder="投票标题" {...title}/>
      <Input bordered={false} size="middle" placeholder="补充描述(选填)" {...extraInfo}/>
      {
      options.map((it,idx)=>{
        return <Row key={idx}><Col span={3}><Button type="primary" shape="circle" danger icon={<MinusOutlined style={{fontSize:'18px'}}/>} size="small" onClick={()=>deleteOption(idx)} ></Button></Col><Col span={21}><Input bordered={false} placeholder="选项" value={it} onChange={e=>editOption(e,idx)}/></Col></Row>
      })
      }
      <Row><Col span={3}><Button onClick={addOption} type="primary" shape="circle" icon={<PlusOutlined style={{fontSize:'18px'}}/>} size="small"></Button></Col><Text strong style={{color:'rgb(36,109,240)'}}>添加选项</Text></Row>
      </div>
      <div className="create-vote-layout-in">
      <Row><Col span={4}><Text strong>截止日期</Text></Col><Col span={4} offset={12}><input type="date" {...deadline} className="vote-date"/></Col></Row>
      <Row><Col span={4}><Text strong>匿名投票</Text></Col><Col span={4} offset={16}><Switch {...anonymous}/></Col></Row>
      </div>
      <Row><Authentication name="提交投票" info={info}/></Row>
    </Col></Row></Content></Layout>
  )
}