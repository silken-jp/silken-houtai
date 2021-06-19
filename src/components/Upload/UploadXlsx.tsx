import React from 'react';
import { Button, Upload, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';

interface UploadXlsxProps {
  onUpload: (
    jsonArr: any[],
  ) => Promise<{ successCount: number; failedNo: any[] }>;
}

const key = 'uploadXlsx';

const UploadXlsx: React.FC<UploadXlsxProps> = (props) => {
  const handleUpload = async (jsonArr: any[]) => {
    const sum = jsonArr?.length - 1;
    try {
      notification.open({
        key,
        message: `正在导入`,
        description: `本次导入共计 ${sum} 条数据，请稍作等待`,
        duration: null,
        placement: 'bottomRight',
      });
      const { successCount, failedNo } = await props.onUpload(jsonArr);
      notification.open({
        key,
        message: '导入完成',
        description: `已成功导入，并生成了 ${successCount}/${sum} 条数据${
          failedNo?.length > 0 ? '失败行数：' + failedNo.join(', ') : ''
        }`,
        placement: 'bottomRight',
      });
    } catch (error) {
      notification.open({
        key,
        message: '导入失败',
        description: JSON.stringify(error?.message),
        duration: null,
        placement: 'bottomRight',
      });
    }
  };
  const customRequest = (options: any) => {
    var rABS = true;
    const f = options?.file;
    var reader = new FileReader();
    reader.onload = function (e: any) {
      var data = e.target.result;
      if (!rABS) data = new Uint8Array(data);
      var workbook = XLSX.read(data, {
        type: rABS ? 'binary' : 'array',
      });
      // 假设我们的数据在第一个标签
      var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // XLSX自带了一个工具把导入的数据转成json
      var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {
        header: 1,
        raw: false,
      });
      handleUpload(jsonArr);
    };
    if (rABS) reader.readAsBinaryString(f);
    else reader.readAsArrayBuffer(f);
  };

  return (
    <Upload
      name="file"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      headers={{ authorization: 'authorization-text' }}
      showUploadList={false}
      customRequest={customRequest}
    >
      <Button type="dashed">
        <UploadOutlined /> 导入
      </Button>
    </Upload>
  );
};

export default UploadXlsx;
