import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space } from 'antd';
////
import { useSKFormBasic } from './useSKForm';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

function timeToTime(value: number) {
  return `+${Math.floor(value / 60)}h${value % 60}min`;
}

interface DataSource extends API.Flight {}

export interface FlightFormProps {
  title: string;
  visible: boolean;
  dataSource?: DataSource;
  onSubmit?: (data: DataSource) => void;
  onVisibleChange?: (visible: boolean) => void;
}

const FlightForm: React.FC<FlightFormProps> = (props) => {
  const { modalProps, formProps } = useSKFormBasic(props);

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
        <Form.Item label="航班号" name="flight_no" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="日本航班起飞" required>
          <Space>
            <Form.Item
              label="日本航班起飞"
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
            <Form.Item
              shouldUpdate={(a, b) => a.jp_depart_time !== b.jp_depart_time}
              noStyle
            >
              {({ getFieldValue }) =>
                timeToTime(getFieldValue('jp_depart_time'))
              }
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="航班到达" required>
          <Space>
            <Form.Item
              label="航班到达"
              name="arrive_time"
              rules={[{ required: true }]}
              noStyle
            >
              <InputNumber
                min={0}
                formatter={(v) => (v ? `${v} min` : '')}
                parser={(v): any => v?.replace(/[^0-9]/gi, '')}
              />
            </Form.Item>
            <Form.Item
              shouldUpdate={(a, b) => a.arrive_time !== b.arrive_time}
              noStyle
            >
              {({ getFieldValue }) => timeToTime(getFieldValue('arrive_time'))}
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="通关中" required>
          <Space>
            <Form.Item
              label="通关中"
              name="clearance_time"
              rules={[{ required: true }]}
              noStyle
            >
              <InputNumber
                min={0}
                formatter={(v) => (v ? `${v} min` : '')}
                parser={(v): any => v?.replace(/[^0-9]/gi, '')}
              />
            </Form.Item>
            <Form.Item
              shouldUpdate={(a, b) => a.clearance_time !== b.clearance_time}
              noStyle
            >
              {({ getFieldValue }) =>
                timeToTime(getFieldValue('clearance_time'))
              }
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FlightForm;
