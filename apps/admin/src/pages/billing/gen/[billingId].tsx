import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
////
import { getBillingById } from '@/services/request/billing';
import { useAgentOptions } from '@/services/useAPIOption';
import { dayFormatTZ } from '@/utils/helper/day';
import BillingTable from './components/BillingTable';

const GenBilling: React.FC = () => {
  // state
  const [activeTabKey, setActiveTabKey] = useState<string>('billing');
  const { billingId } = useParams<any>();
  const { renderAgentLabel } = useAgentOptions();

  const billingAPI = useRequest(() => getBillingById({ billingId }));

  const title =
    renderAgentLabel(billingAPI?.data?.agent) +
    dayFormatTZ(billingAPI?.data?.start_date, ' 【 YYYY年MM月DD日 ~ ') +
    dayFormatTZ(billingAPI?.data?.end_date, 'YYYY年MM月DD日 】');

  const tabList = [
    { key: 'billing', tab: '請求書' },
    { key: 'firstBonded', tab: '一次上屋料金' },
    { key: 'secondBonded', tab: '二次上屋料金' },
    { key: 'clearance', tab: '通関料' },
    { key: 'storage', tab: '保管料' },
    { key: 'inspection', tab: '税関検査費用' },
    { key: 'delivery', tab: '配送料金（＊）' },
    { key: 'irregular', tab: '立替関税・消費税◎' },
    { key: 'advance', tab: 'イレギュラー費用' },
  ];

  const secondBondedData = billingAPI?.data?.waybills_obj?.filter(
    (i: any) => !!i?.second_bonded,
  );
  const clearanceData = billingAPI?.data?.waybills_obj?.filter(
    (i: any) => !!i?.clearance,
  );
  const storageData = billingAPI?.data?.waybills_obj?.filter(
    (i: any) => !!i?.storage,
  );
  const inspectionData = billingAPI?.data?.waybills_obj?.filter(
    (i: any) => !!i?.inspection,
  );

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const contentList: Record<string, React.ReactNode> = {
    billing: <BillingTable filename={title} billingAPI={billingAPI} />,
    firstBonded: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={billingAPI?.data?.first_bonded}
        title={() => <>Total: {billingAPI?.data?.first_bonded?.length}</>}
        pagination={false}
        scroll={{ y: 'calc(100vh - 430px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="mab" />
        <Table.Column width={150} title="入港日" dataIndex="ARR" />
        <Table.Column width={150} title="便名" dataIndex="VSN" />
        <Table.Column width={120} title="一次上屋料金" dataIndex="price" />
      </Table>
    ),
    secondBonded: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={secondBondedData}
        title={() => <>Total: {secondBondedData?.length}</>}
        pagination={{
          total: secondBondedData?.length,
        }}
        scroll={{ y: 'calc(100vh - 430px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column
          width={120}
          title="二次上屋料金"
          dataIndex="second_bonded"
        />
      </Table>
    ),
    clearance: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={clearanceData}
        title={() => <>Total: {clearanceData?.length}</>}
        pagination={{
          total: clearanceData?.length,
        }}
        scroll={{ y: 'calc(100vh - 430px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="通关料" dataIndex="clearance" />
      </Table>
    ),
    storage: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={storageData}
        title={() => <>Total: {storageData?.length}</>}
        pagination={{
          total: storageData?.length,
        }}
        scroll={{ y: 'calc(100vh - 430px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="BL_" />
        <Table.Column width={120} title="通关料" dataIndex="clearance" />
      </Table>
    ),
    inspection: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={inspectionData}
        title={() => <>Total: {inspectionData?.length}</>}
        pagination={{
          total: inspectionData?.length,
        }}
        scroll={{ y: 'calc(100vh - 430px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="BL_" />
        <Table.Column width={120} title="通关料" dataIndex="clearance" />
      </Table>
    ),
  };

  return (
    <PageContainer
      title="生成請求書"
      header={{
        breadcrumb: {
          routes: [
            { path: '/billing/gen', breadcrumbName: '請求書管理' },
            { path: '', breadcrumbName: '生成請求書' },
          ],
        },
      }}
    >
      <Card title={title} tabList={tabList} onTabChange={onTabChange}>
        <>{contentList[activeTabKey]}</>
      </Card>
    </PageContainer>
  );
};

export default GenBilling;
