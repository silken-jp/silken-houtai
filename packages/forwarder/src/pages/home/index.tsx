import {
  Row,
  Col,
  Card,
  Space,
  DatePicker,
  Radio,
  Button,
  Descriptions,
  Select,
  Table,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import dayjs from 'dayjs';
////
import SumChart from './components/SumChart';
import PieChart from './components/PieChart';
import { useIntlFormat } from '@/services/useIntl';
import { getAgentInfo } from '@/services/useStorage';
import { getMonthStat, getDateStat } from '@/services/request/waybill';

export interface dashboardProps {}

const Dashboard: React.FC<dashboardProps> = () => {
  // state
  const [sumChartState, setSumChartState] = useState({
    startDate: dayjs()?.startOf('month') as any,
    endDate: dayjs() as any,
    displayType: '1',
    waybillType: 'MIC',
  });
  const today = dayjs()?.format('YYYY年MM月DD日');
  const thisMonth = dayjs()?.format('YYYY年MM月累計');
  const lastMonth = dayjs()?.subtract(1, 'month')?.format('YYYY年MM月実績');

  // store
  const [intlMenu] = useIntlFormat('menu');
  const agentInfo = getAgentInfo();
  const agentId = agentInfo?._id;

  // api
  const mouthStatAPI = useRequest(async () => await getMonthStat({ agentId }));
  const dateStatAPI = useRequest(
    async () =>
      await getDateStat({
        agentId,
        displayType: sumChartState?.displayType,
        startDate: sumChartState?.startDate?.format(),
        endDate: sumChartState?.endDate?.format(),
      }),
  );

  // action
  const handleChangeWaybillType = (waybillType: any) => {
    setSumChartState({ ...sumChartState, waybillType });
  };
  const handleChangeDisplayType = (e: any) => {
    setSumChartState({ ...sumChartState, displayType: e?.target?.value });
  };
  const handleChangeDateRange = ([startDate, endDate]: any) => {
    setSumChartState({ ...sumChartState, startDate, endDate });
  };
  const handleDateStat = () => {
    dateStatAPI?.run();
  };

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
          <Card
            title={
              <Select
                value={sumChartState.waybillType}
                onChange={handleChangeWaybillType}
                options={[
                  { value: 'MIC', label: 'MIC' },
                  { value: 'IDA', label: 'IDA' },
                ]}
              />
            }
            extra={
              <Space>
                <Radio.Group
                  value={sumChartState.displayType}
                  onChange={handleChangeDisplayType}
                >
                  <Radio.Button value="1">日</Radio.Button>
                  <Radio.Button value="2">月</Radio.Button>
                  <Radio.Button value="3">年</Radio.Button>
                </Radio.Group>
                <DatePicker.RangePicker
                  value={[sumChartState.startDate, sumChartState.endDate]}
                  onChange={handleChangeDateRange}
                  allowClear={false}
                />
                <Button type="primary" onClick={handleDateStat}>
                  更新
                </Button>
              </Space>
            }
          >
            <SumChart dataSource={dateStatAPI?.data} />
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
            <PieChart
              dataSource={[
                { name: '申告STATUS 1', value: 400 },
                { name: '申告STATUS 2', value: 300 },
                { name: '申告STATUS 3', value: 260 },
                { name: '未申告', value: 40 },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
