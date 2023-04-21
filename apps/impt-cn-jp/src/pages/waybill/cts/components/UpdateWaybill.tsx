import * as Encoding from 'encoding-japanese';
import { Button, Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiBrokerWaybill2 } from '@/services/request/waybill';
import { getUserInfo } from '@/services/useStorage';

const rightHeader = [
  'holdMemo',
  'waybill_status',
  'LS',
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
  'IAD',
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
];

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

const waybill_status: any = { other: 0, normal: 1, hold: 2, sendBack: 3 };

export interface UploadWaybillProps {
  payload?: any;
  disabled?: boolean;
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
        let header = headers?.[j]?.trim?.();
        if (header === 'waybill_status') {
          obj['waybill_status'] = waybill_status[line?.[j] || 'hold'];
        } else {
          if (header === 'VSN') {
            header = 'flight_no';
          }
          const value = line?.[j]
            ?.toString?.()
            ?.split('')
            ?.map((t: string) => {
              let str = Encoding.toHankakuCase(t);
              if (['−', '－', '‐', '-', 'ｰ', '―'].includes(t)) {
                str = '-';
              }
              const from = Encoding.detect(str) as any;
              return Encoding.convert(str, {
                from,
                to: 'ASCII',
                type: 'string',
              });
            })
            ?.join('');
          if (!['holdMemo', 'ImpName', 'IAD'].includes(header)) {
            if (new RegExp('[^\x00-\xff]').test(obj[header])) {
              throw {
                message: '导入失败',
                description: `${i + 1}行の${header}を確認してください`,
              };
            }
          }
          if (value) {
            obj[header] = value;
          }
        }
      }
    }
    if (Object.keys(obj)?.length > 0) {
      waybills.push(obj);
    }
  }
  return waybills;
}

const UploadWaybill: React.FC<UploadWaybillProps> = (props) => {
  // state
  const { _id } = getUserInfo();

  async function onUpload(jsonArr: any[], values: any) {
    try {
      const waybills = (await fixItemToObj(jsonArr)) as API.Waybill[];
      // return { success: null, failed: null }
      const { successCount: count, failedNo } = await importMultiBrokerWaybill2(
        {
          waybills,
          ...values,
        },
      );
      props?.onUpload?.();
      const success =
        count > 0 ? successFormat(count, jsonArr.length - 1) : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
      return { success, failed };
    } catch (error: any) {
      return {
        success: null,
        failed: error,
      };
    }
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr, { ...props?.payload, uploader: _id });
  }

  if (props?.disabled) {
    return <Button disabled>更新</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        text="更新"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default UploadWaybill;
