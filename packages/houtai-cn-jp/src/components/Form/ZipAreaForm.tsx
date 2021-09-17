import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';

interface DataSource {
  name: string;
}

export interface ZipAreaFormProps {
  title: string;
  visible: boolean;
  dataSource?: DataSource;
  onSubmit?: (data: DataSource) => void;
  onVisibleChange?: (visible: boolean) => void;
}

const ZipAreaForm: React.FC<ZipAreaFormProps> = (props) => {
  const { title = '', dataSource = {}, visible = false, onSubmit = () => {}, onVisibleChange = () => {} } = props;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    form
      .validateFields()
      .then(async (v) => {
        try {
          setLoading(true);
          await onSubmit(v);
          onVisibleChange(false);
          setLoading(false);
        } catch (error: any) {
          message.error(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCancel = () => {
    onVisibleChange(false);
  };

  return (
    <Modal visible={visible} title={title} confirmLoading={loading} onCancel={onCancel} onOk={onOk} centered>
      <Form name="ZipAreaForm" form={form} initialValues={dataSource}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ZipAreaForm;
