import { Space } from 'antd';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { createMultiWaybill, updateMultiWaybill } from '@/services/request/waybill';

const exampleHref = 'http://onassets.weixin-jp.com/assets/waybills-import.xlsx';

const successFormat = (count: number, sum: number, type: string) => ({
  message: `批量${type}导入完成`,
  description: `已成功导入，并${type}了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[], type: string) => ({
  message: success ? `部分数据${type}失败` : '导入失败',
  description: `${type}失败行数：${failedNo.join(', ')}`,
});

export interface UploadWaybillProps {
  onUploadCreate: () => void;
  onUploadUpdate: () => void;
}

const UploadWaybill: React.FC<UploadWaybillProps> = (props) => {
  async function onUploadCreate(jsonArr: any) {
    const { successCount: count, failedNo } = await createMultiWaybill(jsonArr);
    props?.onUploadCreate();
    const success = count > 0 ? successFormat(count, jsonArr.length - 1, '新規') : null;
    const failed = failedNo?.length > 0 ? failedFormat(!!success, failedNo, '新規') : null;
    return { success, failed };
  }

  async function onUploadUpdate(jsonArr: any) {
    const { successCount: count, failedNo } = await updateMultiWaybill(jsonArr);
    props?.onUploadUpdate();
    const success = count > 0 ? successFormat(count, jsonArr.length - 1, '更新') : null;
    const failed = failedNo?.length > 0 ? failedFormat(!!success, failedNo, '更新') : null;
    return { success, failed };
  }

  return (
    <>
      <Space>
        <a href={exampleHref} download>
          テンプレート
        </a>
        <UploadXlsx onUpload={onUploadCreate} text="一括新規" />
        <UploadXlsx onUpload={onUploadUpdate} text="一括更新" />
      </Space>
    </>
  );
};

export default UploadWaybill;
