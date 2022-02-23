import { useState } from 'react';
import { Form, Table, Card, Space } from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import Create from '@/components/Common/Create';
import Cleansing from '@/components/Common/Cleansing';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import UploadWaybill from '@/components/Common/UploadWaybill';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills, countWaybills } from '@/services/request/waybill';
import { findLastPH } from '@/utils/helper';

const tabList = [
  { tab: 'AID', key: 'AID', value: { waybill_status: 1 } },
  { tab: 'ASD', key: 'ASD', value: { waybill_status: 1 } },
  { tab: 'AHK', key: 'AHK', value: { waybill_status: 1 } },
  { tab: 'AHT', key: 'AHT', value: { waybill_status: 1 } },
  { tab: 'AIS', key: 'AIS', value: { waybill_status: 1 } },
  { tab: 'AIW', key: 'AIW', value: { waybill_status: 1 } },
  { tab: 'AST', key: 'AST', value: { waybill_status: 1 } },
  { tab: 'Hold', key: 'Hold', value: { waybill_status: 2 } },
  { tab: 'SendBack', key: 'SendBack', value: { waybill_status: 3 } },
  { tab: 'Other', key: 'Other', value: { waybill_status: 0 } },
];

const LargeWaybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('AID');
  const tabParams = tabList?.find(({ key }) => key === tabKey)?.value || {};
  // query
  const getTableData = async (pageData: any, formData: any): Promise<API.Result> => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllWaybills({
      page,
      perPage,
      LS: 'L',
      waybill_type: 0,
      ...formData,
      MAB: formData?.MAB || '',
      ...tabParams,
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form, manual: true });

  const countWaybillsAPI = useRequest(countWaybills, { manual: true });

  const handleTabChange = (key: string) => {
    setTabKey(key);
    search.submit();
  };

  const fixSearch = {
    ...search,
    submit: async () => {
      await search.submit();
      const formData = form.getFieldsValue();
      await countWaybillsAPI.run({
        LS: 'L',
        waybill_type: 0,
        ...formData,
        MAB: formData?.MAB || '',
        ...tabParams,
      });
    },
  };

  return (
    <PageContainer
      header={{
        title: 'Large',
        breadcrumb: {
          routes: [
            { path: `/cts/large`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Large' },
          ],
        },
        extra: <UploadWaybill onUpload={search.submit} />,
      }}
    >
      <CTSSearch form={form} search={fixSearch} {...tabParams} />

      <CTSStatus {...countWaybillsAPI} type="IDA" />

      <Card
        tabList={tabList}
        onTabChange={handleTabChange}
        activeTabKey={tabKey}
        tabBarExtraContent={
          <Space>
            <Cleansing LS="L" MAB={form.getFieldValue('MAB')} />
            <Create type="IDA" large disabled={!form.getFieldValue('MAB')} />
          </Space>
        }
      >
        <Table rowKey="_id" {...tableProps} scroll={{ x: 2000 }}>
          <Table.Column title="HAWB番号" render={(row) => <WaybillModal dataSource={row} />} />
          <Table.Column title="MAWB番号" dataIndex="MAB" />
          {tabKey === 'Other' && <Table.Column title="コントローラー" dataIndex="" />}
          <Table.Column title="書類作成者" dataIndex="" />
          <Table.Column
            title="クレンザー"
            render={(row) => findLastPH(row?.process_histories, 1)?.name}
          />
          <Table.Column
            title="クレンジング時間"
            render={(row) => findLastPH(row?.process_histories, 1)?.time}
          />
          <Table.Column
            title="クリエーター"
            render={(row) => findLastPH(row?.process_histories, 2)?.name}
          />
          <Table.Column
            title="クリエート時間"
            render={(row) => findLastPH(row?.process_histories, 2)?.time}
          />
          <Table.Column
            title="ブローカー"
            render={(row) => findLastPH(row?.process_histories, 3)?.name}
          />
          <Table.Column
            title="ブローカーチェック時間"
            render={(row) => findLastPH(row?.process_histories, 3)?.time}
          />
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

export default LargeWaybill;
