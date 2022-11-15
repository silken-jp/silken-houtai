import { useState } from 'react';
import {
  Form,
  Table,
  Input,
  Tag,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
} from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import ExportXlsx from '@/components/Export/ExportXlsx';
import { getAgentInfo } from '@/services/useStorage';
import { useIntlFormat } from '@/services/useIntl';
import {
  getAllPERImagesByWaybillIds,
  getAllWaybillsForwarder,
} from '@/services/request/waybill';
import { dayFormat } from '@/utils/helper/day';
import TrackModal from '@/components/Modal/TrackModal';
import { TrackingCode } from '@/utils/constant';
import { compressAndDownload } from '@/utils/helper/downloadPDF';

const waybill: React.FC = () => {
  // state
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [intlWaybill] = useIntlFormat('waybill');
  const [intlPages] = useIntlFormat('pages');
  const [intlPerOpt] = useIntlFormat('options.permit');
  const agentInfo = getAgentInfo();

  // api
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
      agent: agentInfo._id,
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
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  const downloadApi = useRequest(getAllPERImagesByWaybillIds, {
    manual: true,
    onSuccess: (data) => {
      compressAndDownload(data, dayFormat(Date(), 'YYYY-MM-DD-hh-mm'));
    },
  });

  //action
  const handleClear = () => {
    setSelectedRowKeys([]);
  };
  const rowSelection: TableRowSelection<API.Issue> = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: any[], rows: any[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <PageContainer
      header={{
        title: intlMenu('CSManagement.permit'),
        breadcrumb: {
          routes: [
            {
              path: 'cn-to-jp/CSManagement/permit',
              breadcrumbName: intlMenu('CSManagement'),
            },
            {
              path: '',
              breadcrumbName: intlMenu('CSManagement.permit'),
            },
          ],
        },
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
      <Card
        title={
          <ExportXlsx
            count={tableProps.pagination.total}
            handleRun={async () => {
              let total = tableProps.pagination.total;
              let current = 1;
              let list: any[] = [];
              while (total > 0) {
                const res = await getTableData(
                  { current, pageSize: 5000 },
                  form.getFieldsValue(true),
                );
                if (res?.list?.length > 0) {
                  list = [...list, ...res?.list];
                } else throw 'fetch error';
                current++;
                total = total - 5000;
              }
              return {
                total: tableProps.pagination.total,
                list,
              };
            }}
          />
        }
        extra={
          <Space>
            <span>selected: {selectedRowKeys?.length || 0} items</span>
            <Button size="small" type="link" onClick={handleClear}>
              {intlPages('form.clear')}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                downloadApi.run({
                  waybillIds: selectedRowKeys,
                })
              }
            >
              {intlPages('action.permit')}
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          rowSelection={rowSelection}
          scroll={{ x: 6000, y: 'calc(100vh - 580px)' }}
        >
          <Table.Column
            sorter
            width={120}
            title={intlWaybill('inquiryNo')}
            dataIndex="HAB"
          />
          <Table.Column
            width={200}
            title={intlWaybill('track')}
            render={(row) => {
              return <TrackModal dataSource={row?.track} />;
            }}
          />
          {/* <Table.Column width={120} title="コメント" /> */}
          <Table.Column
            width={150}
            title={intlWaybill('EXA_DIS')}
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column
            width={200}
            title={intlWaybill('status')}
            render={(row) =>
              row?.tracking?.trackingHistory?.map((item: any, key: any) => (
                <Tag key={key} color="blue">
                  {TrackingCode[item?.TKG_CD as keyof typeof TrackingCode]}
                  {'：' + item?.TKG_DT}
                </Tag>
              ))
            }
          />
          <Table.Column
            width={100}
            title={intlWaybill('permit')}
            render={(row) =>
              !!row?.is_PER_image && (
                <Button
                  size="small"
                  type="primary"
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
          {/* <Table.Column width={150} title="配送業者" /> */}
          {/* <Table.Column width={150} title="タイプ" /> */}
          <Table.Column
            sorter
            width={80}
            title={intlWaybill('waybill_type')}
            dataIndex="waybill_type"
          />
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
            render={() => 0}
          />
          <Table.Column
            width={150}
            title={intlWaybill('consumptionTax')}
            render={() => 0}
          />
          <Table.Column
            width={150}
            title={intlWaybill('localConsumptionTax')}
            render={() => 0}
          />
          <Table.Column
            width={150}
            title={intlWaybill('totalTax')}
            render={() => 0}
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

export default waybill;
