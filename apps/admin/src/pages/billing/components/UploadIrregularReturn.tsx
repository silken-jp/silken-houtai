import * as Encoding from 'encoding-japanese';
import { Button, Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importReturnIrregulars } from '@/services/request/irregular';
import { useState } from 'react';

const rightHeader: any = [
  'HAWB',
  '日付',
  '返送番号',
  '転送番号',
  '返送送料（課税）',
  '再発送送料（課税）',
  '住所変更/再発送手数料（課税）',
  '再梱包手数料（課税）',
  '換面単費ラベル交換（課税）',
  '合計（課税）',
];

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

export interface UpdateMABProps {
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
        const header = headers?.[j]?.trim?.();
        const value = line?.[j]?.toString?.()?.trim?.();
        if (header) {
          obj[header] = value;
        }
      }
    }
    console.log(obj, Object.keys(obj));
    if (Object.keys(obj)?.length > 0) {
      waybills.push(obj);
    }
  }
  console.log(waybills);
  return waybills;
}

const UpdateMAB: React.FC<UpdateMABProps> = (props) => {
  const [loading, setLoading] = useState(false);
  async function onUpload(jsonArr: any[]) {
    try {
      setLoading(true);
      jsonArr.shift();
      const irregularArray = await fixItemToObj(jsonArr);
      console.log(irregularArray);
      // return { success: null, failed: null };
      const { successCount: count, failedNo } = await importReturnIrregulars({
        irregularArray,
      });
      const success =
        count > 0 ? successFormat(count, jsonArr.length - 1) : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
      setLoading(false);
      return { success, failed };
    } catch (error: any) {
      setLoading(false);
      return {
        success: null,
        failed: error,
      };
    }
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr);
  }

  if (props?.disabled) {
    return <Button disabled>倉庫</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        loading={loading}
        onUpload={handleUpload}
        // fixEncoding={(data) => Encoding.convert(data, 'UNICODE', 'SJIS')}
        rightHeader={rightHeader}
        text="倉庫"
      />
    </Space>
  );
};

export default UpdateMAB;
