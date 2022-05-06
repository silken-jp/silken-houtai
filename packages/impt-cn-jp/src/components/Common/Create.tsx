import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
////

export interface CreateProps {
  disabled?: boolean;
  type?: 'MIC' | 'IDA';
  large?: boolean;
  LS: 'L' | 'S' | 'M';
  useSource?: boolean;
  dataSource?: any[];
}

const ST = [
  {
    value: '1AW95',
    label: '1AW95: 【華南（株）足立保税蔵置場】東京都足立区南花畑4-28-18',
  },
  {
    value: '1CW70',
    label:
      '1CW70: 【ケイヒン（株）ワールド流通センター】東京都江東区青海３-2-17',
  },
];

const Create: React.FC<CreateProps> = (props) => {
  const { LS, dataSource, disabled, useSource } = props;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    LS === 'M'
      ? form.setFieldsValue({
          JYO: 'Z',
          CH: '1A',
          CHB: '',
          ICD: dayjs(),
          ST: '',
          TTC: '',
          MAB: '',
          VSN: '',
          ARR: '',
        })
      : form.setFieldsValue({
          CH: '1A',
          CHB: props?.LS === 'L' ? '55' : '77',
          CHH: '',
          CHT: '',
          ICD: dayjs(),
          ST: '',
          TTC: '',
          VSN: '',
          ARR: '',
        });
  }, [visible]);

  return (
    <>
      <Modal
        title="クリエート"
        visible={visible}
        width={800}
        forceRender
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        <Form form={form}>
          {LS === 'M' ? (
            <>
              <Form.Item label="3.JYO" name="JYO">
                <Select
                  placeholder="申告条件"
                  allowClear
                  options={[
                    { value: 'K', label: 'K:開庁時申告' },
                    { value: 'H', label: 'H:予備申告後の本申告' },
                    {
                      value: 'Z',
                      label: 'Z:予備申告（貨物搬入時本申告自動起動）',
                    },
                    {
                      value: 'U',
                      label: 'U:予備申告（本邦到着時貨物引取本申告自動起動）',
                    },
                    {
                      value: 'S',
                      label: 'S:予備申告（航空貨物の集積場所で本申告自動起動）',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="6.CH" name="CH" rules={[{ required: true }]}>
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="7.CHB" name="CHB" rules={[{ required: true }]}>
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="8.ICD" name="ICD" rules={[{ required: true }]}>
                <DatePicker placeholder="申告予定年月日" format="YYYYMMDD" />
              </Form.Item>
              <Form.Item label="21.ST" name="ST" rules={[{ required: true }]}>
                <Select placeholder="通関予定蔵置場コード" options={ST} />
              </Form.Item>
              <Form.Item label="22.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="33.MAB" name="MAB">
                <Input placeholder="MAWB番号" />
              </Form.Item>
              <Form.Item label="36.VSN" name="VSN">
                <Input placeholder="積載機名" />
              </Form.Item>
              <Form.Item label="37.ARR" name="ARR">
                <DatePicker placeholder="入港年月日" format="YYYYMMDD" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="8.CH" name="CH" rules={[{ required: true }]}>
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="9.CHB" name="CHB" rules={[{ required: true }]}>
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="10.CHH" name="CHH">
                <Input placeholder="特例申告あて先官署コード" />
              </Form.Item>
              <Form.Item label="11.CHT" name="CHT">
                <Input placeholder="特例申告あて先部門コード" />
              </Form.Item>
              <Form.Item label="12.ICD" name="ICD" rules={[{ required: true }]}>
                <DatePicker placeholder="申告予定年月日" format="YYYYMMDD" />
              </Form.Item>
              <Form.Item label="24.ST" name="ST" rules={[{ required: true }]}>
                <Select placeholder="通関予定蔵置場コード" options={ST} />
              </Form.Item>
              <Form.Item label="37.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="45.VSN" name="VSN">
                <Input placeholder="積載機名" />
              </Form.Item>
              <Form.Item label="46.ARR" name="ARR">
                <DatePicker placeholder="入港年月日" format="YYYYMMDD" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      {useSource ? (
        <Button
          size="small"
          type="dashed"
          disabled={disabled || !dataSource?.length}
          onClick={() => setVisible(true)}
        >
          シングルクリエート
        </Button>
      ) : (
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => setVisible(true)}
        >
          マスクリエート
        </Button>
      )}
    </>
  );
};

export default Create;
