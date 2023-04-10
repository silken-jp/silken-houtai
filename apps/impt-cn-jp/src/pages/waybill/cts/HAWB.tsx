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
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  updateWaybill,
  deleteByWaybillId,
  getAllWaybills,
} from '@/services/request/waybill';
import HAWBForm from './components/HAWBForm';
import Create from './components/Create';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const waybillStatus: any[] = [
  { value: 0, label: 'other' },
  { value: 1, label: 'normal' },
  { value: 2, label: 'hold' },
  { value: 3, label: 'sendBack' },
];

const LS_OPT: any[] = [
  { value: 'L', label: 'L' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
];

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<any>();
  const [disCreating, setDisCreating] = useState<boolean>(true);
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
    } else {
      sorter.sortField = 'createdAt';
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
      ...removeEmpty(formData),
      ...sorter,
    });
    setDisCreating(!(formData?.HAB || (formData?.LS && formData?.MAB)));
    setSelectedRows([]);
    return {
      total: data?.totalCount,
      list: data?.waybills,
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
              path: '/waybill/cts/HAWB',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: 'HAWB' },
          ],
        },
        title: 'HAWB',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name="waybill_status">
              <Select allowClear placeholder="状態" options={waybillStatus} />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="LS">
              <Select allowClear placeholder="LS" options={LS_OPT} />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
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
            <Create
              refreshAsync={search.submit}
              dataSource={selectedRows}
              disabled={disCreating || !selectedRows?.length}
              LS={Form.useWatch('LS', form)}
            />
            <Button type="primary" disabled={!selectedRow} onClick={handleEdit}>
              編集
            </Button>
            <Popconfirm
              title="選択したHAWBをすべて削除しますか?"
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
          scroll={{ x: 3600 }}
        >
          <Table.Column sorter width={100} title="HAWB番号" dataIndex="HAB" />
          <Table.Column sorter width={100} title="MAWB番号" dataIndex="MAB" />
          <Table.Column sorter width={60} title="LS" dataIndex="LS" />
          <Table.Column
            sorter
            width={60}
            title="状態"
            dataIndex="waybill_status"
            render={(waybill_status) =>
              waybillStatus?.find((item) => item?.value === waybill_status)
                ?.label
            }
          />
          <Table.Column width={180} title="holdMemo" dataIndex="holdMemo" />
          <Table.Column
            sorter
            width={100}
            title="フォワーダー"
            dataIndex="agent"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column
            sorter
            width={150}
            title="クレンザー"
            dataIndex="cleanserName"
          />
          <Table.Column
            sorter
            width={150}
            title="クレンジング時間"
            dataIndex="clsDate"
            render={(clsDate) => dayFormat(clsDate)}
          />
          <Table.Column
            sorter
            width={150}
            title="ブローカー"
            dataIndex="brokerName"
          />
          <Table.Column
            sorter
            width={150}
            title="ブローカーチェック時間"
            dataIndex="brcDate"
            render={(brcDate) => dayFormat(brcDate)}
          />
          <Table.Column
            sorter
            width={150}
            title="クリエーター"
            dataIndex="creatorName"
          />
          <Table.Column
            sorter
            width={150}
            title="クリエート時間"
            dataIndex="crtDate"
            render={(crtDate) => dayFormat(crtDate)}
          />
          <Table.Column
            sorter
            width={100}
            title="Uploader"
            dataIndex="uploader"
            render={(uploaderId) =>
              userOptions?.find((item) => item?.value === uploaderId)?.label
            }
          />
          <Table.Column sorter width={250} title="品名" dataIndex="CMN" />
          <Table.Column sorter width={80} title="仕出地" dataIndex="PSC" />
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
          <Table.Column sorter width={80} title="個数" dataIndex="PCS" />
          <Table.Column sorter width={100} title="重量(KG)" dataIndex="GW" />
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