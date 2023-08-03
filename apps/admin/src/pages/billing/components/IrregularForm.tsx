import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {
  flightNo: string;
  flightDate: string;
  VRR: string;
  mab: string;
}

export interface IrregularFormProps extends useSKForm.SKFormProps<DataSource> {}

const IrregularForm: React.FC<IrregularFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({ ...props?.dataSource });
    }
  }, [props.visible]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="IrregularForm" {...formItemLayout} {...formProps}>
        <Form.Item label="MAWB番号" name="MAB">
          <Input placeholder="MAWB番号" disabled />
        </Form.Item>
        <Form.Item label="HAWB番号" name="HAB">
          <Input placeholder="MAWB番号" disabled />
        </Form.Item>

        <Form.Item label="返送番号" name={['irregular', 'return_no']}>
          <Input />
        </Form.Item>
        <Form.Item label="転送番号" name={['irregular', 'transfer_no']}>
          <Input />
        </Form.Item>
        <Form.Item label="日付" name={['irregular', 'date']}>
          <Input />
        </Form.Item>

        <Form.Item label="返送料金（課税）" name={['irregular', 'return_fee']}>
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="再発送料金（課税）"
          name={['irregular', 'resend_fee']}
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="住所変更手数料（課税）"
          name={['irregular', 'address_change_fee']}
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="再梱包手数料（課税）"
          name={['irregular', 'repack_fee']}
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="その他手数料" name={['irregular', 'other_fee']}>
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="合計（課税）" name={['irregular', 'total_fee']}>
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="その他手数料（非課税）"
          name={['irregular', 'no_tax_other_fee']}
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="合計（非課税）"
          name={['irregular', 'no_tax_total_fee']}
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="備考" name={['irregular', 'note']}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IrregularForm;
