import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Irregular {}

export interface IrregularFormProps extends useSKForm.SKFormProps<DataSource> {}

const IrregularForm: React.FC<IrregularFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        ...props?.dataSource,
        date: dayjs(props?.dataSource?.date),
      });
    }
  }, [props.visible]);

  return (
    <Modal {...modalProps} width={900}>
      <Form name="IrregularForm" {...formItemLayout} {...formProps}>
        <Form.Item label="MAWB番号" name="MAB">
          <Input placeholder="MAWB番号" disabled />
        </Form.Item>
        <Form.Item label="HAWB番号" name="HAB">
          <Input placeholder="MAWB番号" disabled />
        </Form.Item>

        <Form.Item label="日付" name="date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="返送番号" name="return_no">
          <Input />
        </Form.Item>
        <Form.Item label="転送番号" name="resend_no">
          <Input />
        </Form.Item>

        <Form.Item label="返送料金（課税）" name="return_price">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="再発送料金（課税）" name="resend_price">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          label="再発送/住所変更手数料（課税）"
          name="address_change_fee"
        >
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="再梱包手数料（課税）" name="repack_fee">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="換面単費ラベル交換（課税）" name="label_change_fee">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>

        <Form.Item label="課税項目名" name="tax_field_name">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="課税費用" name="tax_price">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="課税備考" name="tax_note">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="非課税項目名" name="no_tax_field_name">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="非課税費用" name="no_tax_price">
          <InputNumber min={0} step={1} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="非課税備考" name="no_tax_note">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IrregularForm;
