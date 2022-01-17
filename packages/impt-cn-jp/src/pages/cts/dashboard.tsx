import { Row, Col, Card, Tabs, Space, DatePicker, Radio, Statistic, Progress } from 'antd';
import { Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const SumChart: React.FC = () => {
  const data = [
    { name: '2021年08月', sum: 1000, pass: 800, block: 200 },
    { name: '2021年09月', sum: 1234, pass: 1123, block: 111 },
    { name: '2021年10月', sum: 1345, pass: 1234, block: 111 },
    { name: '2021年11月', sum: 1565, pass: 1432, block: 127 },
    { name: '2021年12月', sum: 2353, pass: 2234, block: 119 },
    { name: '2022年01月', sum: 2346, pass: 2322, block: 24 },
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
          <Bar dataKey="pass" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="block" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const SKPieChart: React.FC = () => {
  const data = [
    { name: 'クレンジング済', value: 400 },
    { name: 'クリエート済', value: 300 },
    { name: 'ブローカーチェック済', value: 300 },
    { name: '申告済', value: 200 },
  ];
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
          label={(a) => `${a.name}: ${a.value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label position="center">合計：1200</Label>
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
        <Col span={6}>
          <Card>
            <Statistic title="クレンジング済" value={1000} suffix="/ 1000" />
            <Progress percent={100} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="クリエート済" value={1000} suffix="/ 1000" />
            <Progress percent={100} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="ブローカーチェック済" value={870} suffix="/ 1000" />
            <Progress percent={87} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="申告済" value={870} suffix="/ 1000" />
            <Progress percent={87} />
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
