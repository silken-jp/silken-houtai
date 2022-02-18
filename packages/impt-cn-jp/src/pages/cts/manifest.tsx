import { useState } from 'react';
import { Form, Table, Button, Row, Col, Card, Space, Statistic, Progress } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import Create from '@/components/Common/Create';
import Cleansing from '@/components/Common/Cleansing';
import CTSSearch from '@/components/Search/CTSSearch';
import UploadWaybill from '@/components/Common/UploadWaybill';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills } from '@/services/request/waybill';

const ManifestWaybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('MIC');
  // query
  const getTableData = async (pageData: any, formData: any): Promise<API.Result> => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    console.log(tabKey);
    const data: any[] = await getAllWaybills({ waybill_type: 1, ...formData });
    return { total: data.length, list: data };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  const tabList = [
    { tab: 'MIC', key: 'MIC' },
    { tab: 'Hold', key: 'Hold' },
    { tab: 'SendBack', key: 'SendBack' },
    { tab: 'Other', key: 'Other' },
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
        extra: <UploadWaybill onUpload={search.submit} />,
      }}
    >
      <CTSSearch form={form} search={search} />

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
            <Cleansing LS="M" MAB={form.getFieldValue('MAB')} />
            <Button type="primary" disabled={!form.getFieldValue('MAB')}>
              ブローカーチェック
            </Button>
            <Create type="MIC" disabled={!form.getFieldValue('MAB')} />
          </Space>
        }
      >
        <Table rowKey="_id" {...tableProps} scroll={{ x: 2000 }}>
          <Table.Column title="HAWB番号" render={(row) => <WaybillModal dataSource={row} />} />
          <Table.Column title="MAWB番号" dataIndex="MAB" />
          {tabKey === 'Other' && <Table.Column title="コントローラー" dataIndex="" />}
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
