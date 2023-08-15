import { useEffect } from 'react';
import { Modal, Form, InputNumber, Select } from 'antd';
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
        agent: props?.dataSource?.agent || null,
        group_name: props?.dataSource?.group_name || null,
        count: props?.dataSource?.count || null,
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="AgentHAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="配送会社"
          name="group_name"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="配送会社"
            options={AGENT_HAWB.GROUP_NAME}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="フォワーダー"
          name="agent"
          rules={[{ required: true }]}
        >
          <Select placeholder="フォワーダー" options={agentOptions} />
        </Form.Item>
        <Form.Item label="件数" name="count" rules={[{ required: true }]}>
          <InputNumber placeholder="件数" autoComplete="off" min={1} step={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentHAWBForm;
