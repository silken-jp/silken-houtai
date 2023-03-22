import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';

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

export interface HAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBForm: React.FC<HAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        MAB: props?.dataSource?.mab || '',
        PSC: props?.dataSource?.PSC || '',
        flight_no: props?.dataSource?.flightNo || '',
        VSN: props?.dataSource?.VSN || '',
        ARR: props?.dataSource?.ARR || '',
        DST: props?.dataSource?.DST || '',
        DATE: dayFormat(props?.dataSource?.flightDate, 'YYYY.MM.DD'),
      });
    }
  }, [props.visible]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="HAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item label="MAWB番号" name="MAB" rules={[{ required: true }]}>
          <Input placeholder="MAWB番号" autoComplete="off" />
        </Form.Item>
        <Form.Item label="仕出地" name="PSC" rules={[{ required: true }]}>
          <Input placeholder="仕出地" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="FlightNo"
          name="flight_no"
          rules={[{ required: true }]}
        >
          <Input placeholder="FlightNo" autoComplete="off" />
        </Form.Item>
        <Form.Item label="FlightDate" name="DATE" rules={[{ required: true }]}>
          <Input placeholder="2023.02.01" autoComplete="off" />
        </Form.Item>
        <Form.Item label="VSN" name="VSN" rules={[{ required: true }]}>
          <Input placeholder="VSN" autoComplete="off" />
        </Form.Item>
        <Form.Item label="ARR" name="ARR" rules={[{ required: true }]}>
          <Input placeholder="ARR" autoComplete="off" />
        </Form.Item>
        <Form.Item label="DST" name="DST" rules={[{ required: true }]}>
          <Input placeholder="DST" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HAWBForm;
