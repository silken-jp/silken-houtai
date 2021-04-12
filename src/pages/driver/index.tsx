import React from 'react';
import { Form, Table, Input, Button, Row, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();

  // apollo
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
    <PageContainer>
      <div
        style={{ marginBottom: 16, padding: '24px 24px 0', background: '#fff' }}
      >
        <Form form={form}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="快递员" name="driverId">
                <Input placeholder="快递员" />
              </Form.Item>
            </Col>
            <Col span={8}>
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
      </div>
      <Table rowKey="id" {...tableProps}>
        <Table.Column title="员工号" />
        <Table.Column title="名字" />
        <Table.Column title="区域" />
      </Table>
    </PageContainer>
  );
};

export default waybill;
