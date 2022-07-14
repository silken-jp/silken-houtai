import { Upload, message, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
////
import { getUserInfo } from '@/services/useStorage';
import { uploadEDIs } from '@/services/request/edi-put';
import { useState } from 'react';

export interface UploadDeliveryFileProps {
  refresh: () => void;
  agent: string;
}

const UploadDeliveryFile: React.FC<UploadDeliveryFileProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const userInfo = getUserInfo();
  const uploadProps = {
    accept: 'text/plain',
    maxCount: 1,
    showUploadList: false,
    loading,
    customRequest: async (opt: any) => {
      const { file, onSuccess, onError } = opt;
      try {
        setLoading(true);
        const temp = file.name.split('.');
        const MAB = temp[0];
        temp[0] = 'r04' + new Date().getFullYear() + temp?.[0]?.slice(-4);
        const newFile = new File([file], temp.join('.'), {
          type: 'text/plain',
        });
        await uploadEDIs({
          MAB,
          agent: props?.agent,
          userId: userInfo._id,
          file: newFile,
        });
        await onSuccess(newFile, newFile);
        setLoading(false);
      } catch (e) {
        await onError(e, file);
        setLoading(false);
      }
    },
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        props?.refresh?.();
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Space>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Space>
  );
};

export default UploadDeliveryFile;
