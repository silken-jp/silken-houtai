import { useEffect } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {}

export interface WaybillFormProps extends useSKForm.SKFormProps<DataSource> {}

const WaybillForm: React.FC<WaybillFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        jp_delivery_no: props?.dataSource?.jp_delivery_no,
        cn_delivery_no: props?.dataSource?.cn_delivery_no,
        jp_delivery_company: props?.dataSource?.jp_delivery_company,
        cn_delivery_company: props?.dataSource?.cn_delivery_company,
        flight_no: props?.dataSource?.flight_no,
        waybill_input_time: dayjs(props?.dataSource?.waybill_input_time),
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={800}>
      <Form name="WaybillForm" {...formItemLayout} {...formProps}>
        <Form.Item label="日本物流公司" name="jp_delivery_company">
          <Input />
        </Form.Item>
        <Form.Item label="日本物流公司单号" name="jp_delivery_no">
          <Input />
        </Form.Item>
        <Form.Item label="中国物流公司" name="cn_delivery_company">
          <Input />
        </Form.Item>
        <Form.Item label="中国物流公司单号" name="cn_delivery_no">
          <Input />
        </Form.Item>
        <Form.Item label="FLIGHT NO" name="flight_no">
          <Input />
        </Form.Item>
        <Form.Item label="単証入力時間" name="waybill_input_time">
          <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WaybillForm;
