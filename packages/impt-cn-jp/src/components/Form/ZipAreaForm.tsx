import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource {
  name: string;
}

export interface ZipAreaFormProps extends useSKForm.SKFormProps<DataSource> {}

const ZipAreaForm: React.FC<ZipAreaFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        name: props?.dataSource?.name,
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} centered>
      <Form name="ZipAreaForm" {...formItemLayout} {...formProps}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: 'Please input name!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ZipAreaForm;
