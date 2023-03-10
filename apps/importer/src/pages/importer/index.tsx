import { useState } from 'react';
import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PrinterOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
////
import { useIntlFormat } from '@/services/useIntl';
import { getImporters } from '@/services/request/importer';

const Importer: React.FC = () => {
  // state
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
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
      total: data?.importers?.totalCount,
      list: data?.importers?.data,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  //
  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: any[], rows: any[]) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };
  const resetKeys = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handlePrint = () => {
    if (selectedRows?.length > 0) {
      const data = selectedRows?.map(
        ({ code, Zip, address_jp, company_name_jp, Tel }) => ({
          code,
          Zip,
          address_jp,
          company_name_jp,
          Tel,
        }),
      );
      const temp = new URLSearchParams();
      temp.append('data', JSON.stringify(data));
      window.open(
        window.location.origin + window.location.pathname + '#/print?' + temp,
      );
    }
  };

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
      <Card
        title={'法人輸入者リスト'}
        extra={
          <Space>
            <div>selected {selectedRows?.length} items</div>
            <Button type="link" onClick={resetKeys}>
              reset
            </Button>
            <Button
              type="primary"
              onClick={handlePrint}
              icon={<PrinterOutlined />}
            >
              プリント
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          {...tableProps}
          rowSelection={rowSelection}
          scroll={{ x: 2000, y: 'calc(100vh - 550px)' }}
        >
          <Table.Column width={150} title="法人番号" dataIndex="ImpCode" />
          <Table.Column width={150} title="輸出入者符号" dataIndex="code" />
          <Table.Column width={300} title="会社名(en)" dataIndex="ImpName" />
          <Table.Column
            width={300}
            title="会社名(jp)"
            dataIndex="company_name_jp"
          />
          <Table.Column width={700} title="住所(en)" dataIndex="IAD" />
          <Table.Column width={800} title="住所(jp)" dataIndex="address_jp" />
          <Table.Column width={150} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={150} title="電話" dataIndex="Tel" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Importer;
