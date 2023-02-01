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
}

export interface HAWBFormProps extends useSKForm.SKFormProps<DataSource> {}

const HAWBForm: React.FC<HAWBFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        _id: props?.dataSource?._id || '',
        PSC: props?.dataSource?.PSC || '',
        flightNo: props?.dataSource?.flightNo || '',
        flightDate: dayFormat(props?.dataSource?.flightDate, 'YYYY.MM.DD'),
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps} width={700}>
      <Form name="HAWBForm" {...formItemLayout} {...formProps}>
        <Form.Item label="MAWB番号" name="_id" rules={[{ required: true }]}>
          <Input placeholder="MAWB番号" autoComplete="off" />
        </Form.Item>
        <Form.Item label="仕出地" name="PSC" rules={[{ required: true }]}>
          <Input placeholder="仕出地" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="FlightNo"
          name="flightNo"
          rules={[{ required: true }]}
        >
          <Input placeholder="FlightNo" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="FlightDate"
          name="flightDate"
          rules={[{ required: true }]}
        >
          <Input placeholder="2023.02.01" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HAWBForm;
