import { useState } from 'react';
import { Modal, Button, Form, Radio, Select, Space, Typography } from 'antd';
import * as Encoding from 'encoding-japanese';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiWaybill2 } from '@/services/request/waybill';
import { getUserInfo } from '@/services/useStorage';

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

async function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < headers.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        const header = headers?.[j]?.trim?.();
        obj[header] = line?.[j]
          ?.toString?.()
          ?.split('')
          ?.map((t: string) => {
            let str = Encoding.toHankakuCase(t);
            if (['−', '－', '‐', '-', 'ｰ', '―'].includes(t)) {
              str = '-';
            }
            const from = Encoding.detect(str) as any;
            return Encoding.convert(str, { from, to: 'ASCII', type: 'string' });
          })
          ?.join('');
        if (
          ![
            'ImpName',
            'ImpNameJP',
            'IAD',
            'IADJP',
            'receiver_name',
            'receiver_add',
          ].includes(header)
        ) {
          if (new RegExp('[^\x00-\xff]').test(obj[header])) {
            throw {
              message: '导入失败',
              description: `${i + 1}行の${header}を確認してください`,
            };
          }
        }
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
    try {
      const waybills = (await fixItemToObj(jsonArr)) as API.Waybill[];
      // return { success: null, failed: null }
      const { successCount: count, failedNo } = await importMultiWaybill2({
        waybills,
        ...values,
      });
      props?.onUpload?.();
      const success =
        count > 0 ? successFormat(count, jsonArr.length - 1, '新規') : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo, '新規') : null;
      return { success, failed };
    } catch (error: any) {
      return {
        success: null,
        failed: error,
      };
    }
  }

  function handleOpen() {
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  function handleUpload(jsonArr: any[]) {
    let values = form.getFieldsValue();
    handleClose();
    return onUpload(jsonArr, { ...values, user: _id, uploader: _id });
  }

  return (
    <>
      <Modal
        title={`アップロード MAWB`}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Space>
            <UploadXlsx
              onUpload={handleUpload}
              text="MIC"
              rightHeader={rightHeader}
            />
            {/* <UploadXlsx
              onUpload={handleUpload}
              text="IDA"
              rightHeader={rightHeader}
            /> */}
          </Space>
        }
      >
        <Form
          form={form}
          initialValues={{
            isIp4X6: '1',
            isImpNameReverse: '0',
            isImpNameEN: '1',
          }}
        >
          <Form.Item
            label="フォワーダー"
            name="agent"
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
          {/* <Form.Item label="名前" name="isImpNameReverse">
            <Radio.Group>
              <Radio value="0"> 正転 </Radio>
              <Radio value="1"> 逆転 </Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item label="名前" name="isImpNameEN">
            <Radio.Group>
              <Radio value="1"> 英訳する </Radio>
              <Radio value="0"> そのまま </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Typography.Paragraph>
              <blockquote>
                こちらはクレンジング済み状態になり、ブローカーチェックを2回目のアップロードが必要で、注意してください。
              </blockquote>
            </Typography.Paragraph>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={handleOpen}>
        クレンジグ新規アップロード
      </Button>
    </>
  );
};

export default UploadWaybill;