import {
  Row,
  Col,
  Card,
  Tabs,
  Space,
  DatePicker,
  Radio,
  Statistic,
  Progress,
  Descriptions,
} from 'antd';
import { Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const SumChart: React.FC = () => {
  const data = [
    { name: '2021年08月', sum: 1000, s0: 8, s1: 800, s2: 6, s3: 1 },
    { name: '2021年09月', sum: 1234, s0: 6, s1: 800, s2: 28, s3: 1 },
    { name: '2021年10月', sum: 1345, s0: 5, s1: 1200, s2: 52, s3: 2 },
    { name: '2021年11月', sum: 1565, s0: 3, s1: 1200, s2: 70, s3: 3 },
    { name: '2021年12月', sum: 2353, s0: 7, s1: 1800, s2: 30, s3: 4 },
    { name: '2022年01月', sum: 2346, s0: 2, s1: 2000, s2: 300, s3: 3 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="sum" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="s0" barSize={10} fill="#FF8042" />
          <Bar dataKey="s1" barSize={10} fill="#00C49F" />
          <Bar dataKey="s2" barSize={10} fill="#0088FE" />
          <Bar dataKey="s3" barSize={10} fill="#FFBB28" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

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
          label={(a) => `${a.name}: ${a.value} (${(a.value / sum).toFixed(1)})%`}
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
  return (
    <PageContainer>
      <Row gutter={8}>
        <Col span={8}>
          <Card>
            <Descriptions size="small" layout="vertical" bordered title="2022年02月04日">
              <Descriptions.Item label="件数">0</Descriptions.Item>
              <Descriptions.Item label="重量">0</Descriptions.Item>
              <Descriptions.Item label="個数">0</Descriptions.Item>
              <Descriptions.Item label="MAWB">0</Descriptions.Item>
              <Descriptions.Item label="未許可件数">0</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Descriptions size="small" layout="vertical" bordered title="2022年02月累計">
              <Descriptions.Item label="件数">0</Descriptions.Item>
              <Descriptions.Item label="重量">0</Descriptions.Item>
              <Descriptions.Item label="個数">0</Descriptions.Item>
              <Descriptions.Item label="MAWB">0</Descriptions.Item>
              <Descriptions.Item label="未許可件数">0</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Descriptions size="small" layout="vertical" bordered title="2022年01月実績">
              <Descriptions.Item label="件数">43735</Descriptions.Item>
              <Descriptions.Item label="重量">8823.1</Descriptions.Item>
              <Descriptions.Item label="個数">43735</Descriptions.Item>
              <Descriptions.Item label="MAWB">46</Descriptions.Item>
              <Descriptions.Item label="未許可件数">27</Descriptions.Item>
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
                <SumChart />
              </Tabs.TabPane>
              <Tabs.TabPane tab="IDA" key="IDA">
                <SumChart />
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
