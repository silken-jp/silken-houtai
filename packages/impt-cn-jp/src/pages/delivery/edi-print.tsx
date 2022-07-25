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
  Select,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import EDIPrintModal from '@/components/Modal/EDIPrintModal';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllWaybills, getStatusInquiry } from '@/services/request/waybill';

interface SubTableProps {
  MAB: string;
  HAB: string;
}
const SubTable: React.FC<SubTableProps> = (props) => {
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
    const data = await getAllWaybills({
      page,
      perPage,
      MAB: props?.MAB,
      HAB: props?.HAB,
      ...sorter,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
  };
  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: 5,
  });

  return (
    <Table
      size="small"
      rowKey="_id"
      {...tableProps}
      pagination={{ ...tableProps.pagination, position: ['bottomLeft'] }}
    >
      <Table.Column sorter width={200} title="MAWB番号" dataIndex="MAB" />
      <Table.Column sorter width={200} title="HAWB番号" dataIndex="HAB" />
      <Table.Column
        title="Download"
        render={(row) => <EDIPrintModal dataSource={row} />}
      />
    </Table>
  );
};

const EDIPrint: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
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
      ...sorter,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  const getAllWaybillsApi = useRequest(
    (params) => {
      console.log(params);
      return getAllWaybills({
        page: 0,
        perPage: 100000,
        ...params,
      });
    },
    {
      manual: true,
    },
  );

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/delivery/self`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: '送り状' },
          ],
        },
        title: '送り状',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
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
          size="small"
          expandable={{
            expandedRowRender: (row) => (
              <SubTable MAB={row?._id} HAB={form.getFieldValue('HAB')} />
            ),
          }}
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 1100 }}
        >
          <Table.Column sorter width={200} title="MAWB番号" dataIndex="_id" />
          <Table.Column
            sorter
            width={150}
            title="Download"
            render={() => (
              <Button size="small" disabled>
                <DownloadOutlined />
              </Button>
            )}
          />
          <Table.Column
            sorter
            width={200}
            title="フォワーダー"
            dataIndex="agentId"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column sorter width={150} title="仕出地" dataIndex="PSC" />
          <Table.Column
            sorter
            width={150}
            title="FlightNo"
            dataIndex="flightNo"
          />
          <Table.Column
            sorter
            width={150}
            title="FlightDate"
            dataIndex="flightDate"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={120} title="件数" dataIndex="NOCount" />
          <Table.Column
            sorter
            width={150}
            title="未申告件数"
            dataIndex="notDecNo"
          />
          <Table.Column
            sorter
            width={180}
            title="登録時間"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default EDIPrint;
