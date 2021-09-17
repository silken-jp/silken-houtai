import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
////
import { useSKFormBasic } from './useSKForm';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface DataSource extends API.Waybill {}

export interface WaybillFormProps {
  type: string;
  title: string;
  visible: boolean;
  dataSource?: DataSource;
  onSubmit?: (data: DataSource) => void;
  onVisibleChange?: (visible: boolean) => void;
}

const WaybillForm: React.FC<WaybillFormProps> = (props) => {
  const { modalProps, formProps } = useSKFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        jp_delivery_no: props?.dataSource?.jp_delivery_no,
        cn_delivery_no: props?.dataSource?.cn_delivery_no,
        jp_delivery_company: props?.dataSource?.jp_delivery_company,
        cn_delivery_company: props?.dataSource?.cn_delivery_company,
        flight_no: props?.dataSource?.flight_no,
        waybill_input_time: dayjs(props?.dataSource?.waybill_input_time).local(),
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={800}>
      <Form name="WaybillForm" {...formItemLayout} {...formProps}>
        <Form.Item
          label="日本物流公司"
          name="jp_delivery_company"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="日本物流公司单号"
          name="jp_delivery_no"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="中国物流公司"
          name="cn_delivery_company"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="中国物流公司单号"
          name="cn_delivery_no"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="FLIGHT NO"
          name="flight_no"
          // rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="単証入力時間" name="waybill_input_time" rules={[{ required: true }]}>
          <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WaybillForm;
