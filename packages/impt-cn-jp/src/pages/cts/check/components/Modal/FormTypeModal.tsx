import { useState } from 'react';
import { Form, Modal, Button, Select, Radio } from 'antd';
import { useKeyPress } from 'ahooks';
////
import { ToolTipInput } from '../Form/CheckFormBasic';

export interface FormTypeModalProps {
  form: any;
}

const FormTypeModal: React.FC<FormTypeModalProps> = (props) => {
  const form = props?.form;
  const [visible, setVisible] = useState(false);
  const [formType, setFormType] = useState('');
  const [IDAType, setIDAType] = useState('');
  const [LS, setLS] = useState('');

  //form type modal
  function handleOpen() {
    setFormType(form.getFieldValue('formType'));
    setIDAType(form.getFieldValue('IDAType'));
    setLS(form.getFieldValue('LS'));
    setVisible(true);
  }
  function handleCancel() {
    setVisible(false);
  }
  function handleOk() {
    form.setFieldsValue({ formType, IDAType, LS });
    handleCancel();
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
        <Form.Item label="業務コード">
          <Select
            value={formType}
            style={{ width: 100 }}
            onSelect={(v) => {
              setFormType(v);
              setIDAType('');
              setLS('');
            }}
            options={[
              { value: 'IDA', label: 'IDA' },
              { value: 'MIC', label: 'MIC' },
            ]}
          />
        </Form.Item>
        {formType === 'IDA' && (
          <>
            <Form.Item label="申告種別">
              <Select
                value={IDAType}
                onSelect={(v: string) => setIDAType(v)}
                style={{ width: 350 }}
                options={[
                  { value: 'C', label: 'AID: 輸入申告（申告納税）' }, // 简化版
                  // { value: 'CA', label: 'AID: 輸入申告（申告納税）A' }, // 简化版
                  // { value: 'CB', label: 'AID: 輸入申告（申告納税）B' }, // 复杂版
                  // { value: 'CC', label: 'AID: 輸入申告（申告納税）C' }, // 复杂版
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
              />
            </Form.Item>
            <Form.Item label="3.大額・少額識別">
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                value={LS}
                onChange={(e) => setLS(e.target.value)}
                options={[
                  { value: 'L', label: 'Large' },
                  { value: 'S', label: 'Small' },
                ]}
              />
            </Form.Item>
          </>
        )}
      </Modal>
      <Button onClick={handleOpen} type="primary">
        業務コード変更(F8)
      </Button>
    </>
  );
};

export default FormTypeModal;
