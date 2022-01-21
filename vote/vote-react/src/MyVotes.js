import {Row,Col,Layout,Collapse,Button} from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { FormOutlined,UnorderedListOutlined,ShareAltOutlined,DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import produce from 'immer'
const {Content}=Layout
const {Panel}=Collapse
export default function MyVotes(){
  let history=useHistory()
  let [myvotes,setMyvotes]=useState([])
  function deletevote(id,idx){
    axios.delete('/vote/delete/'+id).then(res=>{
      if(res.data.code==0){
        setMyvotes(produce(draft=>{
          draft.splice(idx,1)
        }))
      }
    })
  }

  function PanelHide(props){
    return(
      <Row justify="space-between">
        <Button icon={<FormOutlined />}>编辑</Button>
        <Button icon={<UnorderedListOutlined />}><Link to={'/vote/'+props.voteid}>查看</Link></Button>
        <Button icon={<ShareAltOutlined />}>分享</Button>
        <Button icon={<DeleteOutlined />} onClick={()=>deletevote(props.voteid,props.idx)}>删除</Button>
      </Row>
    )
  }
  useEffect(()=>{
    const CancelToken=axios.CancelToken
    const Source=CancelToken.source()
    axios.get('/vote/myvotes').then(res=>{
      if(res.data.code==-3){
        alert('请先登录')
        history.push('/')
      }else if(res.data.code==0){
        setMyvotes(res.data.result)
      }
    })
    return ()=>{Source.cancel()}
  },[])
  return(
    <Layout>
      <Content>
        <Row><Col span={8} offset={8}>
          {
          myvotes.length>0
          ?<Collapse accordion>
            {myvotes?.map((it,idx)=><Panel key={idx} header={it.title}><PanelHide voteid={it.id} idx={idx}/></Panel>)}
          </Collapse>
          :'暂无已创建的投票'
          }
        </Col></Row>
      </Content>
    </Layout>
  )
}