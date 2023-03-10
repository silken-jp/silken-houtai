import { Button, Upload, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';

interface UploadXlsxProps {
  onUpload: (jsonArr: any[]) => Promise<{
    success?: { message?: string; description?: string } | null;
    failed?: { message?: string; description?: string } | null;
  }>;
  text?: string;
}

const key = 'uploadXlsx';

const UploadXlsx: React.FC<UploadXlsxProps> = (props) => {
  const text = props?.text || 'upload';
  const handleUpload = async (jsonArr: any[]) => {
    const sum = jsonArr?.length - 1;
    try {
      notification.open({
        key,
        message: `uploading`,
        description: `Please wait for a total of ${sum} data to be imported.`,
        duration: null,
        placement: 'bottomRight',
      });
      const { success, failed } = await props.onUpload(jsonArr);
      notification.open({
        key,
        message: success?.message || failed?.message,
        description: success?.description || failed?.message,
        duration: null,
        placement: 'bottomRight',
      });
      if (success && failed) {
        notification.warning({
          message: failed?.message,
          description: failed?.message,
          duration: null,
          placement: 'bottomRight',
        });
      }
    } catch (error: any) {
      notification.open({
        key,
        message: 'Upload failed',
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
        raw: true,
        blankrows: false,
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
        <UploadOutlined /> {text}
      </Button>
    </Upload>
  );
};

export default UploadXlsx;
