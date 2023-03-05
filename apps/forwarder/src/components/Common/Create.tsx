import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
////

export interface CreateProps {
  disable?: boolean;
  type?: 'MIC' | 'IDA';
}

const Create: React.FC<CreateProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      //////////////// MIC
      JYO: 'Z',
      IC1: '',
      CH: '',
      CHB: '',
      ICD: dayjs(),
      ST: '',
      TTC: '',
      MAB: '12345678901234567890',
      VSN: 'AB0001/01JAN',
      ARR: dayjs(),
      //////////////// IDA
      // IC1: '',
      IC2: '',
      // CH: '',
      // CHB: '',
      CHH: '',
      CHT: '',
      // ICD: '',
      // ST: '',
      // TTC: '',
      BL_: '12345678901234567890',
      // VSN: '',
      // ARR: '',
    });
  }, []);

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
              <Form.Item label="4.IC1" name="IC1">
                <Select
                  placeholder="申告等種別コード"
                  options={[
                    { value: 'R', label: 'R: 一般申告（緊急通関貨物）' },
                    { value: 'R', label: 'T: 一般申告（特別通関貨物） ' },
                    { value: 'R', label: 'Y: 横持ち申告' },
                    { value: 'R', label: 'K: 横持ち申告（緊急通関貨物） ' },
                    { value: 'R', label: 'E: 自由化申告（緊急通関貨物）' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="6.CH" name="CH">
                <Select placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="7.CHB" name="CHB">
                <Select placeholder="あて先部門コード" />
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
                <Input placeholder="MAＷB番号" />
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
              <Form.Item label="5.IC1" name="IC1">
                <Select
                  placeholder="申告先種別コード"
                  options={[
                    { value: 'R', label: 'R:蔵出輸入（引取・特例）申告' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="6.IC2" name="IC2">
                <Select
                  placeholder="申告貨物識別"
                  options={[
                    { value: 'S', label: 'S: SP貨物（航空のみ入力可）' },
                    { value: 'B', label: 'B: OBC貨物（航空のみ入力可）' },
                    { value: 'L', label: 'L: 外交官貨物' },
                    {
                      value: 'X',
                      label: 'X: MDA貨物（申告等種別「C」のみ入力可）',
                    },
                    { value: 'E', label: 'E: EMS' },
                    { value: 'H', label: 'H: 航空郵便物' },
                    { value: 'M', label: 'M: 海上郵便物（海上のみ入力可）' },
                    { value: 'U', label: 'U: SAL' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="8.CH" name="CH">
                <Select placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="9.CHB" name="CHB">
                <Select placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="10.CHH" name="CHH">
                <Select placeholder="特例申告あて先官署コード" />
              </Form.Item>
              <Form.Item label="11.CHT" name="CHT">
                <Select placeholder="特例申告あて先部門コード" />
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
      <Button
        type="primary"
        disabled={props?.disable}
        onClick={() => setVisible(true)}
      >
        クリエート
      </Button>
    </>
  );
};

export default Create;
