import { useState } from 'react';
import { Descriptions, Space, Modal, Button, Timeline, Tag } from 'antd';
import { dayFormat } from '@/utils/helper/day';
import { HistoryOutlined } from '@ant-design/icons';

export interface TrackModalProps {
  dataSource: API.Track;
}

const TrackModal: React.FC<TrackModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  function handleOpen() {
    setVisible(true);
  }
  function handleCancel() {
    setVisible(false);
  }

  return (
    <>
      <Modal
        title="追跡情報"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Descriptions column={3} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="HAWB番号">
            {props?.dataSource?.HAB}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Timeline>
          {props?.dataSource?.history?.map((item, key) => {
            return (
              <Timeline.Item key={key}>
                <span>
                  <p>{dayFormat(item?.datetime, 'YYYY年MM月DD日 H:mm')}</p>
                  <p>
                    <Tag color="blue">{item?.code_jp}</Tag>
                    {item?.office} 営業所
                  </p>
                </span>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Modal>
      <Space>
        {props?.dataSource?.HAB}
        <Button type="link" onClick={handleOpen}>
          <HistoryOutlined />
          追跡
        </Button>
      </Space>
    </>
  );
};

export default TrackModal;
