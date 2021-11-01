import React from 'react';
import { Form, Table, Card, Row, Col, Input, Button, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { getDeliveries } from '@/services/request/delivery';

const STATUS = ['', '配達中', '到着', '再配達'];

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  // api
  const getTableData = async (_: PaginatedParams[0], formData: any) => {
    try {
      const data = [] || (await getDeliveries(formData));
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
        // title: intlMenu('delivery.other'),
        breadcrumb: {
          routes: [
            { path: `/delivery/other`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: intlMenu('delivery.other') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="Track">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}></Col>
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
      <Card title={intlMenu('delivery.other')}>
        <Table {...tableProps} rowKey="_id">
          <Table.Column title="status" render={(row) => STATUS[row?.status]} />
          <Table.Column title="waybill" dataIndex="waybill" />
          <Table.Column title="truck" dataIndex="truck" />
          <Table.Column title="createAt" render={(row) => dayjs(row.createdAt).format('YYYY/MM/DD')} />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
