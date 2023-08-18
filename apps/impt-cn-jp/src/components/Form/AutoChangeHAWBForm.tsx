import { Modal, Form, InputNumber, Select, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
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

  const start_hab = Number(props.dataSource?.start_hab);
  const end_hab = Number(props.dataSource?.end_hab);

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
          label="開始HAWB"
          name="start_hab"
          rules={[
            {
              validator: async (_, value) => {
                if (!value) {
                  throw new Error(`【開始HAWB】 は必須です！`);
                } else if (
                  !new RegExp('^[0-9]+$').test(value) ||
                  Number(value) < start_hab ||
                  Number(value) > end_hab
                ) {
                  throw new Error(
                    `[${start_hab} ~ ${end_hab}]の数字のみ入力可能！`,
                  );
                }
              },
            },
          ]}
        >
          <Input placeholder="開始HAWB" autoComplete="off" />
        </Form.Item>
        <Form.Item label="件数" name="count" rules={[{ required: true }]}>
          <InputNumber placeholder="件数" autoComplete="off" min={1} step={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgentHAWBForm;
