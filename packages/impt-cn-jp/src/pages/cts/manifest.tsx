import { useState } from 'react';
import { Form, Table, Input, Button, Row, Col, Card, Space, Statistic, Progress } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
////
import Create from '@/components/Common/Create';
import UploadWaybill from '@/components/Common/UploadWaybill';
import { getAllWaybills } from '@/services/request/waybill';
import { useIntlFormat } from '@/services/useIntl';

const ManifestWaybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('MIC');

  // query
  const getTableData = async (pageData: any, formData: any) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      console.log(tabKey);
      const data: any[] = await getAllWaybills({ waybill_type: 1, ...formData });
      return { total: data.length, list: data };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  const tabList = [
    { tab: 'MIC', key: 'MIC' },
    { tab: 'Hold', key: 'Hold' },
    { tab: 'SendBack', key: 'SendBack' },
  ];

  const handleTabChange = (key: string) => {
    setTabKey(key);
    search.submit();
  };

  return (
    <PageContainer
      header={{
        title: 'Manifest',
        breadcrumb: {
          routes: [
            { path: `/cts/manifest`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Manifest' },
          ],
        },
        extra: <UploadWaybill />,
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="HAWB番号" name="HAB">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
            <Form.Item label="MAWB番号" name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}></Col>
          <Col xs={12} sm={12} md={12} lg={6} xxl={6}>
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

      <Row className="sk-table-stat">
        <Col span={6}>
          <Statistic title="クレンジング済" value={1000} suffix="/ 1000" />
          <Progress percent={100} />
        </Col>
        <Col span={6}>
          <Statistic title="ブローカーチェック済" value={1000} suffix="/ 1000" />
          <Progress percent={100} />
        </Col>
        <Col span={6}>
          <Statistic title="クリエート済" value={870} suffix="/ 1000" />
          <Progress percent={87} />
        </Col>
        <Col span={6}>
          <Statistic title="申告済" value={870} suffix="/ 1000" />
          <Progress percent={87} />
        </Col>
      </Row>

      <Card
        tabList={tabList}
        onTabChange={handleTabChange}
        activeTabKey={tabKey}
        tabBarExtraContent={
          <Space>
            <Link to="/cts/check/61a5e8d529da41d6c82e3108">
              <Button type="primary">クレンジング</Button>
            </Link>
            <Button type="primary">ブローカーチェック</Button>
            <Create type="MIC" />
          </Space>
        }
      >
        <Table rowKey="_id" {...tableProps} scroll={{ x: 2000 }}>
          <Table.Column title="HAWB番号" dataIndex="HAB" />
          <Table.Column title="MAWB番号" dataIndex="MAB" />
          <Table.Column title="クレンザー" dataIndex="" />
          <Table.Column title="クレンジング時間" dataIndex="" />
          <Table.Column title="ブローカー" dataIndex="" />
          <Table.Column title="ブローカーチェック時間" dataIndex="" />
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

export default ManifestWaybill;
