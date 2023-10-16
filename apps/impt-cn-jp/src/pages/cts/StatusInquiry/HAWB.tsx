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
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  updateWaybill,
  deleteByWaybillId,
  getAllWaybillsForwarder,
} from '@/services/request/waybill';
import HAWBForm from '@/components/Form/HAWBForm';
import useSKForm from '@silken-houtai/core/lib/useHooks';

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [intlWaybill] = useIntlFormat('waybill');
  const [intlPages] = useIntlFormat('pages');
  const [intlPerOpt] = useIntlFormat('options.permit');
  const [selectedRows, setSelectedRows] = useState<any>();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  const selectedRow = selectedRows?.length === 1 ? selectedRows[0] : null;

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
      sorter.sortOrder = -1;
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
      ...sorter,
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
              path: '/cts/StatusInquiry/HAWB',
              breadcrumbName: intlMenu('cts'),
            },
            { path: '', breadcrumbName: 'HAWB Status Inquiry' },
          ],
        },
        title: 'HAWB Status Inquiry',
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
          {/* <Col flex="100px">
            <Form.Item>
              <Select
                allowClear
                placeholder="納税"
                options={[
                  { label: '有税', value: '1', disabled: true },
                  { label: '無税', value: '2', disabled: true },
                ]}
              />
            </Form.Item>
          </Col> */}
          {/* <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="配送業者"
                options={[{ label: '佐川急便', value: '1' }]}
              />
            </Form.Item>
          </Col> */}
          <Col flex="160px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                {intlPages('search.submit')}
              </Button>
              <Button onClick={search.reset}>
                {intlPages('search.reset')}
              </Button>
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
          <Table.Column
            sorter
            width={150}
            title={intlWaybill('hawbNo')}
            dataIndex="HAB"
          />
          <Table.Column
            sorter
            width={150}
            title={intlWaybill('mawbNo')}
            dataIndex="MAB"
          />
          <Table.Column sorter width={250} title="品名" dataIndex="CMN" />
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
            width={100}
            title="FLIGHT NO"
            dataIndex="flight_no"
          />
          <Table.Column
            sorter
            width={100}
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
            width={100}
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

export default SimpleStatusInquiry;
