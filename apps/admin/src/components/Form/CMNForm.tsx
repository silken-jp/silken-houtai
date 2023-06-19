import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.CMN {}

export interface CMNFormProps extends useSKForm.SKFormProps<DataSource> {}

const CMNForm: React.FC<CMNFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        modifed_CMN: props?.dataSource?.modifed_CMN || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="CMNForm" {...formItemLayout} {...formProps}>
        <Form.Item label="From" name="origin_CMN" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="To" name="modifed_CMN" rules={[{ required: true }]}>
          <Input disabled={!!props?.dataSource?.modifed_CMN} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CMNForm;
