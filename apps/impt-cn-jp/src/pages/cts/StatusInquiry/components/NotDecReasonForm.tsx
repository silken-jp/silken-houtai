import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

interface DataSource extends API.Waybill {}

export interface NotDecReasonFormProps
  extends useSKForm.SKFormProps<DataSource> {}

const NotDecReasonForm: React.FC<NotDecReasonFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({ ...props?.dataSource });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={1200}>
      <Form
        size="small"
        name="notDecReasonForm"
        {...formItemLayout}
        {...formProps}
      >
        <Form.Item label="未申告理由" name="not_dec_reason">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NotDecReasonForm;
