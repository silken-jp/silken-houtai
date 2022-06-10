import { useEffect } from 'react';
import { Modal, Form, InputNumber, Space } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.GW_IP4 {}

export interface AgentFormProps extends useSKForm.SKFormProps<DataSource> {}

const AgentForm: React.FC<AgentFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        GW_min: props?.dataSource?.GW_min || '',
        GW_max: props?.dataSource?.GW_max || '',
        interval: props?.dataSource?.interval || '',
        IP4_min: props?.dataSource?.IP4_min || '',
        IP4_max: props?.dataSource?.IP4_max || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="AgentForm" {...formItemLayout} {...formProps}>
        <Form.Item label="重量" required>
          <Space>
            <Form.Item noStyle name="GW_min" rules={[{ required: true }]}>
              <InputNumber placeholder="min" min={0.1} step={0.1} />
            </Form.Item>
            <span>~</span>
            <Form.Item noStyle name="GW_max" rules={[{ required: true }]}>
              <InputNumber placeholder="max" min={0.1} step={0.1} />
            </Form.Item>
            <span>KG</span>
          </Space>
        </Form.Item>

        <Form.Item label="刻み" name="interval" rules={[{ required: true }]}>
          <InputNumber placeholder="刻み" autoComplete="off" />
        </Form.Item>

        <Form.Item label="インボイス価格" required>
          <Space>
            <Form.Item noStyle name="IP4_min" rules={[{ required: true }]}>
              <InputNumber placeholder="min" min={0.1} step={0.1} />
            </Form.Item>
            <span>~</span>
            <Form.Item noStyle name="IP4_max" rules={[{ required: true }]}>
              <InputNumber placeholder="max" min={0.1} step={0.1} />
            </Form.Item>
            <span></span>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentForm;
