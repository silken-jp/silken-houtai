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
import ExtraCount from './components/ExtraCount';
import SumChart from './components/SumChart';
// import PieChart from './components/PieChart';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import {
  getMonthStat,
  getDateStat,
  getWeekByDate,
} from '@/services/request/waybill';

export interface dashboardProps {}

const Dashboard: React.FC<dashboardProps> = () => {
  // state
  const [sumChartState, setSumChartState] = useState({
    startDate: dayjs()?.startOf('month') as any,
    endDate: dayjs() as any,
    displayType: '1',
    waybillType: undefined,
  });
  const [flightState, setFlightState] = useState({
    startDate: dayjs()?.startOf('month') as any,
    endDate: dayjs() as any,
  });
  const [agentId, setAgentId] = useState();
  const today = dayjs()?.format('YYYY年MM月DD日（本日）');
  const nextDay = dayjs()?.add(1, 'day')?.format('YYYY年MM月DD日（明日）');
  const thisMonth = dayjs()?.format('YYYY年MM月累計（今月）');
  const lastMonth = dayjs()
    ?.subtract(1, 'month')
    ?.format('YYYY年MM月実績（先月）');

  // store
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();

  // api
  const getDateStatAsync = async (agentId: any) => {
    return await getDateStat({
      agentId,
      displayType: sumChartState?.displayType,
      waybill_type: sumChartState?.waybillType,
      startDate: sumChartState?.startDate?.toDate(),
      endDate: sumChartState?.endDate?.toDate(),
    });
  };
  const getWeekByDatAsync = async (agentId: any) => {
    return await getWeekByDate({
      agentId,
      startDate: flightState?.startDate?.toDate(),
      endDate: flightState?.endDate?.toDate(),
    });
  };
  const mouthStatAPI = useRequest(getMonthStat);
  const dateStatAPI = useRequest(getDateStatAsync);
  const weekStatAPI = useRequest(getWeekByDatAsync);

  // action
  const handleChangeAgent = (agentId: any) => {
    setAgentId(agentId);
    mouthStatAPI?.run({ agentId });
    dateStatAPI?.run(agentId);
    weekStatAPI?.run(agentId);
  };
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
    dateStatAPI?.run(agentId);
  };
  const handleChangeFlightDateRange = ([startDate, endDate]: any) => {
    setFlightState({ ...flightState, startDate, endDate });
  };
  const handleWeekStat = () => {
    weekStatAPI?.run(agentId);
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
        <Col span={12} xl={6}>
          <ExtraCount
            agentId={agentId}
            title={lastMonth}
            loading={mouthStatAPI?.loading}
            counts={[
              mouthStatAPI?.data?.waybillLastMonthCount,
              mouthStatAPI?.data?.GWLastMonthCount?.toFixed(2),
              mouthStatAPI?.data?.NOLastMonthCount,
              mouthStatAPI?.data?.mawbLastMonthCount,
            ]}
            startDate={dayjs().subtract(1, 'month').startOf('month').toDate()}
            endDate={dayjs().subtract(1, 'month').endOf('month').toDate()}
          />
        </Col>
        <Col span={12} xl={6}>
          <ExtraCount
            agentId={agentId}
            title={thisMonth}
            loading={mouthStatAPI?.loading}
            counts={[
              mouthStatAPI?.data?.waybillThisMonthCount,
              mouthStatAPI?.data?.GWThisMonthCount?.toFixed(2),
              mouthStatAPI?.data?.NOThisMonthCount,
              mouthStatAPI?.data?.mawbThisMonthCount,
            ]}
            startDate={dayjs().startOf('month').toDate()}
            endDate={dayjs().endOf('month').toDate()}
          />
        </Col>
        <Col span={12} xl={6}>
          <ExtraCount
            agentId={agentId}
            title={today}
            loading={mouthStatAPI?.loading}
            counts={[
              mouthStatAPI?.data?.waybillTodayCount,
              mouthStatAPI?.data?.GWTodayCount?.toFixed(2),
              mouthStatAPI?.data?.NOTodayCount,
              mouthStatAPI?.data?.mawbTodayCount,
            ]}
            startDate={dayjs().startOf('day').toDate()}
            endDate={dayjs().endOf('day').toDate()}
          />
        </Col>
        <Col span={12} xl={6}>
          <ExtraCount
            agentId={agentId}
            title={nextDay}
            loading={mouthStatAPI?.loading}
            counts={[
              mouthStatAPI?.data?.waybillNextDayCount,
              mouthStatAPI?.data?.GWNextDayCount?.toFixed(2),
              mouthStatAPI?.data?.NONextDayCount,
              mouthStatAPI?.data?.mawbNextDayCount,
            ]}
            startDate={dayjs().add(1, 'day').startOf('day').toDate()}
            endDate={dayjs().add(1, 'day').endOf('day').toDate()}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          <Card
            title="空港別"
            extra={
              <Space>
                <DatePicker.RangePicker
                  value={[flightState.startDate, flightState.endDate]}
                  onChange={handleChangeFlightDateRange}
                  allowClear={false}
                />
                <Button type="primary" onClick={handleWeekStat}>
                  更新
                </Button>
              </Space>
            }
          >
            <Table
              size="small"
              style={{ minHeight: 320 }}
              pagination={false}
              rowKey="id"
              loading={weekStatAPI.loading}
              dataSource={weekStatAPI.data}
            >
              <Table.Column title="曜日" dataIndex="id" />
              <Table.Column title="総件数" dataIndex="total" />
              <Table.Column title="成田" dataIndex="NRT" />
              <Table.Column title="関西" dataIndex="KIX" />
              <Table.Column title="羽田" dataIndex="HND" />
              <Table.Column title="その他" dataIndex="other" />
            </Table>
          </Card>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          <Card
            title={
              <Space>
                <span>申告STATUS別</span>
                <Select
                  value={sumChartState.waybillType}
                  onChange={handleChangeWaybillType}
                  allowClear
                  placeholder="MIC/IDA"
                  style={{ width: 100 }}
                  options={[
                    { value: 'MIC', label: 'MIC' },
                    { value: 'IDA', label: 'IDA' },
                  ]}
                />
              </Space>
            }
            loading={dateStatAPI?.loading}
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
      {/* <Row gutter={24}>
        <Col span={12}>
          <Card
            title="申告リスト"
            extra={
              <>
                <DatePicker.RangePicker
                  value={[sumChartState.startDate, sumChartState.endDate]}
                  onChange={handleChangeDateRange}
                  allowClear={false}
                />
                <Button type="primary" onClick={handleDateStat}>
                  更新
                </Button>
              </>
            }
          >
            <Table style={{ minHeight: 400 }}>
              <Table.Column title="曜日" dataIndex="HAB" />
              <Table.Column title="総件数" dataIndex="" />
              <Table.Column title="成田" dataIndex="" />
              <Table.Column title="関空" dataIndex="" />
              <Table.Column title="羽田" dataIndex="" />
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
      </Row> */}
    </PageContainer>
  );
};

export default Dashboard;
