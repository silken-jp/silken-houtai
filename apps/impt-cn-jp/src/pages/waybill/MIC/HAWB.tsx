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
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  updateWaybill,
  deleteByWaybillId,
  getAllWaybillsForwarder,
} from '@/services/request/waybill';
import usePERImage from '@/services/useCTSActions/usePERImage';
import WaybillModal from './components/WaybillModal';
import HAWBForm from './components/HAWBForm';
import PERImage from './components/PERImage';

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlWaybill] = useIntlFormat('waybill');
  const [intlPerOpt] = useIntlFormat('options.permit');
  const [selectedRows, setSelectedRows] = useState<any>();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  const selectedRow = selectedRows?.length === 1 ? selectedRows[0] : null;

  const { PERImageApi } = usePERImage([]);

  // api
  const { agentOptions } = useAgentOptions();
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
    const data = await getAllWaybillsForwarder({
      ...JSON.parse(JSON.stringify(search), (_, value) =>
        value === null || value === '' ? undefined : value,
      ),
      page,
      perPage,
      waybill_type: 'MIC',
      ...sorter,
      MAB: '09897507572',
    });
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
  const deleteWaybill = useRequest(deleteByWaybillId, {
    manual: true,
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
      title: '編集',
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
              path: '/waybill/MIC/HAWB',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: 'MIC' },
            { path: '', breadcrumbName: 'HAWB' },
          ],
        },
        title: 'MIC - HAWB',
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
                placeholder="識別"
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
                placeholder="通関結果"
                options={[
                  { label: '許可', value: '1' },
                  { label: '未許可', value: '0' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="is_PER_image">
              <Select
                allowClear
                placeholder="許可書有無"
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
          {/* <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="タイプ"
                options={[
                  { label: 'BtoC', value: 'BtoC', disabled: true },
                  { label: 'BtoB', value: 'BtoB', disabled: true },
                  {
                    label: 'AMAZON FBA',
                    value: 'AMAZON FBA',
                    disabled: true,
                  },
                ]}
              />
            </Form.Item>
          </Col> */}
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
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
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
            <Button type="primary" disabled={!selectedRow} onClick={handleEdit}>
              編集
            </Button>
            <Popconfirm
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
            </Popconfirm>
          </Space>
        }
      >
        <Table
          size="small"
          rowSelection={rowSelection}
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 3000 }}
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
          <Table.Column sorter width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column
            width={100}
            title="INV&BL"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column
            width={100}
            title="許可書"
            render={(row) => <PERImage dataSource={row} />}
          />
          <Table.Column sorter width={150} title="MAWB番号" dataIndex="MAB" />
          <Table.Column sorter width={250} title="品名" dataIndex="CMN" />
          <Table.Column
            width={150}
            title="審査検査区分"
            dataIndex={['tracking', 'EXA_DIS']}
          />
          {/* <Table.Column
            sorter
            width={80}
            title="識別"
            dataIndex="waybill_type"
          /> */}
          <Table.Column sorter width={100} title="仕出地" dataIndex="PSC" />
          <Table.Column
            sorter
            width={100}
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
            title="申告番号"
            dataIndex={['tracking', 'ID']}
          />
          <Table.Column sorter width={80} title="個数" dataIndex="PCS" />
          <Table.Column sorter width={100} title="重量(KG)" dataIndex="GW" />
          <Table.Column width={150} title="関税" render={() => 0} />
          <Table.Column width={150} title="消費税" render={() => 0} />
          <Table.Column width={150} title="地方消費税" render={() => 0} />
          <Table.Column width={150} title="納税額合計" render={() => 0} />
          <Table.Column
            sorter
            width={150}
            title="登録日時"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default SimpleStatusInquiry;
