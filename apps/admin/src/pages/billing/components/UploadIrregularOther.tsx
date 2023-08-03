import * as Encoding from 'encoding-japanese';
import { Button, Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importOtherIrregulars } from '@/services/request/irregular';
import { useState } from 'react';

const rightHeader: any = [
  'HAWB',
  '日付',
  '非課税項目名',
  '非課税費用',
  '非課税備考',
  '課税項目名',
  '課税費用',
  '課税備考',
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
      // return { success: null, failed: null };
      const { successCount: count, failedNo } = await importOtherIrregulars({
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
    return <Button disabled>その他</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        loading={loading}
        onUpload={handleUpload}
        // fixEncoding={(data) => Encoding.convert(data, 'UNICODE', 'SJIS')}
        rightHeader={rightHeader}
        text="その他"
      />
    </Space>
  );
};

export default UpdateMAB;
