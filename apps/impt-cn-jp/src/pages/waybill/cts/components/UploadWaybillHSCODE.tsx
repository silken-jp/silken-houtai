import { Button, Space, message } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiWaybillHSCODE } from '@/services/request/waybill-hscode';

const rightHeader = ['MAB', 'HAB', 'CMN', 'NO', 'price', 'CMD', 'SKU'];

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
        const value = line?.[j]?.toString?.();
        if (value && header) {
          obj[header] = value;
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
  async function onUpload(jsonArr: any[]) {
    try {
      const waybillHscodesArray = (await fixItemToObj(jsonArr)) as any[];
      // return { success: null, failed: null }
      const { successCount: count, failedNo } = await importMultiWaybillHSCODE({
        waybillHscodesArray,
      });
      props?.onUpload?.();
      const success =
        count > 0 ? successFormat(count, waybillHscodesArray.length) : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
      return { success, failed };
    } catch (error: any) {
      message.destroy();
      message.error(error?.message);
      return {
        success: null,
        failed: error?.message,
      };
    }
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr);
  }

  if (props?.disabled) {
    return <Button disabled>更新</Button>;
  }

  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        text="新規＆更新HSCODE"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default UploadWaybill;
