import { useEffect, useState } from 'react';
import { Card, Form, Space, Button, Modal, Input, message, Spin, Tag } from 'antd';
import { useKeyPress, useRequest } from 'ahooks';
import { Link, useParams, useHistory } from 'umi';
////
import { getUserInfo } from '@/services/useStorage';
import { getWaybill, moveWaybill, updateWaybill } from '@/services/request/waybill';
import AllCheckForm from './components/AllCheckForm';
import FormTypeModal from './components/Modal/FormTypeModal';
import SearchModal from './components/Modal/SearchModal';

const urls = [
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/ida-03.pdf',
  'https://bbs.naccscenter.com/naccs/dfw/web/data/ref_6nac/naccs/mic-04.pdf',
];

function postImporter({ url }: any) {
  const channel = new BroadcastChannel('sk_import');
  channel.postMessage({ url });
}

function postFocus({ no, modal, blur }: any) {
  const channel = new BroadcastChannel('sk_focus');
  channel.postMessage({ no, modal, blur });
}

function checkFocus() {
  return document.activeElement?.nodeName !== 'INPUT';
}

export interface WaybillContainerProps {}
const WaybillContainer: React.FC<WaybillContainerProps> = () => {
  const { waybillId } = useParams<any>();
  const { data, error, loading } = useRequest(async () => await getWaybill({ waybillId }), {
    refreshDeps: [waybillId],
  });

  if (loading)
    return (
      <Spin spinning={loading} delay={0.5}>
        <WaybillCheck />
      </Spin>
    );
  if (error) return <>error...</>;
  return <WaybillCheck dataSource={data} />;
};

export interface WaybillCheckProps {
  dataSource?: API.Waybill;
}
const WaybillCheck: React.FC<WaybillCheckProps> = (props) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [commandState, setCommandState] = useState({ visible: false, command: '' });
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const handleExit = () => handleMoveWaybill(99);
    window.addEventListener('beforeunload', handleExit);
    return () => {
      window.removeEventListener('beforeunload', handleExit);
    };
  }, []);

  useEffect(() => {
    setUrlIndex(!urlIndex ? 1 : 0);
    postImporter({ url: urls[urlIndex] });
  }, [props?.dataSource?._id]);

  async function handleMoveWaybill(move: -1 | 1 | 99) {
    const { name } = getUserInfo();
    return await moveWaybill({
      move,
      type: !props?.dataSource?.MAB ? 0 : 1,
      waybill: props?.dataSource?._id,
      MAB: props?.dataSource?.MAB || '',
      LS: form.getFieldValue('LS'),
      current_processor: name,
      waybill_status: props?.dataSource?.waybill_status || 1,
    });
  }

  async function handleSubmit(waybill_status: number) {
    form
      .validateFields()
      .then(async (values) => {
        await updateWaybill({
          ...values,
          waybillId: props?.dataSource?._id,
          process_status: 2,
          waybill_status,
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  useKeyPress('e', () => {
    if (checkFocus()) {
      form.getFieldValue('formType') === 'IDA' && postFocus({ no: '14.' });
      form.getFieldValue('formType') === 'MIC' && postFocus({ no: '50.' });
    }
  });

  useKeyPress('h', () => {
    if (checkFocus()) {
      handleHold();
    }
  });

  useKeyPress('n', () => {
    if (checkFocus()) {
      handleNext();
    }
  });

  useKeyPress('p', () => {
    if (checkFocus()) {
      handlePrevious();
    }
  });

  useKeyPress('s', () => {
    if (checkFocus()) {
      handleSendBack();
    }
  });

  useKeyPress('F2', () => {
    if (checkFocus()) {
      setCommandState({ visible: true, command: '' });
    } else {
      const no = (document.activeElement as HTMLInputElement)?.dataset?.no;
      const formType = form.getFieldValue('formType');
      if (formType === 'IDA' && (no === '13' || no === '14')) {
        postFocus({ modal: 'search' });
      }
      if (formType === 'MIC' && (no === '9' || no === '10')) {
        postFocus({ modal: 'search' });
      }
    }
  });

  useKeyPress('F9', () => {
    if (checkFocus()) {
      handleAccept();
    }
  });

  useKeyPress('F10', () => {
    window.open(window.location.origin + window.location.pathname + '#/cts/check/import');
  });

  useKeyPress('ctrl.x', async () => {
    if (checkFocus()) {
      try {
        await handleMoveWaybill(99);
        location.assign(window.location.origin + window.location.pathname + '#/home');
      } catch (error) {
        message.error('退出失败,请重试');
      }
    } else {
      postFocus({ blur: true });
    }
  });

  function handleCancel() {
    commandState.visible && setCommandState({ visible: false, command: '' });
  }

  async function handlePrevious() {
    try {
      const res = await handleMoveWaybill(-1);
      if (res?._id) {
        history.replace('/cts/check/' + res._id);
      } else {
        throw 'すでに最初の件です';
      }
    } catch (error: any) {
      if (error?.message) {
        message.warning(error?.message);
      } else {
        message.warning(error);
      }
    }
  }

  async function handleNext() {
    try {
      const res = await handleMoveWaybill(1);
      if (res?._id) {
        history.replace('/cts/check/' + res._id);
      } else {
        throw 'すでに最後の件です';
      }
    } catch (error: any) {
      if (error?.message) {
        message.warning(error?.message);
      } else {
        message.warning(error);
      }
    }
  }

  async function handleHold() {
    const onOk = async () => {
      await handleNext();
      await handleSubmit(2);
    };
    form.isFieldsTouched()
      ? Modal.confirm({
          title: 'Hold',
          content: `データの変更を保存して[Hold]しますか?`,
          onCancel: async () => {
            await handleNext();
          },
          onOk,
        })
      : await handleNext();
  }

  async function handleSendBack() {
    const onOk = async () => {
      await handleNext();
      await handleSubmit(3);
    };
    form.isFieldsTouched()
      ? Modal.confirm({
          title: 'Send Back',
          content: `データの変更を保存して[Send Back]しますか?`,
          onCancel: async () => {
            await handleNext();
          },
          onOk,
        })
      : await handleNext();
  }

  async function handleAccept() {
    await handleNext();
    await handleSubmit(1);
  }

  return (
    <Form
      size="small"
      form={form}
      initialValues={{
        formType: ['IDA', 'MIC'][props?.dataSource?.waybill_type || 1],
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
            if (commandState?.command?.endsWith('..')) {
              postFocus({ modal: 'search' });
            } else if (commandState?.command?.endsWith('.')) {
              postFocus({ no: commandState?.command });
            } else {
              postFocus({ modal: commandState?.command });
            }
            setCommandState({ visible: false, command: '' });
          }}
          placeholder="隠し欄表示: １ ｜ カーソル移動: 33. ｜ サーチ: 13.."
        />
      </Modal>
      <SearchModal form={form} />
      <Card
        size="default"
        bodyStyle={{ height: 'calc(100vh - 112px)' }}
        title={
          <Space>
            <Link to="/home">
              <Button>Exit（Ctrl + x）</Button>
            </Link>
            <Tag>
              {['Other', 'Normal', 'Hold', 'SendBack'][props?.dataSource?.waybill_status || 1]}
            </Tag>
            <Form.Item
              noStyle
              shouldUpdate={(a, b) => a?.formType !== b?.formType || a?.IDAType !== b?.IDAType}
            >
              {({ getFieldValue }) => {
                const formType = getFieldValue('formType');
                const IDAType = getFieldValue('IDAType');
                const LS = getFieldValue('LS');
                const IC1 = getFieldValue('IC1');
                const IC2 = getFieldValue('IC2');
                return (
                  <Space>
                    {LS && <span>L・S・M識別: {LS}</span>}
                    {formType && <span>業務コード: {formType}</span>}
                    {IDAType && <span>申告種別: {IDAType}</span>}
                    {IC1 && <span>申告先種別コード:{IC1}</span>}
                    {IC2 && <span>申告貨物識別:{IC2}</span>}
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
          <Button type="text" onClick={handlePrevious}>
            Previous（P）
          </Button>,
          <Button type="text" onClick={handleNext}>
            Next（N）
          </Button>,
          <Button type="text" onClick={handleHold}>
            Hold（H）
          </Button>,
          // <Button type="text" onClick={handleSendBack}>
          //   Send Back（B）
          // </Button>,
          <Button type="text" onClick={handleAccept}>
            Accept（F9）
          </Button>,
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
