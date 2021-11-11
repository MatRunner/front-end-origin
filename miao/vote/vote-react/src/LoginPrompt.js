import React, { useState } from 'react';
import { Button, Modal, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
const {Text} =Typography

const CollectionCreateForm = ({ visible, onCreate, onCancel,setInfo }) => {
  const [form] = Form.useForm();
  let [src,setSrc]=useState('/account/captcha')
  let update=function(){
    setSrc('/account/captcha?date'+Date.now())
  }
  let [alertMess,setAlertMess]=useState()
  async function onOK(){
    form
    .validateFields()
    .then((values) => {
      form.resetFields();
      return axios.post('/account/login',values)
    })
    .then(res=>{
      if(res.data.code==-2){
        setAlertMess(<Text type="danger">验证码错误，请重新输入</Text>)
        update()
      }else if(res.data.code==-1){
        setAlertMess(<Text type="danger">密码错误，请重新输入</Text>)
      }else if(res.data.code==0){
        setAlertMess()
        setInfo({
          isLogin:true,
          loginUser:res.data.result,
        })
        onCreate(res.data);
      }
    })
    .catch((info) => {
      console.log('Validate Failed:', info);
    });
  }
  return (
    <Modal
    visible={visible}
    title="请输入登录信息"
    okText="登录"
    cancelText="注册"
    onCancel={()=>{
      onCancel()
      setAlertMess()
    }}
    onOk={onOK}
    footer={[
      <Button key='cancel' onClick={onCancel}>取消</Button>,
      <Button key='register'><Link to="/register">注册</Link></Button>,
      <Button key='submit' type="primary" onClick={onOK}>登录</Button>,
    ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
          >
          <Input />
        </Form.Item>
        <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required:true,
            message:'请输入密码！'
          }
        ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item name="captcha" label="验证码" className="collection-create-form_last-form-item" rules={[{
          required:true,
          message:'请输入验证码！',
        }]}>
          <Input/>
        </Form.Item>
          <img src={src} alt="验证码加载失败" onClick={update}/>
      </Form>
          {alertMess}    
    </Modal>
  );
};

const LoginPrompt = (props) => {
  const [visible, setVisible] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        登录
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        setInfo={props.setInfo}
      />
    </div>
  );
};

export default LoginPrompt