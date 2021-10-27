import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills } from '@/services/request/waybill';

const Dashboard: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (_: PaginatedParams[0], formData: Object) => {
    try {
      const data = [] || (await getAllWaybills(formData));
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
      title="Status Inquiry"
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/waybill/cts/dashboard',
              breadcrumbName: intlMenu('cts'),
            },
            {
              path: '',
              breadcrumbName: 'Status Inquiry',
            },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="MAWB番号">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="FlightNo">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset} style={{ marginLeft: 16 }}>
                リセット
              </Button>
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

export default Dashboard;
