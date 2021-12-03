import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

export interface CreateProps {
  disable?: boolean;
  type?: 'MIC' | 'AID';
}

const Cleansing: React.FC<CreateProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      JYO: 'Z',
      ICD: dayjs(),
      MAB: '12345678901234567890',
      VSN: 'AB0001/01JAN',
      ARR: dayjs(),
    });
  }, []);

  return (
    <>
      <Modal title="クリエート" visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <Form form={form}>
          <Form.Item label="3.JYO" name="JYO">
            <Select
              placeholder="申告条件"
              options={[
                { value: 'K', label: 'Ｋ：開庁時申告' },
                { value: 'H', label: 'Ｈ：予備申告後の本申告' },
                { value: 'Z', label: 'Ｚ：予備申告（貨物搬入時本申告自動起動）' },
                { value: 'U', label: 'Ｕ：予備申告（本邦到着時貨物引取本申告自動起動）' },
                { value: 'S', label: 'Ｓ：予備申告（航空貨物の集積場所で本申告自動起動）' },
              ]}
            />
          </Form.Item>
          <Form.Item label="4.IC1">
            <Select
              placeholder="申告等種別コード"
              options={[
                { value: 'R', label: 'Ｒ：一般申告（緊急通関貨物）' },
                { value: 'R', label: 'Ｔ：一般申告（特別通関貨物） ' },
                { value: 'R', label: 'Ｙ：横持ち申告' },
                { value: 'R', label: 'Ｋ：横持ち申告（緊急通関貨物） ' },
                { value: 'R', label: 'Ｅ：自由化申告（緊急通関貨物）' },
              ]}
            />
          </Form.Item>
          <Form.Item label="6.CH">
            <Select placeholder="あて先官署コード" />
          </Form.Item>
          <Form.Item label="7.CHB">
            <Select placeholder="あて先部門コード" />
          </Form.Item>
          <Form.Item label="8.ICD" name="ICD">
            <DatePicker placeholder="申告予定年月日" format="YYYYMMDD" />
          </Form.Item>
          <Form.Item label="21.ST">
            <Select placeholder="通関予定蔵置場コード" />
          </Form.Item>
          <Form.Item label="22.TTC">
            <Input placeholder="検査立会者" />
          </Form.Item>
          <Form.Item label="33.MAB" name="MAB">
            <Input placeholder="ＭＡＷＢ番号" />
          </Form.Item>
          <Form.Item label="36.VSN" name="VSN">
            <Input placeholder="積載機名" />
          </Form.Item>
          <Form.Item label="37.ARR" name="ARR">
            <DatePicker placeholder="入港年月日" format="YYYYMMDD" />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" disabled={props?.disable} onClick={() => setVisible(true)}>
        クリエート
      </Button>
    </>
  );
};

export default Cleansing;
