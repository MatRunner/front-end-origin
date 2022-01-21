import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Button,
  Typography,
} from 'antd';
import axios from 'axios';
const {Text}=Typography
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const AntdRegister = () => {
  const [form] = Form.useForm();
  const history=useHistory()
  let  [mess,setMess]=useState('')
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    let {agreement,confirm,...info}=values
    try{
      let res=await axios.post('/account/register',info)
      if(res.data.code==-2){
        setMess('该用户已经存在！')
      }else if(res.data.code==-1){
        setMess(res.data.message)
        throw new Error(res.data.message)
      }else if(res.data.code==0){
        setMess()
        history.push('/')
      }
    }catch(e){
      console.log(e)
    }
  };


  return (
    <Row><Col span={12} offset={4}>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: '请设置密码',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('两次输入的密码不匹配!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: '请输入合法的邮箱地址',
              },
              {
                required: true,
                message: '请输入邮箱！',
              },
            ]}
          >
            <Input />
          </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('请勾选同意')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          我同意 <a href="/">注册条款</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" block="true">
          注册
        </Button>
      </Form.Item>
    </Form>
    <Text type="danger">{mess}</Text>
    </Col></Row>
  );
};

export default AntdRegister