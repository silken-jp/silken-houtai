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
import HoldAction from './components/Action/HoldAction';
import SendBackAction from './components/Action/SendBackAction';

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

interface RenderLabel {
  value: any;
  label: string;
}
const RenderLabel: React.FC<RenderLabel> = (props) => (
  <>
    {props?.value && (
      <span>
        <span style={{ color: '#bfbfbf' }}>{props.label}: </span>
        {props.value}
      </span>
    )}
  </>
);

// Todo: cursor 判断

export interface WaybillContainerProps {}
const WaybillContainer: React.FC<WaybillContainerProps> = () => {
  const { waybillId } = useParams<any>();
  const { data, error, loading, refresh } = useRequest(
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
  return <WaybillCheck dataSource={data} refresh={refresh} />;
};

export interface WaybillCheckProps {
  dataSource?: API.Waybill;
  refresh?: any;
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
  const search = new URLSearchParams(history.location.search);
  const actionType = search.get('actionType'); // 选件方式 0:check 1:search
  const checkType = search.get('checkType'); //  0:cleansing 1:broker check
  const actionLS = search.get('LS');
  const editDisabled =
    process_status === 1 && current_processor !== userInfo?.name;
  const clsDisabled = checkType === '0' && process_status > 2;
  const brkDisabled = checkType === '1' && process_status < 2;
  const disabled = editDisabled || clsDisabled || brkDisabled;

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

  async function onSubmit(waybill_status: number) {
    try {
      const values = await form.getFieldsValue(true);
      const newREF = `${values?.REF ? values.REF + ' ' : ''}${
        userInfo?.initialName
      }`;
      await updateWaybill({
        ...values,
        user: userInfo?._id,
        waybillId: props?.dataSource?._id,
        process_status: checkType === '0' ? 2 : 4,
        process_type: checkType === '0' ? 1 : 2,
        waybill_status,
        REF: newREF?.length > 20 ? values?.REF || '' : newREF,
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
        props?.refresh();
        throw 'すでに最後の件です';
      }
    } catch (error: any) {
      message.warning(error);
    }
  }
  async function onHold() {
    try {
      if (disabled) return;
      await onSubmit(2);
      await onNext();
      message.success('Hold Success.');
    } catch (error: any) {
      message.warning(error);
    }
  }
  async function onSendBack() {
    try {
      if (disabled) return;
      await onSubmit(3);
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
      await onSubmit(1);
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
        hsCodeGroup: [
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
            {checkType === '0' && <Tag color="blue">クレンジング</Tag>}
            {checkType === '1' && <Tag color="volcano">ブローカーチェック</Tag>}
            <Tag>MAB: {props.dataSource?.MAB}</Tag>
            <Tag>
              {
                ['Other', 'Normal', 'Hold', 'SendBack'][
                  props?.dataSource?.waybill_status || 1
                ]
              }
            </Tag>
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
          </Space>
        }
        extra={
          <Space>
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
                    <RenderLabel value={LS} label="L・S・M識別" />
                    <RenderLabel value={waybill_type} label="業務コード" />
                    <RenderLabel value={IDA_type} label="申告種別" />
                    <RenderLabel value={IC1} label="申告先種別コード" />
                    <RenderLabel value={IC2} label="申告貨物識別" />
                  </Space>
                );
              }}
            </Form.Item>
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
          <HoldAction disabled={disabled} handleHold={handleHold} />,
          <SendBackAction
            handleSendBack={handleSendBack}
            disabled={disabled || checkType !== '1'}
          />,
          <Button disabled={disabled} type="text" onClick={handleAccept.run}>
            Accept（F9）
          </Button>,
        ]}
      >
        {props?.dataSource?.waybill_status === 2 &&
          !!props?.dataSource?.holdMemo && (
            <>
              <Alert message={'holdMemo:' + props?.dataSource?.holdMemo} />
              <br />
            </>
          )}
        {props?.dataSource?.waybill_status === 3 &&
          !!props?.dataSource?.sendbackMemo && (
            <>
              <Alert
                message={'sendbackMemo:' + props?.dataSource?.sendbackMemo}
              />
              <br />
            </>
          )}
        {disabled && (
          <>
            {editDisabled && (
              <Alert
                message={`${current_processor} さんがクレンジング中、次の件進めましょう。`}
              />
            )}
            {clsDisabled && (
              <Alert
                type="warning"
                message={`ブローカーチェック済の件は、クレンジングできません。確認してください。`}
              />
            )}
            {brkDisabled && (
              <Alert
                type="warning"
                message={`未クレンジングの件は。ブローカーチェックできません。確認してください。`}
              />
            )}
            <br />
          </>
        )}
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
      </Card>
    </Form>
  );
};

export default WaybillContainer;
