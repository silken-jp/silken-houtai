import React from 'react';
import { Select, Form, Table, Input, Button, Row, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlWaybill } from '@/services/useIntl';

const options = [
  { value: 0, label: '未分配' },
  { value: 1, label: '派送中' },
  { value: 2, label: '已签收' },
  { value: 3, label: '未送达' },
];

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const intlWaybill = useIntlWaybill();

  // query
  const getTableData = async (
    pageData: PaginatedParams[0],
    formData: Object,
  ) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      // const { data } = await client.query({
      //   query: GQL.Vocabulary.ALL_JP_VOC,
      //   variables: { examTag, page, perPage, ...formData },
      //   fetchPolicy: 'no-cache',
      // });
      return {
        total: 0,
        list: [],
      };
    } catch (error) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        title: `${intlWaybill.smallPacket}`,
        breadcrumb: {
          routes: [
            { path: '', breadcrumbName: intlWaybill.home },
            { path: '', breadcrumbName: intlWaybill.smallPacket },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={6}>
            <Form.Item label="主单号" name="mawb_no">
              <Input placeholder="主单号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={6}>
            <Form.Item label="分单号" name="hawb_no">
              <Input placeholder="分单号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={6}>
            <Form.Item label="派送单号" name="tracking_no">
              <Input placeholder="派送单号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={6}>
            <Form.Item label="货品状态" name="track_status">
              <Select placeholder="货品状态" options={options} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={6}>
            <Form.Item label="快递员" name="driverId">
              <Input placeholder="快递员" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={18}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={search.submit}>
                搜索
              </Button>
              <Button onClick={search.reset} style={{ marginLeft: 16 }}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table rowKey="id" {...tableProps}>
        <Table.Column title="主单号" />
        <Table.Column title="分单号" />
        <Table.Column title="派送单号" />
        <Table.Column title="货品名称" />
        <Table.Column title="重量" />
        <Table.Column title="快递员" />
        <Table.Column title="货品状态" />
        <Table.Column title="操作" />
      </Table>
    </PageContainer>
  );
};

export default waybill;
