import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Driver {}

export interface DriverFormProps extends useSKForm.SKFormProps<DataSource> {}

const DriverForm: React.FC<DriverFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        name: props?.dataSource?.name || '',
        tel: props?.dataSource?.tel || '',
        password: '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="DriverForm" {...formItemLayout} {...formProps}>
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="电话" name="tel" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: props?.type === 'add' }]}>
          <Input.Password placeholder="input password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DriverForm;
