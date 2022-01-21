import { Link,Route,Redirect } from "react-router-dom";
import Create from './Create'
import MyVotes from './MyVotes'
import LoginPrompt from './LoginPrompt'
import { Layout,Row,Col, Button, Space } from "antd";
import { useEffect, useState } from "react/cjs/react.development";
import axios from "axios";
const { Header, Content } = Layout;
export default function Main(){
  let [info,setInfo]=useState({})
  useEffect(()=>{
    const CancelToken=axios.CancelToken
    const Source=CancelToken.source()
    axios.get('/account/getuser').then(res=>{
      setInfo(res.data.result)
    })
    return ()=>{Source.cancel()}
  },[])
  function logout(){
    axios.get('/account/logout')
    setInfo({})
  }
  return(
    <Layout>
      <Header>
        <Row>
          <Col span={8} style={{color:'rgb(245,245,245)'}}>{info?.loginUser?(<Row><Col span={16}>欢迎，{info?.loginUser}</Col><Col span={8}><Button type="primary" onClick={logout}>登出</Button></Col></Row>):<Space size="large"><LoginPrompt setInfo={setInfo}/><Button type="primary"><Link to="/register">注册</Link></Button></Space>}</Col>
          <Col span={3}>
            <Button type="primary">
              <Link to="/main/create">新建</Link>
            </Button>
          </Col>
          <Col span={3}>
            <Button type="primary">
              <Link to="/main/myvotes">我的</Link>
            </Button>
          </Col>
        </Row>
      </Header>
        <Content>
      <Route path="/main" exact>
        <Redirect to="/main/create"/>
      </Route>
      <Route path='/main/create' component={Create}/>
      <Route path='/main/myvotes' component={MyVotes}/>
        </Content>
    </Layout>
  )
}