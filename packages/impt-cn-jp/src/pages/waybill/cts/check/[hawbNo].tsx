import React, { useEffect, useState } from 'react';
import { Card, Form, Space, Select, Radio, Button } from 'antd';
import { useKeyPress } from 'ahooks';
////
import AIDForm from './components/AIDForm';
import MICForm from './components/MICForm';

export interface WaybillCheckProps {}

const urls = [
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/ida-03.pdf',
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/mic-04.pdf',
];

const WaybillCheck: React.FC<WaybillCheckProps> = () => {
  const [visible, setVisible] = useState(false);
  const [urlIndex, setUrlIndex] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      formType1: 'MIC',
    });
  }, []);

  // key: w
  useKeyPress('w', () => {
    const channel = new BroadcastChannel('sk_import');
    setUrlIndex(!urlIndex ? 1 : 0);
    channel.postMessage({
      url: urls[urlIndex],
    });
  });
  // key: v
  useKeyPress('F8', () => {
    setVisible(!visible);
  });

  const formTypeOption = [
    { value: 'AID', label: 'AID: 輸入申告' },
    {
      value: 'ASD',
      label: 'ASD: 輸入申告（少額関税無税）',
    },
    { value: 'AHK', label: 'AHK: 輸入（引取）申告' },
    { value: 'AHT', label: 'AHT: 輸入（引取・特例）申告' },
    { value: 'AIS', label: 'AIS: 蔵入等承認申請' },
    { value: 'AIW', label: 'AIW: 蔵出等輸入申告' },
    {
      value: 'AST',
      label: 'AST: 蔵出輸入（引取・特例）申告',
    },
  ];
  return (
    <Card
      extra={
        <Button target="_blank" href="http://localhost:8000/#/waybill/cts/check/import">
          インボイス
        </Button>
      }
    >
      <Form size="small" form={form}>
        {/* <Form.Item label="Example" name="test">
          <PopoverInput />
        </Form.Item> */}
        <Space>
          <Form.Item label="FormType" name="formType1">
            <Select
              style={{ width: 100 }}
              options={[
                { value: 'IDA', label: 'IDA' },
                { value: 'MIC', label: 'MIC' },
              ]}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(a, b) => a?.formType1 !== b?.formType1}>
            {({ getFieldValue }) =>
              getFieldValue('formType1') === 'IDA' ? (
                <Space>
                  <Form.Item label="" name="formType2">
                    <Select style={{ width: 400 }} options={formTypeOption} />
                  </Form.Item>
                  <Form.Item label="3.大額・少額識別" name="LS">
                    <Radio.Group
                      size="small"
                      optionType="button"
                      buttonStyle="solid"
                      options={[
                        { value: 'L', label: 'Large' },
                        { value: 'S', label: 'Small' },
                      ]}
                    />
                  </Form.Item>
                </Space>
              ) : null
            }
          </Form.Item>
        </Space>
        <Form.Item shouldUpdate={(a, b) => a?.formType1 !== b?.formType1 || a?.formType2 !== b?.formType2}>
          {({ getFieldValue }) => {
            if (getFieldValue('formType1') === 'MIC') return <MICForm />;
            switch (getFieldValue('formType2')) {
              case 'AID':
                return <AIDForm />;
              case 'ASD':
                return <AIDForm />;
              case 'AHK':
                return <AIDForm />;
              case 'AHT':
                return <AIDForm />;
              case 'AIS':
                return <AIDForm />;
              case 'AIW':
                return <AIDForm />;
              case 'AST':
                return <AIDForm />;
              default:
                return null;
            }
          }}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WaybillCheck;
