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
import { useUserOptions } from '@/services/useAPIOption';
import { dayFormat } from '@/utils/helper/day';
import { getAllIssues } from '@/services/request/issue';

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
  const { userOptions } = useUserOptions();
  const issuesApi = useAntdTable(
    async (pageData: any, formData: any) => {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data = await getAllIssues({
        page,
        perPage,
        sortField: 'createdAt',
        sortOrder: 1,
        ...formData,
      });
      return { total: data?.totalCount, list: data?.data };
    },
    {
      defaultPageSize: 5,
    },
  );
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
            <Button onClick={issuesApi.refresh} size="small" type="primary">
              更新
            </Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...issuesApi.tableProps}>
          <Table.Column title="MAWBNo" dataIndex={['waybill', 'MAB']} />
          <Table.Column title="HAWBNo" dataIndex={['waybill', 'HAB']} />
          <Table.Column title="問題該当" dataIndex="issue_category" />
          <Table.Column title="状態" dataIndex="status" />
          <Table.Column
            title="連絡日"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
          {/* <Table.Column title="連絡方法" /> */}
          {/* <Table.Column title="通知者" /> */}
          <Table.Column
            title="登録者"
            dataIndex="created_user"
            render={(created_user) =>
              userOptions?.find((item) => item?.value === created_user)?.label
            }
          />
        </Table>
      </Card>

      <br />
      <Card
        size="small"
        title={
          <Space>
            <span>MAWB情報（直近3日間）</span>
            <Button type="primary" size="small" onClick={MAWB3daysAPI.refresh}>
              更新
            </Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...MAWB3daysAPI.tableProps}>
          <Table.Column width={150} title="MAWBNo" dataIndex="_id" />
          <Table.Column width={150} title="FLIGHT NO" dataIndex="flightNo" />
          <Table.Column
            width={150}
            title="FLIGHT DATE"
            render={(row) => dayFormat(row?.flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column width={120} title="件数" dataIndex="NOCount" />
          <Table.Column width={150} title="未申告件数" dataIndex="notDecNo" />
          <Table.Column width={120} title="未許可件数" dataIndex="notPerNo" />
          <Table.Column
            width={150}
            title="検査率（区分３）"
            render={(_, row: any) =>
              `${(
                ((row?.count3 + row?.count3K) * 100) / row?.NOCount || 0
              )?.toFixed(2)}% (${row?.count3 + row?.count3K})`
            }
          />
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
          <Table.Column width={200} title="FLIGHT NO" dataIndex="flightNo" />
          <Table.Column
            width={200}
            title="FLIGHT DATE"
            render={(row) => dayFormat(row?.flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column width={200} title="MAWBNo" dataIndex="_id" />
          <Table.Column
            width={200}
            title="HAWBNo"
            render={() => form.getFieldValue('HAB')}
          />
          <Table.Column width={120} title="件数" dataIndex="NOCount" />
          <Table.Column width={150} title="未申告件数" dataIndex="notDecNo" />
          <Table.Column width={120} title="未許可件数" dataIndex="notPerNo" />
          <Table.Column
            width={150}
            title="検査率（区分３）"
            render={(_, row: any) =>
              `${(
                ((row?.count3 + row?.count3K) * 100) / row?.NOCount || 0
              )?.toFixed(2)}% (${row?.count3 + row?.count3K})`
            }
          />
          <Table.Column title="状態" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
