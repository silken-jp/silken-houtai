import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Popconfirm,
  DatePicker,
  Select,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  deleteALLWaybillsByMAWB,
  getStatusInquiry,
} from '@/services/request/waybill';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [selectedRow, setSelectedRow] = useState<any>();

  // api
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();
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
      ...sorter,
      ...formData,
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 100,
  });
  const deleteALLWaybills = useRequest(deleteALLWaybillsByMAWB, {
    manual: true,
  });

  const rowSelection: any = {
    type: 'radio',
    onChange: (_: any[], [selectedRow]: any[]) => {
      setSelectedRow(selectedRow);
    },
    getCheckboxProps: (record: any) => ({
      disabled: !record._id,
      name: record._id,
    }),
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/cts/StatusInquiry/StatusInquiry',
              breadcrumbName: intlMenu('cts'),
            },
            { path: '', breadcrumbName: 'Full Status Inquiry' },
          ],
        },
        title: 'Full Status Inquiry',
        // extra: <UploadImages />,
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={{
          flightStartDate: dayjs().add(-10, 'day').startOf('day'),
          flightEndDate: dayjs(),
        }}
      >
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agentId">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="PSC">
              <Input allowClear placeholder="仕出地" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="uploader">
              <Select allowClear placeholder="Uploader" options={userOptions} />
            </Form.Item>
          </Col>
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
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        title={<>合計: {tableProps.pagination.total} 件</>}
        extra={
          <Popconfirm
            title={`【MAWB番号 ${selectedRow?._id} 合${selectedRow?.waybillCount}個 】 を全て削除しますか?`}
            onConfirm={async () => {
              await deleteALLWaybills.runAsync({
                mawb: selectedRow?._id,
              });
              setSelectedRow(null);
              refresh();
            }}
            okButtonProps={{
              loading: deleteALLWaybills.loading,
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={!selectedRow} type="primary">
              削除
            </Button>
          </Popconfirm>
        }
      >
        <Table
          size="small"
          rowSelection={rowSelection}
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 2500 }}
        >
          <Table.Column
            sorter
            width={200}
            title="フォワーダー"
            dataIndex="agentId"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column
            sorter
            width={150}
            title="Uploader"
            dataIndex="uploaderId"
            render={(uploaderId) =>
              userOptions?.find((item) => item?.value === uploaderId)?.label
            }
          />
          <Table.Column sorter width={200} title="MAWB番号" dataIndex="_id" />
          <Table.Column sorter width={150} title="仕出地" dataIndex="PSC" />
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
          <Table.Column
            sorter
            width={120}
            title="件数"
            dataIndex="waybillCount"
          />
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
          <Table.Column sorter width={150} title="個数" dataIndex="NOCount" />
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
