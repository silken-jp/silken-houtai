import { useEffect } from 'react';
import { Form } from 'antd';
import { useAntdTable } from 'ahooks';
import dayjs from 'dayjs';
////
import { getAllWaybillsAdvance } from '@/services/request/waybill';
import {
  getSearchParams,
  setSearchParams,
  setSelectedParams,
} from '@/services/useStorage';

function getDayData(params: string) {
  return params ? dayjs(params) : undefined;
}

export const useMutiBrokerCheck = (LS: 'L' | 'S' | 'M', options?: any) => {
  const [form] = Form.useForm();

  // query
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else if (!!pageData?.sorter?.field) {
      sorter.sortField = pageData?.sorter?.field;
    } else {
      sorter.sortField = 'createdAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const params = {
      LS,
      page,
      perPage,
      ...sorter,
      ...formData,
      clsStartDate: formData?.clsStartDate?.toString(),
      clsEndDate: formData?.clsEndDate?.toString(),
      brcStartDate: formData?.brcStartDate?.toString(),
      brcEndDate: formData?.brcEndDate?.toString(),
      crtStartDate: formData?.crtStartDate?.toString(),
      crtEndDate: formData?.crtEndDate?.toString(),
    };
    setSearchParams(LS, params);
    const data = await getAllWaybillsAdvance(params);
    return {
      total: data?.totalCount,
      list: data?.waybills,
    };
  };

  useEffect(() => {
    const {
      page = 0,
      perPage = 10,
      sortField,
      sortOrder,
      ...params
    } = getSearchParams(LS);
    form.setFieldsValue({
      ...params,
      clsStartDate: getDayData(params?.clsStartDate),
      clsEndDate: getDayData(params?.clsEndDate),
      brcStartDate: getDayData(params?.brcStartDate),
      brcEndDate: getDayData(params?.brcEndDate),
      crtStartDate: getDayData(params?.crtStartDate),
      crtEndDate: getDayData(params?.crtEndDate),
    });
    run(
      {
        current: page + 1,
        pageSize: options?.defaultPageSize || 3,
        sorter: {
          field: sortField,
          order: sortOrder,
        },
      },
      params,
    );
  }, []);

  const { tableProps, search, refreshAsync, run } = useAntdTable(getTableData, {
    form,
    manual: true,
    defaultPageSize: options?.defaultPageSize || 100,
  });

  const handleClear = () => {
    setSelectedParams(LS, []);
  };

  return {
    form,
    search,
    refreshAsync,
    state: {
      handleClear,
    },
    tableProps: {
      ...tableProps,
      pagination: {
        ...tableProps.pagination,
        ...options?.pagination,
      },
    },
  };
};
