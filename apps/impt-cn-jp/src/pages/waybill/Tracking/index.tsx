import { useState } from 'react';
import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
  // Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { compressAndDownload } from '@/utils/helper/downloadPDF';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  updateWaybill,
  // deleteByWaybillId,
  getAllWaybillsForwarder,
  getAllPERImagesByWaybillIds,
} from '@/services/request/waybill';
import HAWBForm from '@/components/Form/HAWBForm';
import useSKForm from '@silken-houtai/core/lib/useHooks';
// import WaybillModal from './components/WaybillModal';
import WaybillModal from '@/components/Modal/WaybillModal';
import useDownloadINV from '@/services/useCTSActions/useDownloadINV';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const Tracking: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlWaybill] = useIntlFormat('waybill');
  const [intlPages] = useIntlFormat('pages');
  const [intlPerOpt] = useIntlFormat('options.permit');
  const [selectedRows, setSelectedRows] = useState<any>();
  const [fixParams, setFixParams] = useState<any>({});
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  const selectedRow = selectedRows?.length === 1 ? selectedRows[0] : null;

  // api
  const { agentOptions } = useAgentOptions();
  const { handleDownload } = useDownloadINV({ params: fixParams });
  const { userOptions } = useUserOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let { search1, search2, PER_date, ...search } = formData;
    search.PER_date_start = PER_date?.[0]?.format('YYYY/MM/DD');
    search.PER_date_end = PER_date?.[1]?.format('YYYY/MM/DD');
    if (search1?.key && search1?.value) {
      search[search1.key] = search1.value;
    }
    if (search2?.key && search2?.value) {
      search[search2.key] = search2.value;
    }
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
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
      ...removeEmpty(search),
      page,
      perPage,
      ...sorter,
    };
    setFixParams(params);
    const data = await getAllWaybillsForwarder(params);
    return {
      total: data?.totalCount,
      list: data?.waybills?.map((item: any) => ({
        ...item,
        track: item?.tracks?.[0],
        tracking: item?.trackings?.[0] || item?.trackings,
      })),
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    manual: true,
    defaultPageSize: 500,
  });
  const editWaybill = useRequest(updateWaybill, {
    manual: true,
  });
  // const deleteWaybill = useRequest(deleteByWaybillId, {
  //   manual: true,
  // });
  const downloadApi = useRequest(getAllPERImagesByWaybillIds, {
    manual: true,
    onSuccess: (data) => {
      compressAndDownload(data, dayFormat(Date(), 'YYYY-MM-DD-hh-mm'));
    },
  });

  const rowSelection: any = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys: selectedRows?.map((s: any) => s?._id) || [],
    preserveSelectedRowKeys: true,
    onChange: (_: any[], selectedRows: any[]) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: !record._id,
      name: record._id,
    }),
  };

  // action
  function handleEdit() {
    handleOpen({
      title: '編集する',
      type: 'edit',
      data: selectedRow,
    });
  }
  async function handleSubmit(v: any) {
    if (formType === 'edit') {
      await editWaybill.runAsync({
        waybillId: selectedRow._id,
        ...v,
      });
      setSelectedRows([]);
      refresh();
    }
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/waybill/Tracking',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: '通関結果' },
          ],
        },
        title: '通関結果',
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={{ search2: { key: 'HAB' } }}
      >
        <Row gutter={8}>
          <Col flex="100px">
            <Form.Item name="waybill_type">
              <Select
                allowClear
                placeholder={intlWaybill('waybill_type')}
                options={[
                  { label: 'MIC', value: 'MIC' },
                  { label: 'IDA', value: 'IDA' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="is_PER">
              <Select
                allowClear
                placeholder={intlWaybill('is_PER')}
                options={[
                  { label: intlPerOpt('is_PER.1'), value: '1' },
                  { label: intlPerOpt('is_PER.0'), value: '0' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="is_PER_image">
              <Select
                allowClear
                placeholder={intlWaybill('is_PER_image')}
                options={[
                  { label: intlPerOpt('is_PER_image.1'), value: '1' },
                  { label: intlPerOpt('is_PER_image.0'), value: '0' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder={intlWaybill('MAB')} />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item name="PER_date">
              <DatePicker.RangePicker
                placeholder={[
                  intlWaybill('PER_date_start'),
                  intlWaybill('PER_date_end'),
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name={['search1', 'key']}>
              <Select
                allowClear
                placeholder={intlWaybill('searchKey')}
                options={[
                  {
                    label: intlPerOpt('searchKey.flight_no'),
                    value: 'flight_no',
                  },
                  { label: intlPerOpt('searchKey.NO'), value: 'NO' },
                  { label: intlPerOpt('searchKey.GW'), value: 'GW' },
                  {
                    label: intlPerOpt('searchKey.tax'),
                    value: '3',
                    disabled: true,
                  },
                  {
                    label: intlPerOpt('searchKey.consumptionTax'),
                    value: '4',
                    disabled: true,
                  },
                  {
                    label: intlPerOpt('searchKey.localConsumptionTax'),
                    value: '5',
                    disabled: true,
                  },
                  {
                    label: intlPerOpt('searchKey.totalTax'),
                    value: '6',
                    disabled: true,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item name={['search1', 'value']}>
              <Input placeholder={intlWaybill('searchValue')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="EXA_DIS">
              <Select
                allowClear
                placeholder={intlWaybill('EXA_DIS')}
                options={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '3K', value: '3K' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name={['search2', 'key']}>
              <Select
                allowClear
                placeholder={intlWaybill('searchKey')}
                options={[
                  { label: intlWaybill('hawbNo'), value: 'HAB' },
                  { label: intlWaybill('declaredNo'), value: 'DEC_ID' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name={['search2', 'value']}>
              <Input placeholder={intlWaybill('searchValue2')} />
            </Form.Item>
          </Col>
          <Col flex="160px">
            <Form.Item>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  {intlPages('search.submit')}
                </Button>
                <Button onClick={search.reset}>
                  {intlPages('search.reset')}
                </Button>
                <Button onClick={() => handleDownload(true)}>Print INV2</Button>
                <Button onClick={() => handleDownload()}>Print INV&BL</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <HAWBForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title={<>合計: {tableProps.pagination.total} 件</>}
        extra={
          <Space>
            <span>selected: {selectedRows?.length || 0} items</span>
            <Button
              size="small"
              type="link"
              onClick={() => setSelectedRows(null)}
            >
              clear
            </Button>
            <Button
              type="primary"
              loading={downloadApi.loading}
              disabled={!selectedRows?.length}
              onClick={() =>
                downloadApi.run({
                  waybillIds: selectedRows?.map((item: any) => item?._id),
                })
              }
            >
              {intlWaybill('permit')}
            </Button>
            <Button
              type="primary"
              disabled={selectedRows?.length !== 1}
              onClick={handleEdit}
            >
              編集
            </Button>
            {/* <Popconfirm
              title={`【選択したHAWBをすべて削除しますか?`}
              onConfirm={async () => {
                for await (const iterator of selectedRows) {
                  await deleteWaybill.runAsync({
                    waybillId: iterator?._id,
                  });
                }
                setSelectedRows([]);
                refresh();
              }}
              okButtonProps={{
                loading: deleteWaybill.loading,
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button disabled={!selectedRows?.length} danger>
                削除
              </Button>
            </Popconfirm> */}
          </Space>
        }
      >
        <Table
          size="small"
          rowSelection={rowSelection}
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 2800 }}
        >
          <Table.Column
            sorter
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column
            sorter
            width={150}
            title="Uploader"
            dataIndex="uploader"
            render={(uploaderId) =>
              userOptions?.find((item) => item?.value === uploaderId)?.label
            }
          />
          <Table.Column
            width={250}
            title={intlWaybill('hawbNo')}
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column
            sorter
            width={150}
            title={intlWaybill('mawbNo')}
            dataIndex="MAB"
          />
          <Table.Column
            width={100}
            title={intlWaybill('permit')}
            render={(row) =>
              !!row?.is_PER_image && (
                <Button
                  size="small"
                  type="primary"
                  loading={downloadApi.loading}
                  onClick={() =>
                    downloadApi.run({
                      waybillIds: [row._id],
                    })
                  }
                >
                  {intlWaybill('permit')}
                </Button>
              )
            }
          />
          {/* <Table.Column width={120} title="コメント" /> */}
          <Table.Column
            width={150}
            title={intlWaybill('EXA_DIS')}
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column
            sorter
            width={80}
            title={intlWaybill('waybill_type')}
            dataIndex="waybill_type"
          />
          <Table.Column sorter width={100} title="仕出地" dataIndex="PSC" />
          <Table.Column
            sorter
            width={120}
            title="FLIGHT NO"
            dataIndex="flight_no"
          />
          <Table.Column
            sorter
            width={120}
            title="FLIGHT DATE"
            dataIndex="DATE"
            render={(DATE) => dayFormat(DATE, 'YYYY.MM.DD')}
          />
          <Table.Column
            width={180}
            title={intlWaybill('declaredNo')}
            dataIndex={['tracking', 'ID']}
          />
          <Table.Column
            sorter
            width={80}
            title={intlWaybill('PCS')}
            dataIndex="PCS"
          />
          <Table.Column
            sorter
            width={120}
            title={intlWaybill('GW')}
            dataIndex="GW"
          />
          <Table.Column
            width={150}
            title={intlWaybill('tax')}
            dataIndex={['tracking', 'CUS_DTY']}
          />
          <Table.Column
            width={150}
            title={intlWaybill('consumptionTax')}
            dataIndex={['tracking', 'CON_TAX']}
          />
          <Table.Column
            width={150}
            title={intlWaybill('localConsumptionTax')}
            dataIndex={['tracking', 'LC_TAX']}
          />
          <Table.Column
            width={150}
            title={intlWaybill('totalTax')}
            render={(row) =>
              Number(row?.tracking?.CUS_DTY || 0) +
              Number(row?.tracking?.CON_TAX || 0) +
              Number(row?.tracking?.LC_TAX || 0)
            }
          />
          <Table.Column
            sorter
            width={150}
            title={intlWaybill('createdAt')}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Tracking;
