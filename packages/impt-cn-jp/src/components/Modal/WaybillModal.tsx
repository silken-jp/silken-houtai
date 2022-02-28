import { useState } from 'react';
import { Descriptions, Card, Space, Modal, Button } from 'antd';
import { Link } from 'umi';

export interface WaybillProps {
  dataSource: API.Waybill;
}

const Waybill: React.FC<WaybillProps> = (props) => {
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
        title="Waybill"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        footer={
          <Space>
            <Link to={`/cts/check/${props?.dataSource?._id}`}>
              <Button type="primary">仮クレンジング</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions column={3} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="HAWB番号">
            {props?.dataSource?.HAB}
          </Descriptions.Item>
          <Descriptions.Item label="MAWB番号">
            {props?.dataSource?.MAB}
          </Descriptions.Item>
          {/* <Descriptions.Item label="派送单号"> </Descriptions.Item> */}
          {/* <Descriptions.Item label="货物名称">肥宅快乐水</Descriptions.Item> */}
          {/* <Descriptions.Item label="重量">12kg</Descriptions.Item> */}
          {/* <Descriptions.Item label="快递员">吴昊</Descriptions.Item> */}
        </Descriptions>
        <br />
        <Card size="small" title="寄件人信息">
          <Descriptions column={1} style={{ marginBottom: -16 }}>
            <Descriptions.Item label="寄件人">
              {props?.dataSource?.EPN}
            </Descriptions.Item>
            <Descriptions.Item label="寄件联系方式"> - </Descriptions.Item>
            <Descriptions.Item label="寄件人地址">
              {props?.dataSource?.EAD}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <br />
        <Card size="small" title="收件人信息">
          <Descriptions column={1} style={{ marginBottom: -16 }}>
            <Descriptions.Item label="收件人">
              {props?.dataSource?.receiver_name}
            </Descriptions.Item>
            <Descriptions.Item label="收件人联系方式">
              {props?.dataSource?.receiver_tel}
            </Descriptions.Item>
            <Descriptions.Item label="收件人地址">
              {props?.dataSource?.receiver_add}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        {/* <br />

          <Card title="货物追踪">
            <Timeline>
              <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item color="red">
                <p>Solve initial network problems 1</p>
                <p>Solve initial network problems 2</p>
                <p>Solve initial network problems 3 2015-09-01</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>Technical testing 1</p>
                <p>Technical testing 2</p>
                <p>Technical testing 3 2015-09-01</p>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <p>Technical testing 1</p>
                <p>Technical testing 2</p>
                <p>Technical testing 3 2015-09-01</p>
              </Timeline.Item>
              <Timeline.Item color="gray">
                <p>Technical testing 1</p>
                <p>Technical testing 2</p>
                <p>Technical testing 3 2015-09-01</p>
              </Timeline.Item>
            </Timeline>
          </Card> */}
      </Modal>
      <Button type="link" onClick={handleOpen}>
        {props?.dataSource?.HAB}
      </Button>
    </>
  );
};

export default Waybill;
