import { Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importMultiWaybill } from '@/services/request/waybill';

const exampleHref = 'http://onassets.weixin-jp.com/assets/waybills-import.xlsx';

const successFormat = (count: number, sum: number, type: string) => ({
  message: `批量${type}导入完成`,
  description: `已成功导入，并${type}了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[], type: string) => ({
  message: success ? `部分数据${type}失败` : '导入失败',
  description: `${type}失败行数: ${failedNo.join(', ')}`,
});

export interface UploadWaybillProps {
  onUpload?: () => void;
}

function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < line.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        obj[headers?.[j]?.trim?.()] = line?.[j]?.toString?.();
      }
    }
    waybills.push(obj);
  }
  return waybills;
}

const UploadWaybill: React.FC<UploadWaybillProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    const waybills = fixItemToObj(jsonArr) as API.Waybill[];
    const { successCount: count, failedNo } = await importMultiWaybill({
      waybills,
    });
    props?.onUpload?.();
    const success =
      count > 0 ? successFormat(count, jsonArr.length - 1, '新規') : null;
    const failed =
      failedNo?.length > 0 ? failedFormat(!!success, failedNo, '新規') : null;
    return { success, failed };
  }

  return (
    <>
      <Space>
        {/* <a href={exampleHref} download>
          テンプレート
        </a> */}
        <UploadXlsx onUpload={onUpload} text="IDA" />
        <UploadXlsx onUpload={onUpload} text="MIC" />
      </Space>
    </>
  );
};

export default UploadWaybill;
