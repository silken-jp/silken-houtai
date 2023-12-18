import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card, Space, Button } from 'antd';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
////
import {
  createAllPrice,
  getBillingById,
  getBillingTabs,
} from '@/services/request/billing';
import { useAgentOptions } from '@/services/useAPIOption';
import { handleExportXlsx2 } from '@/services/useExportXlsx';
import { dayFormatTZ } from '@/utils/helper/day';
import { renderPrice } from '@/utils/helper/helper';

const GenBilling: React.FC = () => {
  // state
  const [activeTabKey, setActiveTabKey] = useState<string>('billing');
  const { billingId } = useParams<any>();
  const { renderAgentLabel } = useAgentOptions();

  // api
  const billingAPI = useRequest(() => getBillingById({ billingId }));
  const billingTabsAPI = useRequest(() => getBillingTabs({ billingId }));
  const createAllPriceAPI = useRequest(
    async () => {
      await createAllPrice({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );

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
    { key: 'advance', tab: '立替関税・消費税◎' },
    { key: 'irregular', tab: 'イレギュラー費用' },
  ];

  const billingTabsData = billingTabsAPI?.data?.flatMap(
    ({ waybillsDetail, ...billingMAB }: any) =>
      waybillsDetail?.map((item: any) => ({
        ...item,
        ...billingMAB,
        advance: item?.CON_TAX + item?.CUS_DTY + item?.LC_TAX,
      })),
  );

  const secondBondedData = billingTabsData?.filter(
    (i: any) => !!i?.second_bonded,
  );
  const clearanceData = billingTabsData?.filter((i: any) => !!i?.clearance);
  const storageData = billingTabsData?.filter((i: any) => !!i?.storage);
  const inspectionData = billingTabsData?.filter((i: any) => !!i?.inspection);
  const advanceData = billingTabsData?.filter((i: any) => !!i?.advance);
  const deliveryData = billingTabsData?.filter((i: any) => !!i?.delivery);
  const dataSource = [
    {
      key: '0',
      field: '一次上屋料金',
      ...billingAPI?.data?.first_bonded_field,
    },
    {
      key: '1',
      field: '二次上屋料金',
      ...billingAPI?.data?.second_bonded_field,
    },
    {
      key: '2',
      field: '通関料',
      ...billingAPI?.data?.clearance_field,
    },
    {
      key: '3',
      field: '保管料',
      ...billingAPI?.data?.storage_field,
    },
    {
      key: '4',
      field: '税関検査費用',
      ...billingAPI?.data?.inspection_field,
    },
    {
      key: '5',
      field: '配送料金（＊）',
      ...billingAPI?.data?.delivery_field,
    },
    // {
    //   key: '6',
    //   field: '成田チャーター運賃取消料（＊）',
    // },
    {
      key: '7',
      field: '立替関税・消費税◎',
      ...billingAPI?.data?.advance_field,
    },
    {
      key: '8',
      field: 'イレギュラー費用（＊）',
      ...billingAPI?.data?.irregular_field,
    },
    {
      key: '9',
      field: 'イレギュラー費用（不課税）',
      ...billingAPI?.data?.irregular_no_tax_field,
    },
  ];

  // actions
  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onExport = () => {
    handleExportXlsx2(
      [
        {
          sheetName: '請求書',
          data: [
            {
              請求項目: '一次上屋料金',
              数量: billingAPI?.data?.first_bonded_field?.count,
              単価: billingAPI?.data?.first_bonded_field?.unit_price,
              立替項目: billingAPI?.data?.first_bonded_field?.advance,
              不課税項目: billingAPI?.data?.first_bonded_field?.no_tax_price,
              課税項目: billingAPI?.data?.first_bonded_field?.tax_price,
            },
            {
              請求項目: '二次上屋料金',
              数量: billingAPI?.data?.second_bonded_field?.count,
              単価: billingAPI?.data?.second_bonded_field?.unit_price,
              立替項目: billingAPI?.data?.second_bonded_field?.advance,
              不課税項目: billingAPI?.data?.second_bonded_field?.no_tax_price,
              課税項目: billingAPI?.data?.second_bonded_field?.tax_price,
            },
            {
              請求項目: '通関料',
              数量: billingAPI?.data?.clearance_field?.count,
              単価: billingAPI?.data?.clearance_field?.unit_price,
              立替項目: billingAPI?.data?.clearance_field?.advance,
              不課税項目: billingAPI?.data?.clearance_field?.no_tax_price,
              課税項目: billingAPI?.data?.clearance_field?.tax_price,
            },
            {
              請求項目: '保管料',
              数量: billingAPI?.data?.storage_field?.count,
              単価: billingAPI?.data?.storage_field?.unit_price,
              立替項目: billingAPI?.data?.storage_field?.advance,
              不課税項目: billingAPI?.data?.storage_field?.no_tax_price,
              課税項目: billingAPI?.data?.storage_field?.tax_price,
            },
            {
              請求項目: '税関検査費用',
              数量: billingAPI?.data?.inspection_field?.count,
              単価: billingAPI?.data?.inspection_field?.unit_price,
              立替項目: billingAPI?.data?.inspection_field?.advance,
              不課税項目: billingAPI?.data?.inspection_field?.no_tax_price,
              課税項目: billingAPI?.data?.inspection_field?.tax_price,
            },
            {
              請求項目: '配送料金（＊）',
              数量: billingAPI?.data?.delivery_field?.count,
              単価: billingAPI?.data?.delivery_field?.unit_price,
              立替項目: billingAPI?.data?.delivery_field?.advance,
              不課税項目: billingAPI?.data?.delivery_field?.no_tax_price,
              課税項目: billingAPI?.data?.delivery_field?.tax_price,
            },
            {
              請求項目: '立替関税・消費税◎',
              数量: billingAPI?.data?.advance_field?.count,
              単価: billingAPI?.data?.advance_field?.unit_price,
              立替項目: billingAPI?.data?.advance_field?.advance,
              不課税項目: billingAPI?.data?.advance_field?.no_tax_price,
              課税項目: billingAPI?.data?.advance_field?.tax_price,
            },
            {
              請求項目: 'イレギュラー費用（＊）',
              数量: billingAPI?.data?.irregular_field?.count,
              単価: billingAPI?.data?.irregular_field?.unit_price,
              立替項目: billingAPI?.data?.irregular_field?.advance,
              不課税項目: billingAPI?.data?.irregular_field?.no_tax_price,
              課税項目: billingAPI?.data?.irregular_field?.tax_price,
            },
            {
              請求項目: 'イレギュラー費用（不課税）',
              数量: billingAPI?.data?.irregular_no_tax_field?.count,
              単価: billingAPI?.data?.irregular_no_tax_field?.unit_price,
              立替項目: billingAPI?.data?.irregular_no_tax_field?.advance,
              不課税項目:
                billingAPI?.data?.irregular_no_tax_field?.no_tax_price,
              課税項目: billingAPI?.data?.irregular_no_tax_field?.tax_price,
            },
            {
              請求項目: '合計',
              数量: '',
              単価: '',
              立替項目:
                billingAPI?.data?.first_bonded_field?.advance +
                billingAPI?.data?.second_bonded_field?.advance +
                billingAPI?.data?.clearance_field?.advance +
                billingAPI?.data?.storage_field?.advance +
                billingAPI?.data?.inspection_field?.advance +
                billingAPI?.data?.delivery_field?.advance +
                billingAPI?.data?.advance_field?.advance,
              // billingAPI?.data?.irregular_field?.advance +
              // billingAPI?.data?.irregular_no_tax_field?.advance,
              不課税項目:
                billingAPI?.data?.first_bonded_field?.no_tax_price +
                billingAPI?.data?.second_bonded_field?.no_tax_price +
                billingAPI?.data?.clearance_field?.no_tax_price +
                billingAPI?.data?.storage_field?.no_tax_price +
                billingAPI?.data?.inspection_field?.no_tax_price +
                billingAPI?.data?.delivery_field?.no_tax_price +
                billingAPI?.data?.advance_field?.no_tax_price,
              // billingAPI?.data?.irregular_field?.no_tax_price +
              // billingAPI?.data?.irregular_no_tax_field?.no_tax_price,
              課税項目:
                billingAPI?.data?.first_bonded_field?.tax_price +
                billingAPI?.data?.second_bonded_field?.tax_price +
                billingAPI?.data?.clearance_field?.tax_price +
                billingAPI?.data?.storage_field?.tax_price +
                billingAPI?.data?.inspection_field?.tax_price +
                billingAPI?.data?.delivery_field?.tax_price +
                billingAPI?.data?.advance_field?.tax_price,
              // billingAPI?.data?.irregular_field?.tax_price +
              // billingAPI?.data?.irregular_no_tax_field?.tax_price,
            },
          ],
        },
        {
          sheetName: '一次上屋料金',
          data: billingAPI?.data?.first_bonded?.map((item: any) => ({
            MAWB番号: item?.mab,
            入港日: item?.ARR,
            便名: item?.VSN,
            一次上屋料金: item?.price,
          })),
          emptyData: [
            {
              MAWB番号: '',
              入港日: '',
              便名: '',
              一次上屋料金: '',
            },
          ],
        },
        {
          sheetName: '二次上屋料金',
          data: secondBondedData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            二次上屋料金: item?.second_bonded,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              二次上屋料金: '',
            },
          ],
        },
        {
          sheetName: '通関料',
          data: clearanceData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            通关料: item?.clearance,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              通关料: '',
            },
          ],
        },
        {
          sheetName: '保管料',
          data: storageData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            保管料: item?.storage,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              保管料: '',
            },
          ],
        },
        {
          sheetName: '税関検査費用',
          data: inspectionData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            税関検査費用: item?.inspection,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              税関検査費用: '',
            },
          ],
        },
        {
          sheetName: '配送料金（＊）',
          data: deliveryData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            配送料: item?.delivery,
            配送先: item?.state,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              配送料: '',
              配送先: '',
            },
          ],
        },
        {
          sheetName: '立替関税・消費税◎',
          data: advanceData?.map((item: any) => ({
            MAWB番号: item?.MAB,
            HAWB番号: item?.HAB,
            関税: item?.CUS_DTY,
            消費税: item?.CON_TAX,
            地方消費税: item?.LC_TAX,
            納税額: item?.advance,
          })),
          emptyData: [
            {
              MAWB番号: '',
              HAWB番号: '',
              関税: '',
              消費税: '',
              地方消費税: '',
              納税額: '',
            },
          ],
        },
        {
          sheetName: 'イレギュラー費用（＊）',
          data: [],
        },
        {
          sheetName: 'イレギュラー費用（不課税）',
          data: [],
        },
      ],
      title,
    );
  };

  const contentList: Record<string, React.ReactNode> = {
    billing: (
      <Table
        size="small"
        rowKey="key"
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column title="請求項目" dataIndex="field" />
        <Table.Column
          title="数量"
          dataIndex="count"
          render={(count) => (count ? `${count} 件` : '-')}
        />
        <Table.Column title="単価" dataIndex="unit_price" />
        <Table.ColumnGroup title="金額">
          <Table.Column
            title="立替項目（◎）"
            dataIndex="advance"
            render={renderPrice()}
          />
          <Table.Column
            title="不課税項目"
            dataIndex="no_tax_price"
            render={renderPrice()}
          />
          <Table.Column
            title="課税項目"
            dataIndex="tax_price"
            render={renderPrice()}
          />
        </Table.ColumnGroup>
      </Table>
    ),
    firstBonded: (
      <Table
        rowKey="_id"
        size="small"
        loading={billingAPI?.loading}
        dataSource={billingAPI?.data?.first_bonded}
        pagination={{
          total: billingAPI?.data?.first_bonded?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="mab" />
        <Table.Column width={150} title="入港日" dataIndex="ARR" />
        <Table.Column width={150} title="便名" dataIndex="VSN" />
        <Table.Column width={120} title="一次上屋料金" dataIndex="price" />
      </Table>
    ),
    secondBonded: (
      <Table
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={secondBondedData}
        pagination={{
          total: secondBondedData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
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
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={clearanceData}
        pagination={{
          total: clearanceData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="通关料" dataIndex="clearance" />
      </Table>
    ),
    storage: (
      <Table
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={storageData}
        pagination={{
          total: storageData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="保管料" dataIndex="storage" />
      </Table>
    ),
    inspection: (
      <Table
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={inspectionData}
        pagination={{
          total: inspectionData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="税関検査費用" dataIndex="inspection" />
      </Table>
    ),
    delivery: (
      <Table
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={deliveryData}
        pagination={{
          total: deliveryData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="配送料" dataIndex="delivery" />
        <Table.Column width={120} title="配送先" dataIndex="state" />
      </Table>
    ),
    advance: (
      <Table
        rowKey={(row) => row?.MAB + row?.HAB}
        size="small"
        loading={billingTabsAPI?.loading}
        dataSource={advanceData}
        pagination={{
          total: advanceData?.length,
          showTotal: (total) => <>合計: {total} 件</>,
        }}
        scroll={{ y: 'calc(100vh - 460px)' }}
      >
        <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
        <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
        <Table.Column width={120} title="関税" dataIndex="CUS_DTY" />
        <Table.Column width={120} title="消費税" dataIndex="CON_TAX" />
        <Table.Column width={120} title="地方消費税" dataIndex="LC_TAX" />
        <Table.Column width={120} title="納税額" dataIndex="advance" />
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
      <Card
        title={title}
        tabList={tabList}
        loading={createAllPriceAPI.loading}
        extra={
          <Space>
            <Button
              loading={createAllPriceAPI.loading}
              onClick={createAllPriceAPI.run}
            >
              計算
            </Button>
            <Button
              type="primary"
              loading={createAllPriceAPI.loading}
              onClick={onExport}
            >
              Export
            </Button>
          </Space>
        }
        onTabChange={onTabChange}
      >
        <>{contentList[activeTabKey]}</>
      </Card>
    </PageContainer>
  );
};

export default GenBilling;
