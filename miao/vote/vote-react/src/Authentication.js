import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
export default function Authentication (props) {
  const history=useHistory()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = async () => {
    let res=await axios.post('vote/create-vote',props.info)
    if(res.data.code==-3){
      setIsModalVisible(true);
    }else if(res.data.code<0){

    }else if(res.data.code=0){
      history.push('/')
    }
  };
  
  const handleOk = () => {
    setIsModalVisible(false);
    history.push('/')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} block="true">
        {props.name}
      </Button>
      <Modal title="提示：" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
        <p>请先登录...</p>
      </Modal>
    </>
  );
};
