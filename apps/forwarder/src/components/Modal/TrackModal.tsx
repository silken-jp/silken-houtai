import { useState } from 'react';
import { Descriptions, Modal, Button, Timeline, Tag } from 'antd';
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

  let his: any[] = Array.from(props?.dataSource?.history || []);
  his?.sort(
    (a: any, b: any) =>
      new Date(a?.datatime).getTime() - new Date(b?.datatime).getTime(),
  );

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
          {his?.map((item, key) => {
            return (
              <Timeline.Item key={key}>
                <span>
                  <p>{dayFormat(item?.datetime, 'YYYY年MM月DD日 H:mm')}</p>
                  <p>
                    <Tag color="blue">{item?.code_jp}</Tag>
                    {item?.office && `${item?.office} 営業所`}
                  </p>
                </span>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Modal>
      <Button
        type="primary"
        size="small"
        disabled={!his?.length}
        onClick={handleOpen}
      >
        <HistoryOutlined />
        {his?.[his?.length - 1]?.code_jp}
      </Button>
    </>
  );
};

export default TrackModal;
