import { Button, Modal, Form, Input, Space, Card } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
////
import { inputFormats } from './utils';

export interface HoldActionProps {
  disabled?: boolean;
  handleHold?: any;
}

const HoldAction: React.FC<HoldActionProps> = (props) => {
  // state
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const form = Form.useFormInstance();

  // key press
  useKeyPress('h', () => {
    !props.disabled && setTrue();
  });
  useKeyPress('ctrl.F9', () => {
    visible && handleOK();
  });

  // action
  async function handleOK() {
    await props.handleHold.run();
    setFalse();
  }
  function handleMemo(v: string) {
    const memo = form.getFieldValue('holdMemo') || '';
    form.setFieldsValue({ holdMemo: memo + v + ':' });
  }

  return (
    <>
      <Modal
        title="Hold"
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
              loading={props.handleHold.loading}
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
        <Form.Item name="holdMemo">
          <Input.TextArea rows={8} />
        </Form.Item>
      </Modal>
      <Button disabled={props.disabled} type="text" onClick={setTrue}>
        Hold（H）
      </Button>
    </>
  );
};

export default HoldAction;
