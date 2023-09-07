import { Button, Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';

const rightHeader = [
  '重量（MIN）',
  '重量（MAX）',
  '南九州',
  '北九州',
  '四国',
  '中国',
  '関西',
  '北陸',
  '東海',
  '信越',
  '関東',
  '南東北',
  '北東北',
  '北海道',
];

const rightHeader2 = [
  '重量（MIN）',
  '重量（MAX）',
  '北海道',
  '北東北',
  '南東北',
  '関東',
  '信越',
  '北陸',
  '中部',
  '関西',
  '中国',
  '四国',
  '九州',
  '沖縄',
];

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

export interface UploadDeliveryProps {
  is_sagawa?: boolean;
  payload?: any;
  disabled?: boolean;
  onUpload?: () => void;
  importAction?: any;
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
        obj[header] = line?.[j];
      }
    }
    if (Object.keys(obj)?.length > 0) {
      waybills.push(obj);
    }
  }
  return waybills;
}

const UploadDelivery: React.FC<UploadDeliveryProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    try {
      const deliveryPriceArray = (await fixItemToObj(jsonArr)) as API.MAB[];
      // return { success: null, failed: null };
      const { successCount: count, failedNo } = await props?.importAction?.({
        ...props.payload,
        deliveryPriceArray,
      });
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
    jsonArr.shift();
    return onUpload(jsonArr);
  }

  if (props?.disabled) {
    return <Button disabled>アップロード</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        text="アップロード"
        rightHeader={props?.is_sagawa ? rightHeader2 : rightHeader}
      />
    </Space>
  );
};

export default UploadDelivery;
