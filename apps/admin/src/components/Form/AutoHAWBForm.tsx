import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { AGENT_HAWB } from '@/utils/constant';
import { useAgentOptions } from '@/services/useAPIOption';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.AgentHAWB {}

export interface AgentHAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const AgentHAWBForm: React.FC<AgentHAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);
  const { agentOptions } = useAgentOptions();

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        agent: props?.dataSource?.agent || '',
        tracking_type: props?.dataSource?.tracking_type || '',
        cargo_type: props?.dataSource?.cargo_type || '',
        count: props?.dataSource?.count || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="AgentHAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="フォワーダー"
          name="agent"
          rules={[{ required: true }]}
        >
          <Select placeholder="フォワーダー" options={agentOptions} />
        </Form.Item>
        <Form.Item
          label="配送種類"
          name="cargo_type"
          rules={[{ required: true }]}
        >
          <Select placeholder="配送種類" options={AGENT_HAWB.CARGO_TYPE} />
        </Form.Item>
        <Form.Item
          label="配送会社"
          name="tracking_type"
          rules={[{ required: true }]}
        >
          <Select placeholder="配送会社" options={AGENT_HAWB.TRACKING_TYPE} />
        </Form.Item>
        <Form.Item label="件数" name="count" rules={[{ required: true }]}>
          <InputNumber placeholder="件数" autoComplete="off" min={1} step={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentHAWBForm;
