import {
  Row,
  Col,
  Card,
  Tabs,
  Space,
  DatePicker,
  Radio,
  Descriptions,
  Select,
  Table,
} from 'antd';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import dayjs from 'dayjs';
////
import SumChart from './components/SumChart';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getMonthStat } from '@/services/request/waybill';

const SKPieChart: React.FC = () => {
  const data = [
    { name: '申告STATUS 1', value: 400 },
    { name: '申告STATUS 2', value: 300 },
    { name: '申告STATUS 3', value: 260 },
    { name: '未申告', value: 40 },
  ];
  const sum = data.reduce((a, b) => a + b.value, 0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <ResponsiveContainer width="100%" height={400} minHeight={400}>
      <PieChart>
        <Pie
          data={data}
          cx={'50%'}
          cy={200}
          innerRadius={120}
          outerRadius={150}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          label={(a) =>
            `${a.name}: ${a.value} (${(a.value / sum).toFixed(1)})%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label position="center">合計：{sum} (100%)</Label>
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export interface dashboardProps {}

const Dashboard: React.FC<dashboardProps> = () => {
  // state
  const [agentId, setAgentId] = useState();
  const today = dayjs()?.format('YYYY年MM月DD日');
  const thisMonth = dayjs()?.format('YYYY年MM月累計');
  const lastMonth = dayjs()?.subtract(1, 'month')?.format('YYYY年MM月実績');

  // store
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();

  // api
  const getMonthStatAsync = async (agentId?: string) => {
    return await getMonthStat({ agentId });
  };
  const mouthStatAPI = useRequest(getMonthStatAsync);

  // action
  const handleChangeAgent = (v: any) => {
    setAgentId(v);
    mouthStatAPI?.run(v);
  };

  return (
    <PageContainer
      title={
        <Select
          value={agentId}
          onChange={handleChangeAgent}
          allowClear
          placeholder="フォワーダー"
          style={{ width: 200 }}
          options={agentOptions}
        />
      }
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
          <Card size="small" loading={mouthStatAPI?.loading}>
            <Descriptions size="small" title={today} column={2}>
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
          <Card size="small" loading={mouthStatAPI?.loading}>
            <Descriptions size="small" title={thisMonth} column={2}>
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
          <Card size="small" loading={mouthStatAPI?.loading}>
            <Descriptions size="small" title={lastMonth} column={2}>
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
      <Row>
        <Col span={24}>
          <Card size="small">
            <Tabs
              tabBarExtraContent={
                <Space>
                  <Radio.Group defaultValue="a" buttonStyle="solid">
                    <Radio.Button value="a">本日</Radio.Button>
                    <Radio.Button value="b">今週</Radio.Button>
                    <Radio.Button value="c">今月</Radio.Button>
                    <Radio.Button value="d">今年</Radio.Button>
                  </Radio.Group>
                  <DatePicker.RangePicker />
                </Space>
              }
            >
              <Tabs.TabPane tab="MIC" key="MIC">
                <SumChart dataSource={[]} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="IDA" key="IDA">
                <SumChart dataSource={[]} />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={24}>
        <Col span={12}>
          <Card title="申告リスト">
            <Table style={{ minHeight: 400 }}>
              <Table.Column title="HAWB" dataIndex="HAB" />
              <Table.Column title="MAWB" dataIndex="MAB" />
              <Table.Column title="申告STATUS" dataIndex="" />
              <Table.Column title="申告番号" dataIndex="" />
              <Table.Column title="クレンザー" dataIndex="" />
              <Table.Column title="クリエーター" dataIndex="" />
            </Table>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="統計"
            extra={
              <Radio.Group size="small" defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">本日</Radio.Button>
                <Radio.Button value="b">今週</Radio.Button>
                <Radio.Button value="c">今月</Radio.Button>
                <Radio.Button value="d">今年</Radio.Button>
              </Radio.Group>
            }
          >
            <SKPieChart />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
