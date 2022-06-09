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
import { getAllTrackings } from './request/tracking';

export const useCTS = (LS: 'L' | 'S' | 'M') => {
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('1');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    totalCount: 0,
    cleansingCount: 0,
    brokerCount: 0,
    createCount: 0,
    tabCount: [0, 0, 0, 0],
  });
  const tabArr = [
    {
      key: '1',
      tab: `Normal(${meta?.tabCount?.[1] || 0})`,
    },
    {
      key: '2',
      tab: `Hold(${meta?.tabCount?.[2] || 0})`,
    },
    {
      key: '3',
      tab: `SendBack(${meta?.tabCount?.[3] || 0})`,
    },
    {
      key: '0',
      tab: `Other(${meta?.tabCount?.[0] || 0})`,
    },
  ];

  // query
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'createAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const params = {
      ...formData,
      ...sorter,
      waybill_status: +tabKey,
      page,
      perPage,
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
    const { trackings = [] } = await getAllTrackings({
      page: 0,
      perPage,
      BL_: data?.waybills?.map((item: any) => item?.HAB).join(' '),
    });
    setMeta({
      totalCount: data?.totalCount || 0,
      cleansingCount: data?.cleansingCount || 0,
      brokerCount: data?.brokerCount || 0,
      createCount: data?.createCount || 0,
      tabCount: data?.tabCount || [0, 0, 0, 0],
    });
    return {
      total: data?.totalCount,
      list: data?.waybills?.map((item: any) => {
        const temp = trackings?.find((t: any) => t?.BL_ === item?.HAB);
        let tracking = temp?.trackingHistory?.reduce((a: any, b: any) => {
          return { ...a, [b?.TKG_CD]: b?.TKG_DT };
        }, temp);
        return { ...item, tracking };
      }),
    };
  };

  useEffect(() => {
    const params = getSearchParams(LS);
    form.setFieldsValue({ ...params });
  }, []);

  const { tableProps, search } = useAntdTable(getTableData, { form });

  const handleTabChange = (key: any) => {
    setTabKey(key);
    handleClear();
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
    onChange: (keys: any[], rows: any[]) => {
      setSelectedParams(LS, keys);
      setSelectedRows(rows);
      setSelectedRowKeys(keys);
    },
  };

  return {
    form,
    search,
    state: {
      tabKey,
      meta,
      selectedRows,
      handleClear,
    },
    tableProps: {
      ...tableProps,
      pagination: {
        ...tableProps.pagination,
        pageSizeOptions: ['10', '20', '50', '100', '500'],
      },
      rowSelection,
    },
    disActions: {
      cleansing: form.getFieldValue('status') !== '0',
      brock: form.getFieldValue('status') !== '2' || tabKey !== '1',
      create:
        !form.getFieldValue('mawbs') || !(tableProps?.dataSource?.length > 0),
    },
    cardProps: {
      tabList: tabArr,
      onTabChange: handleTabChange,
      activeTabKey: tabKey,
    },
  };
};
