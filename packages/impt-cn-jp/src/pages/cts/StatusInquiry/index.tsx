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
import { DeleteOutlined } from '@ant-design/icons';
////
import UploadImages from '@/components/Upload/UploadImages';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import {
  deleteALLWaybillsByMAWB,
  getStatusInquiry,
} from '@/services/request/waybill';
import { useState } from 'react';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [selectedRow, setSelectedRow] = useState<any>();

  // api
  const { agentOptions } = useAgentOptions();
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
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });
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
            { path: '/cts/StatusInquiry', breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Status Inquiry' },
          ],
        },
        title: 'Status Inquiry',
        // extra: <UploadImages />,
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
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
            width={200}
            title="FlightDate"
            dataIndex="flightDate"
            defaultSortOrder="descend"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={150} title="件数" dataIndex="NOCount" />
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
          <Table.Column sorter width={150} title="ショート" />
          <Table.Column sorter width={150} title="オーバー" />
          <Table.Column sorter width={150} title="MIC許可" />
          <Table.Column sorter width={150} title="MIC未許可" />
          <Table.Column sorter width={150} title="IDC許可" />
          <Table.Column sorter width={150} title="IDC未許可" />
          <Table.Column sorter width={150} title="HAWB未許可" />
          <Table.Column sorter width={150} title="登録時間" />Ï
        </Table>
      </Card>
    </PageContainer>
  );
};

export default StatusInquiry;
