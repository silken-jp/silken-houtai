import { useEffect, useState } from 'react';
import { Card, Form, Space, Button, Modal, Input } from 'antd';
import { useKeyPress, useRequest } from 'ahooks';
import { Link, useParams } from 'umi';
////
import { getWaybill } from '@/services/request/waybill';
import AllCheckForm from './components/AllCheckForm';
import FormTypeModal from './components/Modal/FormTypeModal';
import SearchModal from './components/Modal/SearchModal';

const urls = [
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/ida-03.pdf',
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/mic-04.pdf',
];

export interface WaybillContainerProps {}
const WaybillContainer: React.FC<WaybillContainerProps> = () => {
  const { waybillId } = useParams<any>();
  const { data, error, loading } = useRequest(async () => await getWaybill({ waybillId }));

  if (loading) return <>loading...</>;
  if (error) return <>error...</>;
  return <WaybillCheck dataSource={data} />;
};

export interface WaybillCheckProps {
  dataSource: API.Waybill;
}
const WaybillCheck: React.FC<WaybillCheckProps> = (props) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [commandState, setCommandState] = useState({ visible: false, command: '' });
  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields();
  }, []);

  function checkFocus() {
    return document.activeElement?.nodeName !== 'INPUT';
  }

  useKeyPress('e', () => {
    if (checkFocus()) {
      form.getFieldValue('formType') === 'IDA' && postFocus({ no: '14.' });
      form.getFieldValue('formType') === 'MIC' && postFocus({ no: '50.' });
    }
  });

  useKeyPress('h', () => {
    if (checkFocus()) {
      form.isFieldsTouched() && confirm('Hold');
    }
  });

  useKeyPress('s', () => {
    if (checkFocus()) {
      form.isFieldsTouched() && confirm('Send Back');
    }
  });

  function confirm(title: string) {
    Modal.confirm({
      title,
      content: `データの変更を保存して${title}しますか？`,
      onCancel: () => {},
      onOk: () => {},
    });
  }

  useKeyPress('F2', () => {
    if (checkFocus()) {
      setCommandState({ visible: true, command: '' });
    }
  });

  useKeyPress('F9', () => {
    if (checkFocus()) {
      setUrlIndex(!urlIndex ? 1 : 0);
      postImporter({ url: urls[urlIndex] });
    }
  });

  useKeyPress('F10', () => {
    window.open(window.location.origin + window.location.pathname + '#/cts/check/import');
  });

  useKeyPress('ctrl.x', () => {
    if (checkFocus()) {
      location.assign(window.location.origin + window.location.pathname + '#/home');
    } else {
      postBlur();
    }
  });

  function handleCancel() {
    commandState.visible && setCommandState({ visible: false, command: '' });
  }

  function postImporter({ url }: any) {
    const channel = new BroadcastChannel('sk_import');
    channel.postMessage({ url });
  }

  function postFocus({ no }: any) {
    const channel = new BroadcastChannel('sk_focus');
    channel.postMessage({ no });
  }

  function postBlur() {
    const channel = new BroadcastChannel('sk_focus');
    channel.postMessage({ blur: true });
  }

  return (
    <Form
      size="small"
      form={form}
      initialValues={{
        formType: ['IDA', 'MIC'][props?.dataSource?.waybill_type],
        IDAType: '',
        NOF: 'R',
        PF: '00010544650858',
        ...props?.dataSource,
      }}
    >
      <Modal
        style={{ top: 0 }}
        bodyStyle={{ padding: '6px 8px' }}
        closable={false}
        mask={false}
        destroyOnClose
        visible={commandState.visible}
        footer={null}
        onCancel={handleCancel}
      >
        <Input
          value={commandState.command}
          autoFocus
          onChange={(e) => setCommandState({ visible: true, command: e.target.value })}
          onPressEnter={(e) => {
            postFocus({ no: e.currentTarget.value });
            setCommandState({ visible: false, command: '' });
          }}
          placeholder="隠し欄表示: １ ｜ カーソル移動: 33. ｜ サーチ: 13.."
        />
      </Modal>
      <SearchModal form={form} />
      <Card
        size="default"
        title={
          <Space>
            <Link to="/home">
              <Button>Exit（Ctrl + x）</Button>
            </Link>
            <Form.Item
              noStyle
              shouldUpdate={(a, b) => a?.formType !== b?.formType || a?.IDAType !== b?.IDAType}
            >
              {({ getFieldValue }) => {
                const formType = getFieldValue('formType');
                const IDAType = getFieldValue('IDAType');
                const LS = getFieldValue('LS');
                return (
                  <Space>
                    {formType && <span>業務コード: {formType}</span>}
                    {IDAType && <span>申告種別: {IDAType}</span>}
                    {LS && <span>大少額識別: {LS}</span>}
                  </Space>
                );
              }}
            </Form.Item>
          </Space>
        }
        extra={
          <Space>
            <FormTypeModal form={form} />
            <Link to="/cts/check/import" target="_blank">
              <Button>インボイス(F10)</Button>
            </Link>
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
        <Form.Item
          shouldUpdate={(a, b) => a?.formType !== b?.formType || a?.IDAType !== b?.IDAType}
        >
          {({ getFieldValue }) => (
            <AllCheckForm formType={getFieldValue('formType')} IDAType={getFieldValue('IDAType')} />
          )}
        </Form.Item>
      </Card>
    </Form>
  );
};

export default WaybillContainer;
