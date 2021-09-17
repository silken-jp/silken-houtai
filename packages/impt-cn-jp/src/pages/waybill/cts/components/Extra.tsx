import React, { useState } from 'react';
import { Space, Modal, Button, Input, Form } from 'antd';

export interface CreateProps {
  check?: any;
  create?: {
    disable: boolean;
  };
}

const Extra: React.FC<CreateProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      {/* <ExportCheckedFileForm type="" {...formProps} onSubmit={handleSubmit}/> */}
      <Modal title="クリエート" visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <Form>
          <Form.Item label="4.ICB">
            <Input placeholder="申告等種別コード" />
          </Form.Item>
          <Form.Item label="5.IC1">
            <Input placeholder="申告先種別コード" />
          </Form.Item>
          <Form.Item label="6.IC2">
            <Input placeholder="申告貨物識別" />
          </Form.Item>

          <Form.Item label="8.ICB">
            <Input placeholder="申告等種別コード" />
          </Form.Item>
          <Form.Item label="9.IC1">
            <Input placeholder="申告先種別コード" />
          </Form.Item>
          <Form.Item label="Warehouse">
            <Input placeholder="" />
          </Form.Item>
        </Form>
      </Modal>
      <Space>
        <Button href="/#/check/1234567" type="primary">
          クレンジング
        </Button>
        <Button type="primary" disabled={props?.create?.disable} onClick={() => setVisible(true)}>
          クリエート
        </Button>
      </Space>
    </>
  );
};

export default Extra;
