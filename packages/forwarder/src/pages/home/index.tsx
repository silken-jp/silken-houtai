import {
  Row,
  Col,
  Card,
  Space,
  Form,
  Button,
  Descriptions,
  Table,
  Input,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAgentInfo } from '@/services/useStorage';
import { getMonthStat } from '@/services/request/waybill';

export interface dashboardProps {}

const Dashboard: React.FC<dashboardProps> = () => {
  // state
  const today = dayjs()?.format('YYYY年MM月DD日');
  const thisMonth = dayjs()?.format('YYYY年MM月累計');
  const lastMonth = dayjs()?.subtract(1, 'month')?.format('YYYY年MM月実績');

  // store
  const [intlMenu] = useIntlFormat('menu');
  const agentInfo = getAgentInfo();
  const agentId = agentInfo?._id;

  // api
  const mouthStatAPI = useRequest(async () => await getMonthStat({ agentId }));

  return (
    <PageContainer
      title={agentInfo?.name}
      header={{
        breadcrumb: {
          routes: [
            { path: '/cts/dashboard', breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Status Inquiry' },
          ],
        },
      }}
    >
      <Row gutter={8}>
        <Col span={8}>
          <Card loading={mouthStatAPI?.loading}>
            <Descriptions title={today} column={2}>
              <Descriptions.Item label="件数">
                {mouthStatAPI?.data?.waybillTodayCount}
              </Descriptions.Item>
              <Descriptions.Item label="重量">
                {mouthStatAPI?.data?.GWTodayCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="個数">
                {mouthStatAPI?.data?.NOTodayCount}
              </Descriptions.Item>
              <Descriptions.Item label="MAWB">
                {mouthStatAPI?.data?.mawbTodayCount}
              </Descriptions.Item>
              {/* <Descriptions.Item label="未許可件数">0</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={mouthStatAPI?.loading}>
            <Descriptions title={thisMonth} column={2}>
              <Descriptions.Item label="件数">
                {mouthStatAPI?.data?.waybillThisMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label="重量">
                {mouthStatAPI?.data?.GWThisMonthCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="個数">
                {mouthStatAPI?.data?.NOThisMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label="MAWB">
                {mouthStatAPI?.data?.mawbThisMonthCount}
              </Descriptions.Item>
              {/* <Descriptions.Item label="未許可件数">0</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={mouthStatAPI?.loading}>
            <Descriptions title={lastMonth} column={2}>
              <Descriptions.Item label="件数">
                {mouthStatAPI?.data?.waybillLastMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label="重量">
                {mouthStatAPI?.data?.GWLastMonthCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="個数">
                {mouthStatAPI?.data?.NOLastMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label="MAWB">
                {mouthStatAPI?.data?.mawbLastMonthCount}
              </Descriptions.Item>
              {/* <Descriptions.Item label="未許可件数">0</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <br />
      <Table
        title={() => (
          <Space>
            <span>対応未完了問題（直近一週間）</span>
            <Button>更新</Button>
          </Space>
        )}
      >
        <Table.Column title="会社名" />
        <Table.Column title="MAWBNo" />
        <Table.Column title="HAWBNo" />
        <Table.Column title="問題" />
        <Table.Column title="状態" />
        <Table.Column title="連絡日" />
        <Table.Column title="連絡方法" />
        <Table.Column title="通知者" />
        <Table.Column title="登録者" />
      </Table>
      <br />
      <Table
        title={() => (
          <Space>
            <span>MAWB情報（直近3日間）</span>
            <Button>更新</Button>
          </Space>
        )}
      >
        <Table.Column title="会社名" />
        <Table.Column title="MAWBNo" />
        <Table.Column title="FLIGHT NO" />
        <Table.Column title="FLIGHT DATE" />
        <Table.Column title="件数" />
        <Table.Column title="状態" />
      </Table>
      <Table
        title={() => (
          <Form layout="inline">
            <Form.Item label="MAWBNo">
              <Input placeholder="MAWBNo" />
            </Form.Item>
            <Form.Item label="HAWBNo">
              <Input placeholder="HAWBNo" />
            </Form.Item>
            <Space>
              <Button>検索</Button>
              <Button>リセット</Button>
            </Space>
          </Form>
        )}
      >
        <Table.Column title="会社名" />
        <Table.Column title="FLIGHT NO" />
        <Table.Column title="FLIGHT DATE" />
        <Table.Column title="MAWBNo" />
        <Table.Column title="HAWBNo" />
        <Table.Column title="件数" />
        <Table.Column title="状態" />
      </Table>
    </PageContainer>
  );
};

export default Dashboard;
