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
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getStatusInquiry } from '@/services/request/waybill';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getStatusInquiry({
      page,
      perPage,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: '/cts/StatusInquiry', breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Status Inquiry' },
          ],
        },
        title: 'Status Inquiry',
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
        <Table rowKey="_id" {...tableProps} scroll={{ x: 2000 }}>
          <Table.Column
            width={180}
            title="フォワーダー"
            render={(row) =>
              agentOptions?.find((item) => item?.value === row?.agentId)?.label
            }
          />
          <Table.Column width={180} title="MAWB番号" dataIndex="_id" />
          <Table.Column width={180} title="FlightNo" />
          <Table.Column
            width={180}
            title="FlightDate"
            render={(row) => dayFormat(row?.flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column width={180} title="件数" dataIndex="NOCount" />
          <Table.Column width={180} title="個数" dataIndex="waybillCount" />
          <Table.Column
            width={180}
            title="重量（KG）"
            render={(row) => row?.GWCount?.toFixed(2)}
          />
          <Table.Column width={180} title="ショート" />
          <Table.Column width={180} title="オーバー" />
          <Table.Column width={180} title="MIC許可" />
          <Table.Column width={180} title="MIC未許可" />
          <Table.Column width={180} title="IDC許可" />
          <Table.Column width={180} title="IDC未許可" />
          <Table.Column width={180} title="HAWB未許可" />
          <Table.Column width={180} title="登録時間" />Ï
        </Table>
      </Card>
    </PageContainer>
  );
};

export default StatusInquiry;
