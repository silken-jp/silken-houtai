import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getImporters } from '@/services/request/importer';

const Importer: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (pageData: any, formData: API.Importer) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getImporters({
      page,
      perPage,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.importers,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        title: '法人輸入者管理',
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/Importer',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: '法人輸入者管理' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="ImpCode">
              <Input placeholder="法人番号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="code">
              <Input placeholder="輸出入者符号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="ImpName">
              <Input placeholder="会社名(en)" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Zip">
              <Input placeholder="郵便番号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Tel">
              <Input placeholder="電話" />
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
      <Card title="法人輸入者リスト">
        <Table
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 2000, y: 'calc(100vh - 550px)' }}
        >
          <Table.Column width={150} title="法人番号" dataIndex="ImpCode" />
          <Table.Column width={150} title="輸出入者符号" dataIndex="code" />
          <Table.Column width={300} title="会社名(en)" dataIndex="ImpName" />
          {/* <Table.Column
            width={300}
            title="会社名(jp)"
            dataIndex="company_name_jp"
          /> */}
          <Table.Column width={700} title="住所(en)" dataIndex="IAD" />
          {/* <Table.Column width={800} title="住所(jp)" dataIndex="address_jp" /> */}
          <Table.Column width={150} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={150} title="電話" dataIndex="Tel" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Importer;
