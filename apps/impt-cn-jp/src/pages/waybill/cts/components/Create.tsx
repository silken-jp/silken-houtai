import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  message,
  Descriptions,
  Divider,
} from 'antd';
////
import { getUserInfo } from '@/services/useStorage';
import { creating } from '@/services/request/waybill';

export function findValuesByKey(LS: string, data?: any) {
  return {
    ...(LS === 'M' && { JYO: 'Z', CHB: data?.CHB }),
    ...(LS === 'L' && { CHB: '55' }),
    ...(LS === 'S' && { CHB: '77' }),
    ...(LS !== 'M' && { CHH: data?.[0]?.CHH || '', CHT: data?.CHT || '' }),
    CH: '1A',
    ICD: data?.ICD,
    ST: data?.ST || '',
    TTC: data?.TTC || '',
    MAB: data?.MAB || '',
    VSN: data?.VSN || '',
    ARR: data?.ARR,
  };
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const LS_OPT = [
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'S', label: 'S' },
];
const JYO_OPT = [
  { value: 'K', label: 'K:開庁時申告' },
  { value: 'H', label: 'H:予備申告後の本申告' },
  {
    value: 'Z',
    label: 'Z:予備申告（貨物搬入時本申告自動起動）',
  },
  {
    value: 'U',
    label: 'U:予備申告（本邦到着時貨物引取本申告自動起動）',
  },
  {
    value: 'S',
    label: 'S:予備申告（航空貨物の集積場所で本申告自動起動）',
  },
];
const ST_OPT = [
  {
    value: '1AW95',
    label: '1AW95: 【華南（株）足立保税蔵置場】東京都足立区南花畑4-28-18',
  },
  {
    value: '1CW70',
    label:
      '1CW70: 【ケイヒン（株）ワールド流通センター】東京都江東区青海３-2-17',
  },
];

export interface CreateProps {
  refreshAsync?: any;
  dataSource?: any;
  disabled?: boolean;
  LS?: string;
}

const Create: React.FC<CreateProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [LS, setLS] = useState('M');
  const [form] = Form.useForm();
  const userInfo = getUserInfo();

  useEffect(() => {
    if (visible) {
      if (props.LS) {
        setLS(props?.LS);
        form.setFieldsValue(findValuesByKey(props.LS, props?.dataSource?.[0]));
      } else {
        form.setFieldsValue(findValuesByKey(LS, props?.dataSource));
      }
    }
  }, [visible, props?.LS]);

  function handleOpen() {
    setVisible(true);
  }
  function handleCancel() {
    form.resetFields();
    setVisible(false);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const values = await form.validateFields();
      let filter = props?.LS
        ? {
            hawbs: props?.dataSource?.map((item: any) => item?.HAB),
            waybill_status: 1,
            process_status: 4,
          }
        : {
            mawbs: props?.dataSource?.mab,
            waybill_status: 1,
            process_status: 4,
            LS,
          };
      const res = await creating({
        filter,
        creatorId: userInfo?._id,
        ...values,
      });
      await props?.refreshAsync?.();
      message.info(res);
      setLoading(false);
      handleCancel();
    } catch (error: any) {
      message.error(error?.message || 'create error');
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="クリエート"
        visible={visible}
        width={800}
        forceRender
        okButtonProps={{ loading }}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        {!props?.LS && (
          <Descriptions title="MAWB 詳細">
            <Descriptions.Item label="MAWB番号">
              {props?.dataSource?.mab}
            </Descriptions.Item>
            <Descriptions.Item label="LS">
              <Select
                size="small"
                value={LS}
                onChange={(e) => setLS(e)}
                options={LS_OPT}
              />
            </Descriptions.Item>
            <Descriptions.Item label="総件数">
              {props?.dataSource?.[`${LS?.toLocaleLowerCase()}Count`]}
            </Descriptions.Item>
          </Descriptions>
        )}

        {props?.LS && (
          <Descriptions title="HAWB 詳細">
            <Descriptions.Item label="HAWB" span={3}>
              {props?.dataSource?.map((item: any) => item?.HAB)?.join(' ')}
            </Descriptions.Item>
            <Descriptions.Item label="LS">{props?.LS}</Descriptions.Item>
            <Descriptions.Item label="件数">
              {props?.dataSource?.length}
            </Descriptions.Item>
          </Descriptions>
        )}

        <Divider>共有情報確認</Divider>

        <Form form={form} {...formItemLayout}>
          {LS === 'M' ? (
            <>
              <Form.Item label="3.JYO" name="JYO">
                <Select placeholder="申告条件" allowClear options={JYO_OPT} />
              </Form.Item>
              <Form.Item label="6.CH" name="CH" rules={[{ required: true }]}>
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="7.CHB" name="CHB" rules={[{ required: true }]}>
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="8.ICD" name="ICD" rules={[{ required: true }]}>
                <Input placeholder="申告予定年月日" />
              </Form.Item>
              <Form.Item label="21.ST" name="ST" rules={[{ required: true }]}>
                <Select placeholder="通関予定蔵置場コード" options={ST_OPT} />
              </Form.Item>
              <Form.Item label="22.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="36.VSN" name="VSN">
                <Input placeholder="積載機名" />
              </Form.Item>
              <Form.Item label="37.ARR" name="ARR">
                <Input placeholder="入港年月日" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="8.CH" name="CH" rules={[{ required: true }]}>
                <Input placeholder="あて先官署コード" />
              </Form.Item>
              <Form.Item label="9.CHB" name="CHB" rules={[{ required: true }]}>
                <Input placeholder="あて先部門コード" />
              </Form.Item>
              <Form.Item label="10.CHH" name="CHH">
                <Input placeholder="特例申告あて先官署コード" />
              </Form.Item>
              <Form.Item label="11.CHT" name="CHT">
                <Input placeholder="特例申告あて先部門コード" />
              </Form.Item>
              <Form.Item label="12.ICD" name="ICD" rules={[{ required: true }]}>
                <Input placeholder="申告予定年月日" />
              </Form.Item>
              <Form.Item label="24.ST" name="ST" rules={[{ required: true }]}>
                <Select placeholder="通関予定蔵置場コード" options={ST_OPT} />
              </Form.Item>
              <Form.Item label="37.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="45.VSN" name="VSN">
                <Input placeholder="積載機名" />
              </Form.Item>
              <Form.Item label="46.ARR" name="ARR">
                <Input placeholder="入港年月日" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Button type="primary" disabled={props?.disabled} onClick={handleOpen}>
        クリエート
      </Button>
    </>
  );
};

export default Create;
