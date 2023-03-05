import { useEffect, useState } from 'react';
import { Form, Modal, Button } from 'antd';
import { useKeyPress } from 'ahooks';
////
import { ToolTipInput } from '../Form/CheckFormBasic';
import { CODE_SOURCE } from '@/utils/constant';

export interface WaybillTypeModalProps {
  form: any;
  disabled: boolean;
}

function postFocus({ no, modal, blur }: any) {
  const channel = new BroadcastChannel('sk_focus');
  channel.postMessage({ no, modal, blur });
}

const WaybillTypeModal: React.FC<WaybillTypeModalProps> = (props) => {
  // state
  const form = props?.form;
  const [visible, setVisible] = useState(false);
  const [waybill_type, setWaybillType] = useState('');
  const [IDA_type, setIDA_type] = useState('');
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
    setWaybillType(form.getFieldValue('waybill_type'));
    setIDA_type(form.getFieldValue('IDA_type'));
    setLS(form.getFieldValue('LS'));
    setIC1(form.getFieldValue('IC1') || 'R');
    setIC2(form.getFieldValue('IC2') || 'S');
    setVisible(true);
  }
  function handleCancel() {
    setVisible(false);
  }
  function handleOk() {
    let exChange: any = {};
    if (form.getFieldValue('waybill_type') !== waybill_type) {
      exChange.NT1 = form?.getFieldValue('NT2');
      exChange.NT2 = form?.getFieldValue('NT1');
    }
    form.setFieldsValue({ waybill_type, IDA_type, LS, IC1, IC2, ...exChange });
    handleCancel();
  }
  function handleChangeLS(v: string) {
    setLS(v);
    if (v === 'M') {
      setWaybillType('MIC');
      setIDA_type('');
      setIC1('R');
      setIC2('');
    }
    if (v === 'L' || v === 'S') {
      setWaybillType('IDA');
      setIDA_type('');
      setIC1('R');
      setIC2('S');
    }
  }

  useKeyPress('F8', () => {
    !visible && handleOpen();
  });

  useKeyPress('ctrl.F9', () => {
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
        okText="確定(Ctrl + F9)"
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
            disabled={true}
            value={waybill_type}
            onChange={setWaybillType}
          />
        </Form.Item>
        {waybill_type === 'IDA' && (
          <>
            <Form.Item label="申告種別">
              <ToolTipInput
                source={CODE_SOURCE['IDA_TYPE']}
                limit={1}
                value={IDA_type}
                onChange={setIDA_type}
              />
            </Form.Item>
            <Form.Item label="5.IC1">
              <ToolTipInput
                limit={1}
                value={IC1}
                onChange={setIC1}
                source={CODE_SOURCE['IC1']}
              />
            </Form.Item>
            <Form.Item label="6.IC2">
              <ToolTipInput
                limit={1}
                value={IC2}
                onChange={setIC2}
                source={CODE_SOURCE['IC2']}
              />
            </Form.Item>
          </>
        )}
        {waybill_type === 'MIC' && (
          <Form.Item label="4.IC1">
            <ToolTipInput
              limit={1}
              value={IC1}
              onChange={setIC1}
              source={CODE_SOURCE['IC2']}
            />
          </Form.Item>
        )}
      </Modal>
      <Button disabled={props?.disabled} onClick={handleOpen}>
        業務コード変更(F8)
      </Button>
    </>
  );
};

export default WaybillTypeModal;
