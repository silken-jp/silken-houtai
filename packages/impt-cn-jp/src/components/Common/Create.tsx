import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
////

export interface CreateProps {
  disabled?: boolean;
  type?: 'MIC' | 'IDA';
  large?: boolean;
}

const Create: React.FC<CreateProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    props?.type === 'MIC' &&
      form.setFieldsValue({
        JYO: 'Z',
        CH: '1A',
        CHB: '',
        ICD: dayjs(),
        ST: '',
        TTC: '',
        MAB: '',
        VSN: '',
        ARR: dayjs(),
      });
    props?.type === 'IDA' &&
      form.setFieldsValue({
        CH: '1A',
        CHB: props?.large ? '55' : '77',
        CHH: '',
        CHT: '',
        ICD: dayjs(),
        ST: '',
        TTC: '',
        BL_: '',
        VSN: '',
        ARR: dayjs(),
      });
  }, [visible]);

  return (
    <>
      <Modal
        title="クリエート"
        visible={visible}
        forceRender
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        <Form form={form}>
          {props?.type === 'MIC' && (
            <>
              <Form.Item label="3.JYO" name="JYO">
                <Select
                  placeholder="申告条件"
                  options={[
                    { value: 'K', label: 'K:開庁時申告' },
                    { value: 'H', label: 'H:予備申告後の本申告' },
                    { value: 'Z', label: 'Z:予備申告（貨物搬入時本申告自動起動）' },
                    { value: 'U', label: 'U:予備申告（本邦到着時貨物引取本申告自動起動）' },
                    { value: 'S', label: 'S:予備申告（航空貨物の集積場所で本申告自動起動）' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="6.CH" name="CH">
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="7.CHB" name="CHB">
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="8.ICD" name="ICD">
                <DatePicker placeholder="申告予定年月日" format="YYYYMMDD" />
              </Form.Item>
              <Form.Item label="21.ST" name="ST">
                <Select placeholder="通関予定蔵置場コード" />
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
          )}
          {props?.type === 'IDA' && (
            <>
              <Form.Item label="8.CH" name="CH">
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="9.CHB" name="CHB">
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="10.CHH" name="CHH">
                <Input placeholder="特例申告あて先官署コード" />
              </Form.Item>
              <Form.Item label="11.CHT" name="CHT">
                <Input placeholder="特例申告あて先部門コード" />
              </Form.Item>
              <Form.Item label="12.ICD" name="ICD">
                <DatePicker placeholder="申告予定年月日" format="YYYYMMDD" />
              </Form.Item>
              <Form.Item label="24.ST" name="ST">
                <Select placeholder="通関予定蔵置場コード" />
              </Form.Item>
              <Form.Item label="37.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="38.BL_" name="BL_">
                <Input placeholder="B／L番号／AWB 番号" />
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
      <Button type="primary" disabled={props?.disabled} onClick={() => setVisible(true)}>
        クリエート
      </Button>
    </>
  );
};

export default Create;
