import { useState } from 'react';
import { Descriptions, Card, Modal, Button, Timeline } from 'antd';
import { dayFormat } from '@/utils/helper/day';

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
  console.log(props?.dataSource);
  return (
    <>
      <Modal
        title="TrackModal"
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
              <Timeline.Item key={key} color="green">
                <span>
                  {item?.code_jp} {dayFormat(item?.datetime, 'MM/DD H:mm')}{' '}
                  {item?.office}
                </span>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Modal>
      <Button type="link" onClick={handleOpen}>
        {props?.dataSource?.HAB}
      </Button>
    </>
  );
};

export default TrackModal;
