import React from 'react';
import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getImportersByFilter } from '@/services/request/importer';

const Importer: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (pageData: PaginatedParams[0], formData: API.Importer) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data: API.Importer[] = await getImportersByFilter(formData);
      return {
        total: data.length,
        list: data,
      };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        title: '輸入者管理',
        breadcrumb: {
          routes: [
            { path: '/cts/settings/Importer', breadcrumbName: intlMenu('setting') },
            { path: '', breadcrumbName: '輸入者管理' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="法人番号" name="code">
              <Input placeholder="法人番号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="会社名" name="company_name_jp">
              <Input placeholder="会社名" />
            </Form.Item>
          </Col>
          <Col span={8}>
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
      <Card
        title="輸入者リスト"
        tabList={[
          { tab: '法人', key: '0' },
          { tab: '個人', key: '1' },
        ]}
      >
        <Table rowKey="_id" {...tableProps} scroll={{ x: 800 }}>
          <Table.Column width={100} title="法人番号" dataIndex="code" />
          <Table.Column width={200} title="会社名" dataIndex="company_name_jp" />
          <Table.Column width={100} title="郵便番号" dataIndex="zip" />
          <Table.Column width={150} title="電話" dataIndex="phone" />
          <Table.Column width={400} title="住所" dataIndex="address_jp" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Importer;
