import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  DatePicker,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { getAgentInfo } from '@/services/useStorage';
import { getStatusInquiry } from '@/services/request/waybill';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // store
  const agentInfo = getAgentInfo();
  const agentId = agentInfo?._id;

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'flightDate';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getStatusInquiry({
      page,
      perPage,
      agentId,
      ...sorter,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      title={agentInfo?.name}
      header={{
        breadcrumb: {
          routes: [
            { path: '/cts/StatusInquiry', breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Status Inquiry' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="flightNo">
              <Input placeholder="FlightNo" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightStartDate">
              <DatePicker placeholder="flight start date" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightEndDate">
              <DatePicker placeholder="flight end date" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card>
        <Table
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 2000, y: 'calc(100vh - 470px)' }}
        >
          <Table.Column sorter width={180} title="MAWB番号" dataIndex="_id" />
          <Table.Column
            sorter
            width={180}
            title="FlightNo"
            dataIndex="flightNo"
          />
          <Table.Column
            sorter
            width={180}
            title="FlightDate"
            dataIndex="flightDate"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={120} title="件数" dataIndex="NOCount" />
          <Table.Column
            sorter
            width={120}
            title="未許可件数"
            dataIndex="notPerNo"
          />
          <Table.Column
            sorter
            width={120}
            title="検査率"
            dataIndex="K3Count"
            render={(_, row: any) =>
              ((row?.K3Count * 100) / row?.NOCount).toFixed(2) + '%'
            }
          />
          <Table.Column
            sorter
            width={180}
            title="個数"
            dataIndex="waybillCount"
          />
          <Table.Column
            sorter
            width={180}
            title="重量（KG）"
            dataIndex="GWCount"
            render={(GWCount) => GWCount?.toFixed(2)}
          />
          <Table.Column sorter width={180} title="ショート" />
          <Table.Column sorter width={180} title="オーバー" />
          {/* <Table.Column sorter width={180} title="MIC許可" />
          <Table.Column sorter width={180} title="MIC未許可" />
          <Table.Column sorter width={180} title="IDC許可" />
          <Table.Column sorter width={180} title="IDC未許可" />
          <Table.Column sorter width={180} title="HAWB未許可" /> */}
          <Table.Column sorter width={180} title="登録時間" />Ï
        </Table>
      </Card>
    </PageContainer>
  );
};

export default StatusInquiry;
