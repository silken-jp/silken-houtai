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
  DatePicker,
} from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { getAgentInfo } from '@/services/useStorage';
import { getStatusInquiry } from '@/services/request/waybill';
import { removeEmpty } from '@/utils/helper/helper';
import useExportMABXlsx from '@/services/useExportMABXlsx';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const { exportMABApi, handleExportMAB } = useExportMABXlsx(selectedRows);

  // store
  const agentInfo = getAgentInfo();
  const agentId = agentInfo?._id;

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'flightDate';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getStatusInquiry({
      page,
      perPage,
      agentId,
      ...sorter,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // actions
  const handleClear = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };
  const handleExportALL = () => {
    exportMABApi.run(
      removeEmpty({
        ...form.getFieldsValue(),
        flightStartDate: form
          .getFieldValue('flightStartDate')
          ?.format('YYYY.MM.DD'),
        flightEndDate: form
          .getFieldValue('flightEndDate')
          ?.format('YYYY.MM.DD'),
      }),
    );
  };

  const rowSelection: TableRowSelection<API.Waybill> = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: any[], rows: any[]) => {
      setSelectedRows(rows);
      setSelectedRowKeys(keys);
    },
  };

  return (
    <PageContainer
      title={agentInfo?.name}
      header={{
        breadcrumb: {
          routes: [
            { path: '/cts/StatusInquiry', breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Status Inquiry' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="flightNo">
              <Input placeholder="FlightNo" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightStartDate">
              <DatePicker placeholder="flight start date" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightEndDate">
              <DatePicker placeholder="flight end date" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
              <Button onClick={handleExportALL} loading={exportMABApi.loading}>
                Export(一括)
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        extra={
          <Space>
            <span>selected: {selectedRowKeys?.length || 0} items</span>
            <Button size="small" type="link" onClick={handleClear}>
              clear
            </Button>
            <Button onClick={handleExportMAB}>Export</Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          rowSelection={rowSelection}
          scroll={{ x: 2000, y: 'calc(100vh - 500px)' }}
        >
          <Table.Column sorter width={180} title="MAWB番号" dataIndex="_id" />
          <Table.Column
            sorter
            width={150}
            title="FlightNo"
            dataIndex="flightNo"
          />
          <Table.Column
            sorter
            width={150}
            title="FlightDate"
            dataIndex="flightDate"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={120} title="件数" dataIndex="NOCount" />
          <Table.Column
            sorter
            width={150}
            title="未申告件数"
            dataIndex="notDecNo"
          />
          <Table.ColumnGroup title="許可件数">
            <Table.Column
              sorter
              width={120}
              title="MIC許可"
              dataIndex="micPerNo"
            />
            <Table.Column
              sorter
              width={120}
              title="IDC許可"
              dataIndex="idaPerNo"
            />
            <Table.Column
              sorter
              width={120}
              title="未許可"
              dataIndex="notPerNo"
            />
          </Table.ColumnGroup>
          <Table.ColumnGroup title="許可・審査・検査区分">
            <Table.Column
              sorter
              width={150}
              title="許可率（区分１）"
              dataIndex="count1"
              render={(_, row: any) =>
                `${((row?.count1 * 100) / row?.NOCount || 0)?.toFixed(2)}% (${
                  row?.count1
                })`
              }
            />
            <Table.Column
              sorter
              width={150}
              title="審査率（区分２）"
              dataIndex="count2"
              render={(_, row: any) =>
                `${((row?.count2 * 100) / row?.NOCount || 0)?.toFixed(2)}% (${
                  row?.count2
                })`
              }
            />
            <Table.Column
              width={150}
              title="検査率（区分３）"
              render={(_, row: any) =>
                `${(
                  ((row?.count3 + row?.count3K) * 100) / row?.NOCount || 0
                )?.toFixed(2)} (${row?.count3 + row?.count3K})%`
              }
            />
          </Table.ColumnGroup>
          <Table.Column
            sorter
            width={150}
            title="個数"
            dataIndex="waybillCount"
          />
          <Table.Column
            sorter
            width={150}
            title="重量（KG）"
            dataIndex="GWCount"
            render={(GWCount) => GWCount?.toFixed(2)}
          />
          {/* <Table.Column sorter width={180} title="ショート" />
          <Table.Column sorter width={180} title="オーバー" /> */}
          {/* <Table.Column sorter width={180} title="MIC許可" />
          <Table.Column sorter width={180} title="MIC未許可" />
          <Table.Column sorter width={180} title="IDC許可" />
          <Table.Column sorter width={180} title="IDC未許可" />
          <Table.Column sorter width={180} title="HAWB未許可" /> */}
          <Table.Column
            sorter
            width={180}
            title="登録時間"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default StatusInquiry;
