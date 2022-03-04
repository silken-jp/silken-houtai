import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Agent {}

export interface AgentFormProps extends useSKForm.SKFormProps<DataSource> {}

const AgentForm: React.FC<AgentFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        name: props?.dataSource?.name || '',
        account: props?.dataSource?.account || '',
        password: props?.dataSource?.password || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="AgentForm" {...formItemLayout} {...formProps}>
        <Form.Item label="代理商名" name="name" rules={[{ required: true }]}>
          <Input placeholder="代理商名" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="アカウント"
          name="account"
          rules={[{ required: true }]}
        >
          <Input placeholder="アカウント" autoComplete="off" />
        </Form.Item>
        {props?.type === 'add' && (
          <Form.Item
            label="パースワード"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="パースワード" autoComplete="off" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AgentForm;
