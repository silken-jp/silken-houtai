import { Form, Table, Input, Button, Row, Col, Card, Space, Select } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (_: any, formData: Object) => {
    const data: any[] = []; // await getAllWaybills(formData)
    return { total: data.length, list: data };
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
        title: <Select defaultValue={'all'} options={[{ value: 'all', label: 'ALL' }]} />,
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="MAWB番号">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="FlightNo">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
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
          <Table.Column width={180} title="MAWB番号" />
          <Table.Column width={180} title="FlightNo" />
          <Table.Column width={180} title="FlightDate" />
          <Table.Column width={180} title="個数" />
          <Table.Column width={180} title="重量（KG）" />
          <Table.Column width={180} title="件数" />
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
