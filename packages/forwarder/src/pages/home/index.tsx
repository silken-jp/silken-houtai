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
import { useAntdTable, useRequest } from 'ahooks';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAgentInfo } from '@/services/useStorage';
import { getMonthStat, getStatusInquiry } from '@/services/request/waybill';
import { dayFormat } from '@/utils/helper/day';

export interface dashboardProps {}

const Dashboard: React.FC<dashboardProps> = () => {
  // state
  const [form] = Form.useForm();
  const today = dayjs()?.format('YYYY年MM月DD日');
  const thisMonth = dayjs()?.format('YYYY年MM月累計');
  const lastMonth = dayjs()?.subtract(1, 'month')?.format('YYYY年MM月実績');

  // store
  const [intlMenu] = useIntlFormat('menu');
  const agentInfo = getAgentInfo();
  const agentId = agentInfo?._id;

  // api
  const MAWB3daysAPI = useAntdTable(
    async (pageData: any) => {
      const data = await getStatusInquiry({
        page: pageData.current - 1,
        perPage: pageData.pageSize,
        agentId,
        flightStartDate: dayjs().add(-3, 'day')?.format('YYYY/MM/DD'),
        flightEndDate: dayjs()?.format('YYYY/MM/DD'),
      });
      return { total: data?.totalCount, list: data?.mawbs || [] };
    },
    {
      defaultPageSize: 3,
    },
  );

  const mawbAPI = useAntdTable(
    async (pageData: any, formData: any) => {
      const data = await getStatusInquiry({
        page: pageData.current - 1,
        perPage: pageData.pageSize,
        agentId,
        ...formData,
      });
      return { total: data?.totalCount, list: data?.mawbs || [] };
    },
    { form, manual: true, defaultPageSize: 3 },
  );
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
      <Card
        size="small"
        title={
          <Space>
            <span>対応未完了問題（直近一週間）</span>
            <Button size="small" type="primary">
              更新
            </Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id">
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
      </Card>

      <br />
      <Card
        size="small"
        title={
          <Space>
            <span>MAWB情報（直近3日間）</span>
            <Button
              type="primary"
              size="small"
              onClick={MAWB3daysAPI?.search.submit}
            >
              更新
            </Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...MAWB3daysAPI.tableProps}>
          <Table.Column title="MAWBNo" dataIndex="_id" />
          <Table.Column title="FLIGHT NO" dataIndex="flightNo" />
          <Table.Column
            title="FLIGHT DATE"
            render={(row) => dayFormat(row?.flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column title="件数" dataIndex="NOCount" />
          <Table.Column title="状態" />
        </Table>
      </Card>
      <br />
      <Card
        size="small"
        title={
          <Form size="small" layout="inline" form={form}>
            <Form.Item label="MAWBNo" name="MAB">
              <Input placeholder="MAWBNo" />
            </Form.Item>
            <Form.Item label="HAWBNo" name="HAB">
              <Input placeholder="HAWBNo" />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={mawbAPI.search.submit}>
                検索
              </Button>
              <Button onClick={mawbAPI.search.reset}>リセット</Button>
            </Space>
          </Form>
        }
      >
        <Table size="small" rowKey="_id" {...mawbAPI.tableProps}>
          <Table.Column title="FLIGHT NO" dataIndex="flightNo" />
          <Table.Column
            title="FLIGHT DATE"
            render={(row) => dayFormat(row?.flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column title="MAWBNo" dataIndex="_id" />
          <Table.Column
            title="HAWBNo"
            render={() => form.getFieldValue('HAB')}
          />
          <Table.Column title="件数" dataIndex="NOCount" />
          <Table.Column title="状態" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
