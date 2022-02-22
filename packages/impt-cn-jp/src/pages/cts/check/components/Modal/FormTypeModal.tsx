import { useEffect, useState } from 'react';
import { Form, Modal, Button } from 'antd';
import { useKeyPress } from 'ahooks';
////
import { ToolTipInput } from '../Form/CheckFormBasic';

export interface FormTypeModalProps {
  form: any;
}

function postFocus({ no, modal, blur }: any) {
  const channel = new BroadcastChannel('sk_focus');
  channel.postMessage({ no, modal, blur });
}

const FormTypeModal: React.FC<FormTypeModalProps> = (props) => {
  const form = props?.form;
  const [visible, setVisible] = useState(false);
  const [formType, setFormType] = useState('');
  const [IDAType, setIDAType] = useState('');
  const [LS, setLS] = useState('');
  const [IC1, setIC1] = useState('');
  const [IC2, setIC2] = useState('');

  useEffect(() => {
    if (visible) {
      postFocus({ no: '99999.' });
    }
  }, [visible]);

  //form type modal
  function handleOpen() {
    setFormType(form.getFieldValue('formType'));
    setIDAType(form.getFieldValue('IDAType'));
    setLS(form.getFieldValue('LS'));
    setIC1(form.getFieldValue('IC1') || 'R');
    setIC2(form.getFieldValue('IC2') || 'S');
    setVisible(true);
  }
  function handleCancel() {
    setVisible(false);
  }
  function handleOk() {
    form.setFieldsValue({ formType, IDAType, LS, IC1, IC2 });
    handleCancel();
  }
  function handleChangeLS(v: string) {
    setLS(v);
    if (v === 'M') {
      setFormType('MIC');
      setIDAType('');
      setIC1('R');
      setIC2('');
    }
    if (v === 'L' || v === 'S') {
      setFormType('IDA');
      setIDAType('');
      setIC1('R');
      setIC2('S');
    }
  }

  useKeyPress('F8', () => {
    !visible && handleOpen();
  });

  useKeyPress('F9', () => {
    visible && handleOk();
  });

  return (
    <>
      <Modal
        width={600}
        title="業務コード変更"
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        cancelText="キャンセル(ESC)"
        okText="確定(F9)"
      >
        <Form.Item label="3.L・S・M識別">
          <ToolTipInput
            no="99999"
            source={[
              { value: 'L', label: 'Large' },
              { value: 'S', label: 'Small' },
              { value: 'M', label: 'MIC' },
            ]}
            limit={1}
            value={LS}
            onChange={handleChangeLS}
          />
        </Form.Item>
        <Form.Item label="業務コード">
          <ToolTipInput
            source={[
              { value: 'IDA', label: 'IDA' },
              { value: 'MIC', label: 'MIC' },
            ]}
            limit={3}
            value={formType}
            onChange={setFormType}
          />
        </Form.Item>
        {formType === 'IDA' && (
          <>
            <Form.Item label="申告種別">
              <ToolTipInput
                source={[
                  { value: 'C', label: 'AID: 輸入申告（申告納税）' },
                  { value: 'F', label: 'AID: 輸入申告（賦課課税）' },
                  { value: 'Y', label: 'ASD: 輸入申告（少額関税無税）' },
                  { value: 'H', label: 'AHK: 輸入（引取）申告' },
                  { value: 'N', label: 'AHK: 特例委託輸入（引取）申告' },
                  { value: 'J', label: 'AHT: 輸入（引取・特例）申告' },
                  { value: 'P', label: 'AHT: 特例委託輸入（引取・特例）申告' },
                  { value: 'S', label: 'AIS: 蔵入承認申請' },
                  { value: 'M', label: 'AIS: 移入承認申請' },
                  { value: 'A', label: 'AIS: 総保入承認申請' },
                  { value: 'G', label: 'AIS: 展示等申告' },
                  { value: 'K', label: 'AIW: 蔵出輸入申告（申告納税）' },
                  { value: 'D', label: 'AIW: 蔵出輸入申告（賦課納税）' },
                  { value: 'U', label: 'AIW: 移出輸入申告（申告納税）' },
                  { value: 'L', label: 'AIW: 移出輸入申告（賦課納税）' },
                  { value: 'B', label: 'AIW: 総保出輸入申告（申告納税）' },
                  { value: 'E', label: 'AIW: 総保出輸入申告（賦課納税）' },
                  { value: 'R', label: 'AST: 蔵出輸入（引取・特例）申告' },
                ]}
                limit={1}
                value={IDAType}
                onChange={setIDAType}
              />
            </Form.Item>
            <Form.Item label="5.IC1">
              <ToolTipInput
                limit={1}
                value={IC1}
                onChange={setIC1}
                source={[
                  { value: 'R', label: 'R: 一般申告（緊急通関貨物）' },
                  { value: 'T', label: 'T: 一般申告（特別通関貨物） ' },
                  { value: 'Y', label: 'Y: 横持ち申告' },
                  { value: 'K', label: 'K: 横持ち申告（緊急通関貨物） ' },
                  { value: 'E', label: 'E: 自由化申告（緊急通関貨物）' },
                ]}
              />
            </Form.Item>
            <Form.Item label="6.IC2">
              <ToolTipInput
                limit={1}
                value={IC2}
                onChange={setIC2}
                source={[
                  { value: 'S', label: 'S: SP貨物（航空のみ入力可）' },
                  { value: 'B', label: 'B: OBC貨物（航空のみ入力可）' },
                  { value: 'L', label: 'L: 外交官貨物' },
                  { value: 'X', label: 'X: MDA貨物（申告等種別「C」のみ入力可）' },
                  { value: 'E', label: 'E: EMS' },
                  { value: 'H', label: 'H: 航空郵便物' },
                  { value: 'M', label: 'M: 海上郵便物（海上のみ入力可）' },
                  { value: 'U', label: 'U: SAL' },
                ]}
              />
            </Form.Item>
          </>
        )}
        {formType === 'MIC' && (
          <Form.Item label="4.IC1">
            <ToolTipInput
              limit={1}
              value={IC1}
              onChange={setIC1}
              source={[
                { value: 'R', label: 'R: 一般申告（緊急通関貨物）' },
                { value: 'T', label: 'T: 一般申告（特別通関貨物） ' },
                { value: 'Y', label: 'Y: 横持ち申告' },
                { value: 'K', label: 'K: 横持ち申告（緊急通関貨物） ' },
                { value: 'E', label: 'E: 自由化申告（緊急通関貨物）' },
              ]}
            />
          </Form.Item>
        )}
      </Modal>
      <Button onClick={handleOpen} type="primary">
        業務コード変更(F8)
      </Button>
    </>
  );
};

export default FormTypeModal;
