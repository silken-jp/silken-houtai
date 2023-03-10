import * as Encoding from 'encoding-japanese';
import { useState } from 'react';
import { Button, Modal, Form, Input, Checkbox, Row, Col, message } from 'antd';
////
import { genEDITexts, genSeinoEDITexts } from '@/services/request/edi-put';

export interface genEDITextProps {
  type: 'seino' | 'sagawa';
}

function switchApi(type: string) {
  switch (type) {
    case 'seino':
      return genSeinoEDITexts;
    case 'sagawa':
      return genEDITexts;
    default:
      return genEDITexts;
  }
}

const genEDIText: React.FC<genEDITextProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // action
  function handleVisible() {
    setVisible(!visible);
  }
  async function handleDownload() {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const EXA_DIS_in = values.EXA_DIS_in.join(',');
      const data = await switchApi(props.type)({ ...values, EXA_DIS_in });
      if (data?.length > 0) {
        // データ作成
        const str = data.join('\r\n');
        const codes = Encoding.stringToCode(str);
        const shiftJisCodeList = Encoding.convert(codes, 'SJIS');
        const uInt8List = new Uint8Array(shiftJisCodeList);
        const blob = new Blob([uInt8List], { type: 'text/plain' });
        // 保存
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${values.MAB}_${values.EXA_DIS_in.join('_')}.txt`;
        a.click();
        message.success(`件数${data.length}のファイルを生成しました。`);
        handleVisible();
        setLoading(false);
      } else {
        throw 'この条件を満たすものが見つかりませんでした。';
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error || 'ファイルの生成が失敗しました。');
    }
  }

  return (
    <>
      <Button onClick={handleVisible}>EDI TXT 生成</Button>
      <Modal
        title="EDI TXT 生成"
        visible={visible}
        onCancel={handleVisible}
        onOk={handleDownload}
        okButtonProps={{
          loading,
        }}
      >
        <Form
          form={form}
          initialValues={{ EXA_DIS_in: ['1', '2', '3'], MAB: '' }}
        >
          <Form.Item name="EXA_DIS_in" label="Status">
            <Checkbox.Group>
              <Row>
                <Col span={6}>
                  <Checkbox value="1" style={{ lineHeight: '32px' }}>
                    1
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="2" style={{ lineHeight: '32px' }}>
                    2
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="3" style={{ lineHeight: '32px' }}>
                    3
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="3k" style={{ lineHeight: '32px' }}>
                    3k
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="MAB" label="MAWB">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default genEDIText;
