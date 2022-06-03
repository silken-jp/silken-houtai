import { Button, Modal, Form, Input, Space, Card } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
////
import { inputFormats, checkFocus } from './utils';

export interface SendBackActionProps {
  disabled?: boolean;
  handleSendBack?: any;
}

const SendBackAction: React.FC<SendBackActionProps> = (props) => {
  // state
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const form = Form.useFormInstance();

  // key press
  useKeyPress('b', () => {
    !props.disabled && checkFocus() && setTrue();
  });
  useKeyPress('ctrl.F9', () => {
    visible && handleOK();
  });

  // action
  async function handleOK() {
    await props.handleSendBack.run();
    setFalse();
  }
  function handleMemo(v: string) {
    const memo = form.getFieldValue('sendbackMemo') || '';
    form.setFieldsValue({ sendbackMemo: memo + v + ':' });
  }

  return (
    <>
      <Modal
        title="SendBack"
        visible={visible}
        onCancel={setFalse}
        footer={
          <Space>
            <Button size="middle" onClick={setFalse}>
              キャンセル(ESC)
            </Button>
            <Button
              size="middle"
              type="primary"
              loading={props.handleSendBack.loading}
              onClick={handleOK}
            >
              確定(Ctrl + F9)
            </Button>
          </Space>
        }
      >
        <Card type="inner" size="small" title="Short Input" bordered={false}>
          <Space wrap>
            {inputFormats.map((v) => (
              <Button
                size="small"
                key={v}
                type="dashed"
                onClick={() => handleMemo(v)}
              >
                {v}
              </Button>
            ))}
          </Space>
        </Card>
        <Form.Item name="sendbackMemo">
          <Input.TextArea rows={8} />
        </Form.Item>
      </Modal>
      <Button disabled={props.disabled} type="text" onClick={setTrue}>
        Send Back（B）
      </Button>
    </>
  );
};

export default SendBackAction;
