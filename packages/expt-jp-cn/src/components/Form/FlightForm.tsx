import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space } from 'antd';
////
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

function timeToTime(value: number) {
  return `+${Math.floor(value / 60)}h${value % 60}min`;
}

interface DataSource extends API.Flight {}

export interface FlightFormProps extends useSKForm.SKFormProps<DataSource> {}

const FlightForm: React.FC<FlightFormProps> = (props) => {
  const { modalProps, formProps } = useSKForm.useFormBasic(props);

  useEffect(() => {
    if (props?.visible) {
      formProps?.form?.setFieldsValue({
        flight_no: props?.dataSource?.flight_no || '',
        jp_depart_time: props?.dataSource?.jp_depart_time || 0,
        arrive_time: props?.dataSource?.arrive_time || 0,
        clearance_time: props?.dataSource?.clearance_time || 0,
      });
    }
  }, [props]);

  return (
    <Modal {...modalProps}>
      <Form name="FlightForm" {...formItemLayout} {...formProps}>
        <Form.Item label="FLIGHT NO" name="flight_no" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="日本便出発" required>
          <Space>
            <Form.Item
              label="日本便出発"
              name="jp_depart_time"
              rules={[{ required: true }]}
              noStyle
            >
              <InputNumber
                min={0}
                formatter={(v) => (v ? `${v} min` : '')}
                parser={(v): any => v?.replace(/[^0-9]/gi, '')}
              />
            </Form.Item>
            <Form.Item shouldUpdate={(a, b) => a.jp_depart_time !== b.jp_depart_time} noStyle>
              {({ getFieldValue }) => timeToTime(getFieldValue('jp_depart_time'))}
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="日本到着" required>
          <Space>
            <Form.Item label="日本到着" name="arrive_time" rules={[{ required: true }]} noStyle>
              <InputNumber
                min={0}
                formatter={(v) => (v ? `${v} min` : '')}
                parser={(v): any => v?.replace(/[^0-9]/gi, '')}
              />
            </Form.Item>
            <Form.Item shouldUpdate={(a, b) => a.arrive_time !== b.arrive_time} noStyle>
              {({ getFieldValue }) => timeToTime(getFieldValue('arrive_time'))}
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="通関中" required>
          <Space>
            <Form.Item label="通関中" name="clearance_time" rules={[{ required: true }]} noStyle>
              <InputNumber
                min={0}
                formatter={(v) => (v ? `${v} min` : '')}
                parser={(v): any => v?.replace(/[^0-9]/gi, '')}
              />
            </Form.Item>
            <Form.Item shouldUpdate={(a, b) => a.clearance_time !== b.clearance_time} noStyle>
              {({ getFieldValue }) => timeToTime(getFieldValue('clearance_time'))}
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FlightForm;
