import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Space,
  Button,
  Modal,
  Input,
  message,
  Spin,
  Tag,
} from 'antd';
import { useKeyPress, useRequest } from 'ahooks';
import { Link, useParams, useHistory } from 'umi';
////
import { getUserInfo } from '@/services/useStorage';
import {
  getWaybill,
  moveWaybill,
  updateWaybill,
} from '@/services/request/waybill';
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
  const { data, error, loading } = useRequest(
    async () => await getWaybill({ waybillId }),
    {
      refreshDeps: [waybillId],
    },
  );

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
  const [commandState, setCommandState] = useState({
    visible: false,
    command: '',
  });
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const handleExit = () => onMoveWaybill(99);
    window.addEventListener('beforeunload', handleExit);
    return () => {
      window.removeEventListener('beforeunload', handleExit);
    };
  }, []);

  useEffect(() => {
    setUrlIndex(!urlIndex ? 1 : 0);
    postImporter({ url: urls[urlIndex] });
  }, [props?.dataSource?._id]);

  function onMoveWaybill(move: -1 | 1 | 99) {
    const { name } = getUserInfo();
    return moveWaybill({
      move,
      type: !props?.dataSource?.MAB ? 0 : 1,
      waybill: props?.dataSource?._id,
      MAB: props?.dataSource?.MAB || '',
      LS: form.getFieldValue('LS'),
      current_processor: name,
      waybill_status: props?.dataSource?.waybill_status || 1,
    });
  }

  async function onSubmit(waybill_status: number) {
    form
      .validateFields()
      .then(async (values) => {
        const { _id } = getUserInfo();
        await updateWaybill({
          ...values,
          user: _id,
          waybillId: props?.dataSource?._id,
          process_status: 2,
          process_type: 1,
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
      handleHold.run();
    }
  });

  useKeyPress('n', () => {
    if (checkFocus()) {
      handleNext.run();
    }
  });

  useKeyPress('p', () => {
    if (checkFocus()) {
      handlePrevious.run();
    }
  });

  // useKeyPress('s', () => {
  //   if (checkFocus()) {
  //     handleSendBack.run();
  //   }
  // });

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
      handleAccept.run();
    }
  });

  useKeyPress('F10', () => {
    window.open(
      window.location.origin + window.location.pathname + '#/cts/check/import',
    );
  });

  useKeyPress('ctrl.x', async () => {
    if (checkFocus()) {
      onExit();
    } else {
      postFocus({ blur: true });
    }
  });

  async function onExit() {
    try {
      await onMoveWaybill(99);
      history.goBack();
    } catch (error) {
      message.error('Exit失敗、もう一度試してください');
    }
  }

  function handleCancel() {
    commandState.visible && setCommandState({ visible: false, command: '' });
  }

  // 执行函数 未防抖
  async function onPrevious() {
    try {
      const res = await onMoveWaybill(-1);
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

  async function onNext() {
    try {
      const res = await onMoveWaybill(1);
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

  async function onHold() {
    await onNext();
    await onSubmit(2);
  }

  // async function onSendBack() {
  //   await onNext();
  //   await onSubmit(3);
  // }

  async function onAccept() {
    await onNext();
    await onSubmit(1);
  }

  // 防抖
  const handlePrevious = useRequest(onPrevious, {
    debounceWait: 100,
    manual: true,
  });
  const handleNext = useRequest(onNext, {
    debounceWait: 100,
    manual: true,
  });
  const handleHold = useRequest(onHold, {
    debounceWait: 100,
    manual: true,
  });
  // const handleSendBack = useRequest(onSendBack, {
  //   debounceWait: 100,
  //   manual: true,
  // });
  const handleAccept = useRequest(onAccept, {
    debounceWait: 100,
    manual: true,
  });

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
          onChange={(e) =>
            setCommandState({ visible: true, command: e.target.value })
          }
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
        bodyStyle={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}
        title={
          <Space>
            <Button onClick={onExit}>Exit（Ctrl + x）</Button>
            <Tag>
              {
                ['Other', 'Normal', 'Hold', 'SendBack'][
                  props?.dataSource?.waybill_status || 1
                ]
              }
            </Tag>
            <Form.Item
              noStyle
              shouldUpdate={(a, b) =>
                a?.formType !== b?.formType || a?.IDAType !== b?.IDAType
              }
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
          <Button type="text" onClick={handlePrevious.run}>
            Previous（P）
          </Button>,
          <Button type="text" onClick={handleNext.run}>
            Next（N）
          </Button>,
          <Button type="text" onClick={handleHold.run}>
            Hold（H）
          </Button>,
          // <Button type="text" onClick={handleSendBack.run}>
          //   Send Back（B）
          // </Button>,
          <Button type="text" onClick={handleAccept.run}>
            Accept（F9）
          </Button>,
        ]}
      >
        <Form.Item
          shouldUpdate={(a, b) =>
            a?.formType !== b?.formType || a?.IDAType !== b?.IDAType
          }
        >
          {({ getFieldValue }) => (
            <AllCheckForm
              formType={getFieldValue('formType')}
              IDAType={getFieldValue('IDAType')}
            />
          )}
        </Form.Item>
      </Card>
    </Form>
  );
};

export default WaybillContainer;
