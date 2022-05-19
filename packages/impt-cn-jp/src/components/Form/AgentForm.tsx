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
        SHN: props?.dataSource?.SHN || '',
        SHA: props?.dataSource?.SHA || '',
        STL: props?.dataSource?.STL || '',
        AGT_CD: props?.dataSource?.AGT_CD || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="AgentForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="フォワーダー名"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="フォワーダー名" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="アカウント"
          name="account"
          rules={[{ required: true }]}
        >
          <Input placeholder="アカウント" autoComplete="off" />
        </Form.Item>
        <Form.Item label="代理店コード" name="AGT_CD">
          <Input placeholder="代理店コード" autoComplete="off" />
        </Form.Item>
        <Form.Item label="荷送り人名" name="SHN">
          <Input placeholder="荷送り人名" autoComplete="off" />
        </Form.Item>
        <Form.Item label="荷送り人住所" name="SHA">
          <Input placeholder="荷送り人住所" autoComplete="off" />
        </Form.Item>
        <Form.Item label="荷送り人電話番号" name="STL">
          <Input placeholder="荷送り人電話番号" autoComplete="off" />
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
