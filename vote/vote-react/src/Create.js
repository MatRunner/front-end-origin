import {Link} from 'react-router-dom'
import { Col, Layout, Row,Button } from "antd";
import Picture from './Picture'
const { Content } = Layout;
export default function Create(){
  return (
    <Layout>
      <Content>
        <Row gutter={[16]}>
          <Col span={12}>
            <Row justify="center">
              <Picture multiple={false}/>
            </Row>
            <Button type="primary" block="true">
              <Link to="/create">单选投票</Link>
            </Button>
          </Col>
          <Col span={12}>
            <Row justify="center">
              <Picture multiple={true}/>
            </Row>
            <Button type="primary" block="true">
              <Link to="/create?multiple=1">多选投票</Link>
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}