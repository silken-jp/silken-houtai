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
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  deleteByWaybillId,
  getAllWaybills,
  updateWaybill,
} from '@/services/request/waybill';
import HAWBForm from '@/components/Form/HAWBForm';
import useSKForm from '@silken-houtai/core/lib/useHooks';

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [selectedRows, setSelectedRows] = useState<any>();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  const selectedRow = selectedRows?.length === 1 ? selectedRows[0] : null;

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
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllWaybills({
      page,
      perPage,
      ...sorter,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
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
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col flex="auto">
            <Form.Item name="HAB">
              <Input placeholder="hawbs" />
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
                setSelectedRows(null);
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
          scroll={{ x: 1500 }}
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
          <Table.Column sorter width={150} title="MAWB番号" dataIndex="MAB" />
          <Table.Column sorter width={250} title="品名" dataIndex="CMN" />
          <Table.Column
            sorter
            width={120}
            title="FlightNo"
            dataIndex="flight_no"
          />
          <Table.Column
            sorter
            width={120}
            title="FlightDate"
            dataIndex="DATE"
            render={(data) => dayFormat(data, 'YYYY.MM.DD')}
          />
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

export default SimpleStatusInquiry;
