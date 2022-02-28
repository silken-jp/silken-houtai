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
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="法人番号" name="ImpCode">
              <Input placeholder="法人番号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="輸出入者符号" name="code">
              <Input placeholder="輸出入者符号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="会社名" name="ImpName">
              <Input placeholder="会社名(en)" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="郵便" name="Zip">
              <Input placeholder="郵便番号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="電話" name="Tel">
              <Input placeholder="電話" />
            </Form.Item>
          </Col>
          <Col span={4}>
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
      <Card title="法人輸入者リスト">
        <Table
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 3300, y: 'calc(100vh - 550px)' }}
        >
          <Table.Column width={150} title="法人番号" dataIndex="ImpCode" />
          <Table.Column width={150} title="輸出入者符号" dataIndex="code" />
          <Table.Column width={300} title="会社名(en)" dataIndex="ImpName" />
          <Table.Column
            width={300}
            title="会社名(jp)"
            dataIndex="company_name_jp"
          />
          <Table.Column width={150} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={150} title="電話" dataIndex="Tel" />
          <Table.Column width={700} title="住所(en)" dataIndex="IAD" />
          <Table.Column width={800} title="住所(jp)" dataIndex="address_jp" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Importer;
