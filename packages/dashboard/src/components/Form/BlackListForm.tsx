import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.MICkeys {}

export interface BlackListFormProps extends useSKForm.SKFormProps<DataSource> {}

const BlackListForm: React.FC<BlackListFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        words: props?.dataSource?.words || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="BlackListForm" {...formItemLayout} {...formProps}>
        <Form.Item label="key-words" name="words" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlackListForm;
