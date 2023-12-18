import { Space, message } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiWaybillIP1 } from '@/services/request/waybill';

const rightHeader = ['HAB', 'MAB', 'IP1'];

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
        if (value) {
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
      const updateIP1Array = (await fixItemToObj(jsonArr)) as any[];
      if (updateIP1Array.some((w) => !w.IP1)) {
        throw {
          message: 'IP1 が必須項目です、空欄の確認をしてください。',
        };
      }
      // return { success: null, failed: null }
      const { successCount: count, failedNo } = await importMultiWaybillIP1({
        updateIP1Array,
      });
      props?.onUpload?.();
      const success =
        count > 0 ? successFormat(count, jsonArr.length - 1) : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
      return { success, failed };
    } catch (error: any) {
      message.destroy();
      message.error(error?.message);
      return {
        success: null,
        failed: error,
      };
    }
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr);
  }

  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        text="更新IP1(个人使用)"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default UploadWaybill;
