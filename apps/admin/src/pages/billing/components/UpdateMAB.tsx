import * as Encoding from 'encoding-japanese';
import { Button, Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiMabs } from '@/services/request/mabs';

const rightHeader = ['mab', 'first_bonded'];

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

const waybill_status: any = { other: 0, normal: 1, hold: 2, sendBack: 3 };

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
        let header = headers?.[j]?.trim?.();
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

const UpdateMAB: React.FC<UpdateMABProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    try {
      const mabs = (await fixItemToObj(jsonArr)) as API.MAB[];
      // return { success: null, failed: null }
      const { successCount: count, failedNo } = await importMultiMabs({ mabs });
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
    return onUpload(jsonArr);
  }

  if (props?.disabled) {
    return <Button disabled>更新</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        text="更新MAB料金"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default UpdateMAB;
