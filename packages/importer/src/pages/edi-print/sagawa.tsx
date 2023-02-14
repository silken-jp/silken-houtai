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
import { Link } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getSimpleStatusInquiry } from '@/services/request/waybill';

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
    const data = await getSimpleStatusInquiry({
      page,
      perPage,
      ...sorter,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

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
            <Form.Item name="agentId">
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
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 1100 }}>
          <Table.Column sorter width={200} title="MAWB番号" dataIndex="_id" />
          <Table.ColumnGroup title="Download">
            <Table.Column
              sorter
              width={80}
              title="一列"
              render={(row) => (
                <Link target="_blank" to={`/print/SagawaEDI?MAB=${row?._id}`}>
                  <DownloadOutlined />
                </Link>
              )}
            />
            <Table.Column
              sorter
              width={80}
              title="二列"
              render={(row) => (
                <Link target="_blank" to={`/print/SagawaEDI2?MAB=${row?._id}`}>
                  <DownloadOutlined />
                </Link>
              )}
            />
          </Table.ColumnGroup>
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
