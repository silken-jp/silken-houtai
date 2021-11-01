import React, { useEffect, useState } from 'react';
import { Card, Form, Space, Button, Radio } from 'antd';
import { useKeyPress } from 'ahooks';
////
import AllCheckForm from './components/AllCheckForm';
import FormTypeModal from './components/FormTypeModal';
import SearchModal from './components/SearchModal';

export interface WaybillCheckProps {}

const urls = [
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/ida-03.pdf',
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/mic-04.pdf',
];

const WaybillCheck: React.FC<WaybillCheckProps> = () => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ formType: 'MIC', IDAType: '', LS: '' });
  }, []);

  // key: w
  useKeyPress('F9', () => {
    setUrlIndex(!urlIndex ? 1 : 0);
    postImporter({ url: urls[urlIndex] });
  });

  useKeyPress('X', () => {
    document.activeElement?.nodeName === 'BODY' && location.assign('/#/home');
  });

  function postImporter({ url }: any) {
    const channel = new BroadcastChannel('sk_import');
    channel.postMessage({ url });
  }

  function handleSearchOk(v: any) {
    form.setFieldsValue({ ...v });
  }

  return (
    <Form size="small" form={form}>
      <SearchModal onOk={handleSearchOk} />
      <Card
        size="default"
        title={
          <Space>
            <Button href="/#/home">Exit（X）</Button>
            <Form.Item noStyle shouldUpdate={(a, b) => a?.formType !== b?.formType || a?.IDAType !== b?.IDAType}>
              {({ getFieldValue }) => {
                const formType = getFieldValue('formType');
                const IDAType = getFieldValue('IDAType');
                return (
                  <Space>
                    {formType && <span>業務コード: {formType}</span>}
                    {IDAType && <span>申告種別: {IDAType}</span>}
                    {IDAType && (
                      <Form.Item name="LS" noStyle>
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
                    )}
                  </Space>
                );
              }}
            </Form.Item>
          </Space>
        }
        extra={
          <Space>
            <FormTypeModal form={form} />
            <Button target="_blank" href={`/#/cts/check/import`}>
              インボイス
            </Button>
          </Space>
        }
        actions={[
          <Button type="text">Previous（P）</Button>,
          <Button type="text">Next（N）</Button>,
          <Button type="text">Hold（H）</Button>,
          <Button type="text">Send Back（B）</Button>,
          <Button type="text">Accept（F9）</Button>,
        ]}
      >
        <Form.Item shouldUpdate={(a, b) => a?.formType !== b?.formType || a?.IDAType !== b?.IDAType}>
          {({ getFieldValue }) => (
            <AllCheckForm formType={getFieldValue('formType')} IDAType={getFieldValue('IDAType')} />
          )}
        </Form.Item>
      </Card>
    </Form>
  );
};

export default WaybillCheck;
