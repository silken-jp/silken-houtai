import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, message } from 'antd';
////
import { getSearchParams, getUserInfo } from '@/services/useStorage';
import { creating } from '@/services/request/waybill';

export function findValuesByKey(LS: 'L' | 'S' | 'M', data?: any[]) {
  return {
    ...(LS === 'M' && { JYO: 'Z', CHB: data?.[0]?.CHB }),
    ...(LS === 'L' && { CHB: '55' }),
    ...(LS === 'S' && { CHB: '77' }),
    ...(LS !== 'M' && { CHH: data?.[0]?.CHH || '', CHT: data?.[0]?.CHT || '' }),
    CH: '1A',
    ICD: data?.[0]?.ICD,
    ST: data?.[0]?.ST || '',
    TTC: data?.[0]?.TTC || '',
    MAB: data?.[0]?.MAB || '',
    VSN: data?.[0]?.VSN || '',
    ARR: data?.[0]?.ARR,
  };
}

export interface CreateProps {
  text?: string;
  disabled?: boolean;
  refreshAsync: any;
  LS: 'L' | 'S' | 'M';
  useSource?: boolean;
  dataSource?: any[];
}

const ST = [
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

const Create: React.FC<CreateProps> = (props) => {
  // state
  const { LS, dataSource, disabled, useSource } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userInfo = getUserInfo();

  useEffect(() => {
    if (visible) {
      const defaultValues = findValuesByKey(props.LS, props?.dataSource);
      form.setFieldsValue(defaultValues);
    }
  }, [visible]);

  function handleOpen() {
    setVisible(true);
  }
  function handleCancel() {
    setVisible(false);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const values = await form.validateFields();
      let { page, perPage, sortField, sortOrder, ...filter } = getSearchParams(
        props?.LS,
      );
      if (useSource) {
        filter = {
          hawbs: props?.dataSource?.map((d) => d?.HAB)?.join(' '),
        };
      }
      filter.waybill_status = 1;
      await creating({
        filter,
        creatorId: userInfo?._id,
        ...values,
      });
      await props?.refreshAsync?.();
      message.info('create success');
      setLoading(false);
      handleCancel();
    } catch (error) {
      message.error('create error');
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        title={props?.text || useSource ? 'シングルクリエート' : 'クリエート'}
        visible={visible}
        width={800}
        forceRender
        okButtonProps={{
          loading,
        }}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form form={form}>
          {LS === 'M' ? (
            <>
              <Form.Item label="3.JYO" name="JYO">
                <Select
                  placeholder="申告条件"
                  allowClear
                  options={[
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
                  ]}
                />
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
                <Select placeholder="通関予定蔵置場コード" options={ST} />
              </Form.Item>
              <Form.Item label="22.TTC" name="TTC">
                <Input placeholder="検査立会者" />
              </Form.Item>
              <Form.Item label="33.MAB" name="MAB">
                <Input placeholder="MAWB番号" />
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
                <Select placeholder="通関予定蔵置場コード" options={ST} />
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
      {useSource ? (
        <Button
          size="small"
          type="dashed"
          disabled={disabled || !dataSource?.length}
          onClick={handleOpen}
        >
          {props?.text || 'シングルクリエート'}
        </Button>
      ) : (
        <Button type="primary" disabled={disabled} onClick={handleOpen}>
          {props?.text || 'マスクリエート'}
        </Button>
      )}
    </>
  );
};

export default Create;
