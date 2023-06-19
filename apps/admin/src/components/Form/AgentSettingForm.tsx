import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource {}

export interface AgentSettingFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const AgentSettingForm: React.FC<AgentSettingFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue(props?.dataSource);
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="AgentSettingForm" {...formItemLayout} {...formProps}>
        {props.type?.startsWith('Clearance') && (
          <>
            <Form.Item label="件数（MIN）" name="count_start">
              <InputNumber step={1} min={0} placeholder="件数（MIN）" />
            </Form.Item>
            <Form.Item label="件数（MAX）" name="count_end">
              <InputNumber step={1} min={0} placeholder="件数（MAX）" />
            </Form.Item>
            <Form.Item label="単価（HAWB）" name="hawb_price">
              <InputNumber step={1} min={0} placeholder="単価（HAWB）" />
            </Form.Item>
          </>
        )}

        {props.type?.startsWith('Clearance') && (
          <>
            <Form.Item label="件数（MIN）" name="count_start">
              <InputNumber step={1} min={0} placeholder="件数（MIN）" />
            </Form.Item>
            <Form.Item label="件数（MAX）" name="count_end">
              <InputNumber step={1} min={0} placeholder="件数（MAX）" />
            </Form.Item>
            <Form.Item label="単価（HAWB）" name="hawb_price">
              <InputNumber step={1} min={0} placeholder="単価（HAWB）" />
            </Form.Item>
          </>
        )}

        {props.type?.startsWith('SecondBonded') && (
          <>
            <Form.Item label="件数（MIN）" name="count_start">
              <InputNumber step={1} min={0} placeholder="件数（MIN）" />
            </Form.Item>
            <Form.Item label="件数（MAX）" name="count_end">
              <InputNumber step={1} min={0} placeholder="件数（MAX）" />
            </Form.Item>
            <Form.Item label="制限（KG）" name="limit_GW">
              <InputNumber step={1} min={0} placeholder="制限（KG）" />
            </Form.Item>
            <Form.Item label="制限内単価（HAWB）" name="limit_price">
              <InputNumber step={1} min={0} placeholder="制限内単価（HAWB）" />
            </Form.Item>
            <Form.Item label="制限外単価（kg）" name="out_limit_kgs_price">
              <InputNumber step={1} min={0} placeholder="制限外単価（kg）" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AgentSettingForm;
