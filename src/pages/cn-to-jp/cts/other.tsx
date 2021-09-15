import React, { useState } from 'react';
import { Form, Table, Input, Button, Row, Col, Card, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills, deleteByWaybillId } from '@/services/request/waybill';

const OtherWaybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('Other');

  // query
  const getTableData = async (pageData: any, formData: Object) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      console.log(tabKey);
      const data = [] || (await getAllWaybills(formData));
      return { total: data.length, list: data };
    } catch (error) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  const tabList = [
    { tab: 'Other', key: 'Other' },
    { tab: 'Hold', key: 'Hold' },
  ];

  const handleTabChange = (key: string) => {
    setTabKey(key);
    search.submit();
  };

  return (
    <PageContainer
      header={{
        title: 'Other',
        breadcrumb: {
          routes: [
            {
              path: `/cn-to-jp/cts/other`,
              breadcrumbName: intlMenu('cts'),
            },
            { path: '', breadcrumbName: 'Other' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="MAWB番号" name="mawb_no">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="HAWB番号" name="hawb_no">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="FLIGHT" name="flight_no">
              <Input placeholder="FLIGHT" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検査
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card
        tabList={tabList}
        onTabChange={handleTabChange}
        activeTabKey={tabKey}
      >
        <Table rowKey="id" {...tableProps}>
          <Table.Column title="HAWB番号" dataIndex="hawb_no" />
          <Table.Column title="MAWB番号" dataIndex="mawb_no" />
          <Table.Column title="クレンザー" dataIndex="" />
          <Table.Column title="クレンジング時間" dataIndex="" />
          <Table.Column title="クリエーター" dataIndex="" />
          <Table.Column title="クリエート時間" dataIndex="" />
          <Table.Column title="申告番号" dataIndex="" />
          <Table.Column title="申告者" dataIndex="" />
          <Table.Column title="申告時間" dataIndex="" />
          <Table.Column title="申告STATUS" dataIndex="" />
          <Table.Column title="許可済み" dataIndex="" />
          <Table.Column title="許可時間" dataIndex="" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default OtherWaybill;
