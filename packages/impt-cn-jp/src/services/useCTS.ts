import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { useAntdTable } from 'ahooks';
import { TableRowSelection } from 'antd/lib/table/interface';
////
import { getAllWaybillsAdvance } from '@/services/request/waybill';
import {
  getSearchParams,
  setSearchParams,
  setSelectedParams,
} from '@/services/useStorage';

// waybill_status ["Other","Normal","Hold","SendBack"];
const tabList = {
  L: [
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
  ],
  S: [
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
  ],
  M: [
    { tab: 'MIC', key: 'MIC', value: { waybill_status: 1 } },
    { tab: 'Hold', key: 'Hold', value: { waybill_status: 2 } },
    { tab: 'SendBack', key: 'SendBack', value: { waybill_status: 3 } },
    { tab: 'Other', key: 'Other', value: { waybill_status: 0 } },
  ],
};

export const useCTS = (LS: 'L' | 'S' | 'M') => {
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState(LS === 'M' ? 'MIC' : 'AID');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    totalCount: 0,
    cleansingCount: 0,
    brokerCount: 0,
    createCount: 0,
  });
  const tabValues = tabList[LS]?.find(({ key }) => key === tabKey)?.value || {};
  // query
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const params = {
      ...formData,
      ...tabValues,
      page,
      perPage,
      sortField: 'createdAt',
      sortOrder: -1,
      LS,
      clsStartDate: formData?.clsStartDate?.toString(),
      clsEndDate: formData?.clsEndDate?.toString(),
      brcStartDate: formData?.brcStartDate?.toString(),
      brcEndDate: formData?.brcEndDate?.toString(),
      crtStartDate: formData?.crtStartDate?.toString(),
      crtEndDate: formData?.crtEndDate?.toString(),
    };
    setSearchParams(LS, params);
    const data = await getAllWaybillsAdvance(params);
    setMeta({
      totalCount: data?.totalCount || 0,
      cleansingCount: data?.cleansingCount || 0,
      brokerCount: data?.brokerCount || 0,
      createCount: data?.createCount || 0,
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
  };

  useEffect(() => {
    const params = getSearchParams(LS);
    form.setFieldsValue({ ...params });
  }, []);

  const { tableProps, search } = useAntdTable(getTableData, { form });

  const handleTabChange = (key: string) => {
    setTabKey(key);
    search.submit();
  };

  const handleClear = () => {
    setSelectedParams(LS, []);
    setSelectedRowKeys([]);
  };

  const rowSelection: TableRowSelection<API.Waybill> = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: any) => {
      setSelectedParams(LS, keys);
      setSelectedRowKeys(keys);
    },
  };

  return {
    form,
    search,
    state: {
      tabKey,
      meta,
      handleClear,
    },
    tableProps: {
      ...tableProps,
      rowSelection,
    },
    disActions: {
      cleansing: form.getFieldValue('status') !== '0',
      brock: form.getFieldValue('status') !== '2',
      create: !form.getFieldValue('mawbs'),
    },
    cardProps: {
      tabList: tabList[LS],
      onTabChange: handleTabChange,
      activeTabKey: tabKey,
    },
  };
};
