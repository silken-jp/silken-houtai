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

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

export interface UploadWaybillProps {
  payload?: any;
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
  const { _id } = getUserInfo();

  async function onUpload(jsonArr: any[], values: any) {
    console.log(jsonArr);
    const waybills = fixItemToObj(jsonArr) as API.Waybill[];
    console.log(waybills);
    // const { successCount: count, failedNo } = await importMultiWaybill({
    //   waybills,
    //   ...values,
    //   ...props?.payload,
    // });
    const count = waybills.length;
    const failedNo: any[] = [];
    props?.onUpload?.();
    const success = count > 0 ? successFormat(count, jsonArr.length - 1) : null;
    const failed =
      failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
    return { success, failed };
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr, { ...props?.payload, uploader: _id });
  }

  return (
    <UploadXlsx onUpload={handleUpload} text="更新" rightHeader={rightHeader} />
  );
};

export default UploadWaybill;
