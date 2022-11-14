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
import TransformWaybill from '@/components/Common/WashAddress';
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
  const [intlWaybill] = useIntlFormat('waybill');
  const [intlPages] = useIntlFormat('pages');
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
        agentId,
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
      extra={<TransformWaybill />}
    >
      <Row gutter={8}>
        <Col span={8}>
          <Card loading={mouthStatAPI?.loading}>
            <Descriptions title={today} column={2}>
              <Descriptions.Item label={intlWaybill('NOCount')}>
                {mouthStatAPI?.data?.waybillTodayCount}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('GW')}>
                {mouthStatAPI?.data?.GWTodayCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('PCS')}>
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
              <Descriptions.Item label={intlWaybill('NOCount')}>
                {mouthStatAPI?.data?.waybillThisMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('GW')}>
                {mouthStatAPI?.data?.GWThisMonthCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('PCS')}>
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
              <Descriptions.Item label={intlWaybill('NOCount')}>
                {mouthStatAPI?.data?.waybillLastMonthCount}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('GW')}>
                {mouthStatAPI?.data?.GWLastMonthCount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label={intlWaybill('PCS')}>
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
            <span>{intlPages('home.weekTable')}</span>
            <Button onClick={issuesApi.refresh} size="small" type="primary">
              {intlPages('action.update')}
            </Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...issuesApi.tableProps}>
          <Table.Column
            title={intlWaybill('mawbNo')}
            dataIndex={['waybill', 'MAB']}
          />
          <Table.Column
            title={intlWaybill('hawbNo')}
            dataIndex={['waybill', 'HAB']}
          />
          <Table.Column
            title={intlWaybill('issue_category')}
            dataIndex="issue_category"
          />
          <Table.Column title={intlWaybill('status')} dataIndex="status" />
          <Table.Column
            title={intlWaybill('createdDate')}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
          {/* <Table.Column title="連絡方法" /> */}
          {/* <Table.Column title="通知者" /> */}
          <Table.Column
            title={intlWaybill('created_user')}
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
            <span>{intlPages('home.dayTable')}</span>
            <Button type="primary" size="small" onClick={MAWB3daysAPI.refresh}>
              {intlPages('action.update')}
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
          <Table.Column
            width={120}
            title={intlWaybill('NOCount')}
            dataIndex="NOCount"
          />
          <Table.Column
            width={150}
            title={intlWaybill('notDecNo')}
            dataIndex="notDecNo"
          />
          <Table.Column
            width={120}
            title={intlWaybill('notPerNo')}
            dataIndex="notPerNo"
          />
          <Table.Column
            width={150}
            title={intlWaybill('count3')}
            render={(_, row: any) =>
              `${(
                ((row?.count3 + row?.count3K) * 100) / row?.NOCount || 0
              )?.toFixed(2)}% (${row?.count3 + row?.count3K})`
            }
          />
          <Table.Column title={intlWaybill('status')} />
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
                {intlPages('search.submit')}
              </Button>
              <Button onClick={mawbAPI.search.reset}>
                {intlPages('search.reset')}
              </Button>
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
          <Table.Column
            width={120}
            title={intlWaybill('NOCount')}
            dataIndex="NOCount"
          />
          <Table.Column
            width={150}
            title={intlWaybill('notDecNo')}
            dataIndex="notDecNo"
          />
          <Table.Column
            width={120}
            title={intlWaybill('notPerNo')}
            dataIndex="notPerNo"
          />
          <Table.Column
            width={150}
            title={intlWaybill('count3')}
            render={(_, row: any) =>
              `${(
                ((row?.count3 + row?.count3K) * 100) / row?.NOCount || 0
              )?.toFixed(2)}% (${row?.count3 + row?.count3K})`
            }
          />
          <Table.Column title={intlWaybill('status')} />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
