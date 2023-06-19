import { useEffect } from 'react';
import { Modal, Form, DatePicker, Select } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { dayLocal } from '@/utils/helper/day';
import { useAgentOptions } from '@/services/useAPIOption';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Billing {}

export interface BillingFormProps extends useSKForm.SKFormProps<DataSource> {}

const BillingForm: React.FC<BillingFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);
  const { agentOptions } = useAgentOptions();

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        agent: props?.dataSource?.agent || '',
        start_date: dayLocal(props?.dataSource?.start_date || ''),
        end_date: dayLocal(props?.dataSource?.end_date || ''),
      });
    }
  }, [props.visible]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="BillingForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="フォワーダー名"
          name="agent"
          rules={[{ required: true }]}
        >
          <Select options={agentOptions} />
        </Form.Item>
        <Form.Item
          label="請求開始日"
          name="start_date"
          rules={[{ required: true }]}
        >
          <DatePicker placeholder="請求開始日" />
        </Form.Item>
        <Form.Item
          label="請求終了日"
          name="end_date"
          rules={[{ required: true }]}
        >
          <DatePicker placeholder="請求開始日" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BillingForm;
