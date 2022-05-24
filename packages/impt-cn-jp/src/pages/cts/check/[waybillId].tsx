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
  Alert,
} from 'antd';
import { useKeyPress, useRequest } from 'ahooks';
import { Link, useParams, useHistory } from 'umi';
////
import {
  getUserInfo,
  getSearchParams,
  getSelectedParams,
  removeSelectedParams,
} from '@/services/useStorage';
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
  return document.activeElement?.nodeName === 'BODY';
}

// Todo: cursor 判断

export interface WaybillContainerProps {}
const WaybillContainer: React.FC<WaybillContainerProps> = () => {
  const { waybillId } = useParams<any>();
  const { data, error, loading } = useRequest(
    async () => await getWaybill({ waybillId }),
    { refreshDeps: [waybillId] },
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
  // state
  const [urlIndex, setUrlIndex] = useState(0);
  const [cursor, setCursor] = useState(false);
  const [commandState, setCommandState] = useState({
    visible: false,
    command: '',
  });
  const [form] = Form.useForm();
  const history = useHistory();
  const userInfo = getUserInfo();
  const process_status = props?.dataSource?.process_status || 0;
  const current_processor = props?.dataSource?.current_processor || '';
  const disabled = process_status === 1 && current_processor !== userInfo?.name;
  const search = new URLSearchParams(history.location.search);
  const actionType = search.get('actionType'); // 选件方式 0:check 1:search
  const checkType = search.get('checkType'); //  0:cleansing 1:broker check
  const actionLS = search.get('LS');

  //effect
  useEffect(() => {
    const handleExit = () => onMoveWaybill(99);
    window.addEventListener('beforeunload', handleExit);
    return () => {
      window.removeEventListener('beforeunload', handleExit);
    };
  }, []);

  useEffect(() => {
    // import PDF联动
    form.validateFields();
    setUrlIndex(!urlIndex ? 1 : 0);
    postImporter({ url: urls[urlIndex] });
  }, [props?.dataSource?._id]);

  // action
  function onMoveWaybill(move: -1 | 1 | 99) {
    if (!props?.dataSource?.LS) return;
    if (actionType === '1') {
      const params = getSearchParams(props.dataSource.LS);
      return moveWaybill({
        move,
        check_type: checkType,
        current_processor: userInfo?.name,
        waybill: props?.dataSource?._id,
        ...params,
      });
    } else {
      const selectedKeys = getSelectedParams(actionLS);
      const index = selectedKeys?.findIndex?.(
        (i: any) => i === props?.dataSource?._id,
      );
      if (move === -1) {
        if (index === 0) return null;
        return selectedKeys?.[index - 1];
      } else if (move === 1) {
        if (index === selectedKeys?.length) null;
        return selectedKeys?.[index + 1];
      } else if (move === 99) {
        return removeSelectedParams(props.dataSource.LS);
      }
    }
  }

  async function onSubmit(waybill_status: number, process_status: number) {
    try {
      const values = await form.getFieldsValue(true);
      await updateWaybill({
        ...values,
        waybill_type: 1, // TODO: api改为string后删除
        user: userInfo?._id,
        waybillId: props?.dataSource?._id,
        process_status,
        process_type: checkType === '0' ? 1 : 2,
        waybill_status,
        REF: `${values?.REF ? values.REF + ' ' : ''}${userInfo?.initialName}`,
      });
    } catch (err: any) {
      throw 'Submit Error';
    }
  }

  // 快捷键
  useKeyPress('e', () => {
    if (checkFocus()) {
      const waybill_type = form.getFieldValue('waybill_type');
      waybill_type === 'IDA' && postFocus({ no: '14.' });
      waybill_type === 'MIC' && postFocus({ no: '50.' });
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
  useKeyPress('s', () => {
    if (checkType === '2' && checkFocus()) {
      handleSendBack.run();
    }
  });
  useKeyPress('F2', () => {
    if (checkFocus()) {
      setCommandState({ visible: true, command: '' });
    } else {
      const no = (document.activeElement as HTMLInputElement)?.dataset?.no;
      const waybill_type = form.getFieldValue('waybill_type');
      if (waybill_type === 'IDA' && (no === '13' || no === '14')) {
        postFocus({ modal: 'search' });
      }
      if (waybill_type === 'MIC' && (no === '9' || no === '10')) {
        postFocus({ modal: 'search' });
      }
    }
  });
  useKeyPress(
    'F9',
    () => {
      if (!document.body.className) {
        handleAccept.run();
      }
    },
    { exactMatch: true },
  );
  useKeyPress('F10', () => {
    window.open(
      window.location.origin + window.location.pathname + '#/cts/check/import',
    );
  });
  useKeyPress('ctrl.q', async () => {
    if (checkFocus()) {
      onExit();
    } else {
      postFocus({ blur: true });
      setCursor(false);
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
      if (res) {
        history.replace('/cts/check/' + res + history.location.search);
      } else {
        throw 'すでに最初の件です';
      }
    } catch (error: any) {
      message.warning(error);
    }
  }
  async function onNext() {
    try {
      const res = await onMoveWaybill(1);
      if (res) {
        history.replace('/cts/check/' + res + history.location.search);
      } else {
        throw 'すでに最後の件です';
      }
    } catch (error: any) {
      message.warning(error);
    }
  }
  async function onHold() {
    try {
      if (disabled) return;
      await onSubmit(2, checkType === '0' ? 0 : 2);
      await onNext();
      message.success('Hold Success.');
    } catch (error: any) {
      message.warning(error);
    }
  }
  async function onSendBack() {
    try {
      if (disabled) return;
      await onSubmit(3, checkType === '0' ? 0 : 2);
      await onNext();
      message.success('SendBack Success.');
    } catch (error) {
      message.warning('SendBack Error');
    }
  }
  async function onAccept() {
    try {
      if (disabled) return;
      await form.validateFields();
      await onSubmit(1, checkType === '0' ? 2 : 4);
      await onNext();
      message.success('Accept Success.');
    } catch (error: any) {
      const err = error?.errorFields?.[0]?.errors?.[0] || 'submit error';
      message.warning(err);
    }
  }

  // 执行函数 防抖处理
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
  const handleSendBack = useRequest(onSendBack, {
    debounceWait: 100,
    manual: true,
  });
  const handleAccept = useRequest(onAccept, {
    debounceWait: 100,
    manual: true,
  });

  return (
    <Form
      size="small"
      form={form}
      onValuesChange={(values, allValues) => {
        if (
          'Add1' in values ||
          'Add2' in values ||
          'Add3' in values ||
          'Add4' in values
        ) {
          const { Add1 = '', Add2 = '', Add3 = '', Add4 = '' } = allValues;
          form.setFieldsValue({ IAD: [Add1, Add2, Add3, Add4].join(' ') });
        }
      }}
      initialValues={{
        NOF: 'R',
        PF: '00010544650858',
        ...props?.dataSource,
        // TODO: api改为string后删除
        waybill_type: { L: 'IDA', S: 'IDA', M: 'MIC' }[
          props?.dataSource?.LS || 'M'
        ],
        cardList: [
          {
            CMD: '980000000',
            CM2: '0',
            CMN: props?.dataSource?.CMN,
          },
          {
            CMD: '980000000',
            CM2: '0',
            CMN: '',
          },
        ],
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
      {!disabled && <SearchModal form={form} />}
      <Card
        size="default"
        bodyStyle={{ height: 'calc(100vh - 112px)', overflow: 'auto' }}
        title={
          <Space>
            <Button type={cursor ? 'default' : 'primary'} onClick={onExit}>
              Exit（Ctrl + q）
            </Button>
            <Tag>
              {
                ['Other', 'Normal', 'Hold', 'SendBack'][
                  props?.dataSource?.waybill_status || 1
                ]
              }
            </Tag>
            {process_status > 1 && (
              <Tag>
                {
                  [
                    'wait cleansing',
                    'doing cleansing',
                    'done cleansing',
                    'doing broker check',
                    'done broker check',
                    'done created',
                  ][process_status]
                }
              </Tag>
            )}
            <Form.Item
              noStyle
              shouldUpdate={(a, b) =>
                a?.waybill_type !== b?.waybill_type ||
                a?.IDA_type !== b?.IDA_type
              }
            >
              {({ getFieldValue }) => {
                const waybill_type = getFieldValue('waybill_type');
                const IDA_type = getFieldValue('IDA_type');
                const LS = getFieldValue('LS');
                const IC1 = getFieldValue('IC1');
                const IC2 = getFieldValue('IC2');
                return (
                  <Space>
                    {LS && <span>L・S・M識別: {LS}</span>}
                    {waybill_type && <span>業務コード: {waybill_type}</span>}
                    {IDA_type && <span>申告種別: {IDA_type}</span>}
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
            <FormTypeModal form={form} disabled={disabled} />
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
          <Button disabled={disabled} type="text" onClick={handleHold.run}>
            Hold（H）
          </Button>,
          <Button
            type="text"
            onClick={handleSendBack.run}
            disabled={checkType !== '1'}
          >
            Send Back（B）
          </Button>,
          <Button disabled={disabled} type="text" onClick={handleAccept.run}>
            Accept（F9）
          </Button>,
        ]}
      >
        <Form.Item
          shouldUpdate={(a, b) =>
            a?.waybill_type !== b?.waybill_type || a?.IDA_type !== b?.IDA_type
          }
        >
          {({ getFieldValue }) => (
            <AllCheckForm
              waybill_type={getFieldValue('waybill_type')}
              IDA_type={getFieldValue('IDA_type')}
              disabled={disabled}
            />
          )}
        </Form.Item>
        {disabled && (
          <Alert
            message={`${current_processor} さんがクレンジング中、次の件進めましょう。`}
          />
        )}
      </Card>
    </Form>
  );
};

export default WaybillContainer;
