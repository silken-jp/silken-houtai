import { Upload, message, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
////
import { getUserInfo } from '@/services/useStorage';
import { importMultiTracks } from '@/services/request/track';

export interface UploadDeliveryFileProps {}

const { ApiURL } = process.env;

const UploadDeliveryFile: React.FC<UploadDeliveryFileProps> = () => {
  const userInfo = getUserInfo();
  const importAPI = useRequest(importMultiTracks, {
    manual: true,
  });
  const props = {
    accept: 'text/plain',
    action: ApiURL + '/edi-puts/put_delivery',
    headers: {
      authorization: 'authorization-text',
    },
    data: {
      userId: userInfo._id,
    },
    maxCount: 1,
    showUploadList: false,
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Space>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      <Button
        type="primary"
        loading={importAPI.loading}
        onClick={importAPI.run}
      >
        更新
      </Button>
    </Space>
  );
};

export default UploadDeliveryFile;
