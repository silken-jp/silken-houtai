import { useState } from 'react';
import { Modal, Button, Form, Radio, Select } from 'antd';
import * as Encoding from 'encoding-japanese';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiWaybill } from '@/services/request/waybill';
import { getUserInfo } from '@/services/useStorage';

// const exampleHref = 'http://onassets.weixin-jp.com/assets/waybills-import.xlsx';
const rightHeader = [
  'VSN',
  'DATE',
  'ARR',
  'MAB',
  'HAB',
  'PCS',
  'GW',
  'GWT',
  'CMN',
  'SKB',
  'ImpName',
  'ImpNameJP',
  'IAD',
  'IADJP',
  'Zip',
  'Tel',
  'EPN',
  'EAD',
  'EPY_Zip',
  'EPO',
  'DST',
  'PSC',
  'OR',
  'IP1',
  'IP2',
  'IP3',
  'IP4',
  'FR1',
  'FR2',
  'FR3',
  'IN1',
  'IN2',
  'IN3',
  'receiver_name',
  'receiver_add',
  'receiver_tel',
  'receiver_zip',
];

const successFormat = (count: number, sum: number, type: string) => ({
  message: `批量${type}导入完成`,
  description: `已成功导入，并${type}了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[], type: string) => ({
  message: success ? `部分数据${type}失败` : '导入失败',
  description: `${type}失败行数: ${failedNo.join(', ')}`,
});

export interface UploadWaybillProps {
  // payload?: any;
  agentOptions: any[];
  onUpload?: () => void;
}

function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < headers.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        obj[headers?.[j]?.trim?.()] = line?.[j]
          ?.toString?.()
          ?.split('')
          ?.map((t: string) => {
            const from = Encoding.detect(t) as any;
            return Encoding.convert(t, { from, to: 'ASCII', type: 'string' });
          })
          ?.join('');
      }
    }
    waybills.push(obj);
  }
  return waybills;
}

const UploadWaybill: React.FC<UploadWaybillProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const { _id } = getUserInfo();
  const [visible, setVisible] = useState(false);

  async function onUpload(jsonArr: any[], values: any) {
    console.log(jsonArr);
    const waybills = fixItemToObj(jsonArr) as API.Waybill[];
    console.log(waybills);
    const { successCount: count, failedNo } = await importMultiWaybill({
      waybills,
      ...values,
    });
    // const count = waybills.length;
    // const failedNo: any[] = [];
    props?.onUpload?.();
    const success =
      count > 0 ? successFormat(count, jsonArr.length - 1, '新規') : null;
    const failed =
      failedNo?.length > 0 ? failedFormat(!!success, failedNo, '新規') : null;
    return { success, failed };
  }

  function handleOpen() {
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  function handleUpload(jsonArr: any[]) {
    let { user, ...values } = form.getFieldsValue();
    if (user === '1') {
      values.user = _id;
    }
    handleClose();
    return onUpload(jsonArr, { ...values, uploader: _id });
  }

  return (
    <>
      <Modal
        title="MAWB　アップロード"
        visible={visible}
        onCancel={handleClose}
        footer={
          <UploadXlsx
            onUpload={handleUpload}
            text="アップロード"
            rightHeader={rightHeader}
          />
        }
      >
        <Form
          form={form}
          initialValues={{ user: '1', isIp4X6: '1', isImpNameReverse: '0' }}
        >
          <Form.Item
            label="フォワーダー"
            name="agentId"
            rules={[{ required: true }]}
          >
            <Select options={props?.agentOptions} />
          </Form.Item>
          <Form.Item label="Ip4" name="isIp4X6">
            <Radio.Group>
              <Radio value="1"> x 0.6 </Radio>
              <Radio value="0"> ÷ 0.6</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="ImpName" name="isImpNameReverse">
            <Radio.Group>
              <Radio value="0"> 正転 </Radio>
              <Radio value="1"> 逆転 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="クレンジング" name="user">
            <Radio.Group>
              <Radio value="1"> 自動 </Radio>
              <Radio value="0"> 手動 </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={handleOpen}>
        アップロード
      </Button>
    </>
  );
};

export default UploadWaybill;
