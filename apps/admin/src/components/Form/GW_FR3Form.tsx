import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.GW_FR3 {}

export interface GW_FR3FormProps extends useSKForm.SKFormProps<DataSource> {}

const GW_FR3Form: React.FC<GW_FR3FormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        _GW: props?.dataSource?._GW || '',
        FR3: props?.dataSource?.FR3 || '',
        FR2: props?.dataSource?.FR2 || '',
        PSC: props?.dataSource?.PSC || '',
        DST: props?.dataSource?.DST || '',
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="GW_FR3Form" {...formItemLayout} {...formProps}>
        <Form.Item label="積出地コード" name="PSC" rules={[{ required: true }]}>
          <Input placeholder="積出地コード" autoComplete="off" />
        </Form.Item>
        <Form.Item label="取卸港コード" name="DST" rules={[{ required: true }]}>
          <Input placeholder="取卸港コード" autoComplete="off" />
        </Form.Item>
        <Form.Item label="重量" name="_GW" rules={[{ required: true }]}>
          <InputNumber min={0} placeholder="重量" autoComplete="off" />
        </Form.Item>
        <Form.Item label="運賃" name="FR3" rules={[{ required: true }]}>
          <Input placeholder="運賃" autoComplete="off" />
        </Form.Item>
        <Form.Item label="通貨" name="FR2" rules={[{ required: true }]}>
          <Input placeholder="通貨" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GW_FR3Form;
