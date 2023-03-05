import { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
////
import CTSSearch from '@/components/Search/CTSSearch';
import { useCTS } from '@/services/useCTS';
import { updateWaybill } from '@/services/request/waybill';
import { getUserInfo } from '@/services/useStorage';

export default () => {
  const { form, state, tableProps, search, refreshAsync } = useCTS('M', {
    defaultPageSize: 5,
    pagination: {
      showSizeChanger: false,
    },
  });
  const userInfo = getUserInfo();
  const [loading, setLoading] = useState(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<API.Waybill[]>();

  useEffect(() => {
    if (!tableProps.loading) {
      setEditableRowKeys(tableProps.dataSource.map((item) => item?._id));
      setDataSource(() => tableProps.dataSource);
    }
  }, [tableProps.loading]);

  async function handleSubmit(waybill_status: number) {
    return Promise.all(
      state.selectedRowKeys?.map(async (item) => {
        const values = dataSource?.find((d) => d?._id === item);
        if (values) {
          const newREF = `${values?.REF ? values.REF + ' ' : ''}${
            userInfo?.initialName
          }`;
          await updateWaybill({
            ...values,
            waybillId: item,
            user: userInfo?._id,
            process_status: 4,
            process_type: 2,
            waybill_status,
            REF: newREF?.length > 20 ? values?.REF || '' : newREF,
          });
        }
      }),
    );
  }

  const columns: ProColumns<API.Waybill>[] = [
    {
      title: '32.HAB',
      dataIndex: 'HAB',
      fixed: 'left',
      width: 200,
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    // {
    //   title: 'STATUS',
    //   key: 'waybill_status',
    //   // dataIndex: 'waybill_status',
    //   valueType: 'select',
    //   valueEnum: {
    //     all: { text: 'SendBack', status: 'Default' },
    //     open: {
    //       text: 'Hold',
    //       status: 'Error',
    //     },
    //     closed: {
    //       text: 'Accept',
    //       status: 'Success',
    //     },
    //   },
    // },
    { width: 100, title: '34.NO', dataIndex: 'NO' },
    { width: 100, title: '35.GW', dataIndex: 'GW' },
    { width: 500, sorter: true, title: '50.CMN', dataIndex: 'CMN' },
    { width: 200, title: '9.ImpCode', dataIndex: 'ImpCode' },
    { width: 200, title: '10.ImpNameJP', dataIndex: 'ImpNameJP' },
    { width: 250, title: '10.ImpName', dataIndex: 'ImpName' },
    { width: 200, title: '16.Tel', dataIndex: 'Tel' },
    { width: 800, title: '17.IADJP', dataIndex: 'IADJP' },
    { width: 800, title: '17.IAD', dataIndex: 'IAD' },
    { width: 300, title: '12.Add1', dataIndex: 'Add1' },
    { width: 300, title: '13.Add2', dataIndex: 'Add2' },
    { width: 300, title: '14.Add3', dataIndex: 'Add3' },
    { width: 150, title: '40.IP1', dataIndex: 'IP1' },
    { width: 150, title: '41.IP2', dataIndex: 'IP2' },
    { width: 150, title: '42.IP3', dataIndex: 'IP3' },
    { width: 150, title: '43.IP4', dataIndex: 'IP4' },
    { width: 250, title: '53.NT1', dataIndex: 'NT1' },
    { width: 150, title: '44.FR1', dataIndex: 'FR1' },
    { width: 150, title: '45.FR2', dataIndex: 'FR2' },
    { width: 150, title: '46.FR3', dataIndex: 'FR3' },
    { width: 150, title: '47.IN1', dataIndex: 'IN1' },
    { width: 150, title: '48.IN2', dataIndex: 'IN2' },
    { width: 150, title: '49.IN3', dataIndex: 'IN3' },
  ];

  return (
    <>
      <CTSSearch form={form} search={search} />
      <EditableProTable<API.Waybill>
        headerTitle="Broker Check"
        columns={columns}
        rowKey="_id"
        scroll={{
          x: 3000,
        }}
        value={dataSource}
        loading={tableProps.loading}
        rowSelection={tableProps.rowSelection}
        pagination={tableProps.pagination}
        onChange={(v) => {
          tableProps.onChange(v);
          setDataSource(v);
        }}
        recordCreatorProps={false}
        toolBarRender={() => {
          return [
            <Button
              key="send"
              loading={loading}
              onClick={async () => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(state.selectedRowKeys);
                console.log(dataSource);
                setLoading(true);
                await handleSubmit(3);
                state.handleClear();
                await refreshAsync();
                setLoading(false);
              }}
            >
              SendBack
            </Button>,
            <Button
              type="primary"
              key="accept"
              loading={loading}
              onClick={async () => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(state.selectedRowKeys);
                console.log(dataSource);
                setLoading(true);
                await handleSubmit(1);
                state.handleClear();
                await refreshAsync();
                setLoading(false);
              }}
            >
              Accept
            </Button>,
          ];
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          // actionRender: (row, config, defaultDoms) => {
          //   return [defaultDoms.delete];
          // },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
};
