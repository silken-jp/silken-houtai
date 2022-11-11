import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {}

export interface HAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBForm: React.FC<HAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        HAB: props?.dataSource?.HAB || '',
        CMN: props?.dataSource?.CMN || '',
        _NT1: props?.dataSource?._NT1 || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="HAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item label="HAWB番号" name="HAB" rules={[{ required: true }]}>
          <Input placeholder="HAWB番号" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="品名"
          name="CMN"
          rules={[{ required: true }, { max: 40 }]}
        >
          <Input placeholder="品名" autoComplete="off" />
        </Form.Item>
        <Form.Item label="値段" name="_NT1" rules={[{ required: true }]}>
          <InputNumber placeholder="値段" autoComplete="off" step={0.01} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HAWBForm;
