import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getStatusInquiry } from '@/services/request/waybill';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getStatusInquiry({
      page,
      perPage,
      ...formData,
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
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="代理商">
              <Select disabled options={[{ value: 'all', label: 'ALL' }]} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="MAWB番号" name="MAB">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="FlightNo" name="flightNo">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card>
        <Table rowKey="_id" {...tableProps} scroll={{ x: 2000 }}>
          <Table.Column width={180} title="MAWB番号" dataIndex="_id" />
          <Table.Column width={180} title="FlightNo" />
          <Table.Column width={180} title="FlightDate" />
          <Table.Column width={180} title="件数" dataIndex="NOCount" />
          <Table.Column width={180} title="個数" dataIndex="waybillCount" />
          <Table.Column width={180} title="重量（KG）" dataIndex="GWCount" />
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
