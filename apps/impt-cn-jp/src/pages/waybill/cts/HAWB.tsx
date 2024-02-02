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
  message,
  Radio,
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { FileSearchOutlined } from '@ant-design/icons';

////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import {
  updateWaybill,
  deleteByWaybillId,
  getAllWaybills,
  genMainHSCODE,
  genMutiMainHSCODE,
  modifyWaybillIP1,
} from '@/services/request/waybill';
import HAWBForm from './components/HAWBForm';
import Create from './components/Create';
import UpdateWaybillIP1 from './components/UpdateWaybillIP1';
import WaybillModal from '@/components/Modal/WaybillModal';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const waybillStatus: any[] = [
  { value: 0, label: 'other' },
  { value: 1, label: 'normal' },
  { value: 2, label: 'hold' },
  { value: 3, label: 'sendBack' },
];

const processStatus: any[] = [
  { value: 0, label: 'wait cleansing' },
  { value: 1, label: 'doing cleasing' },
  { value: 2, label: 'done cleansing' },
  { value: 3, label: 'doing broker check' },
  { value: 4, label: 'done broker check' },
  { value: 5, label: 'done created' },
];

const LS_OPT: any[] = [
  { value: 'L', label: 'L' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
];

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<any[] | null>();
  // const [disCreating, setDisCreating] = useState<boolean>(true);
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
    // setDisCreating(!(formData?.HAB || (formData?.LS && formData?.MAB)));
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
  const genMainHSCODE_API = useRequest(genMainHSCODE, {
    manual: true,
    onError: (e: any) => {
      message.destroy();
      message.error(e?.data?.message, 30);
    },
  });
  const genMutiMainHSCODE_API = useRequest(genMutiMainHSCODE, {
    manual: true,
    onError: (e: any) => {
      refresh();
      message.destroy();
      message.error(e?.data?.message, 30);
    },
    onSuccess: () => {
      refresh();
      message.success('計算代表HSCODE成功しました。');
    },
  });
  const modifyWaybillIP1API = useRequest(modifyWaybillIP1, {
    manual: true,
    onError: (e: any) => {
      message.destroy();
      message.error(e?.data?.message, 30);
    },
  });

  const rowSelection: any = {
    type: 'checkbox',
    fixed: true,
    disabled: true,
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
          <Col flex="200px">
            <Form.Item name="process_status">
              <Select
                allowClear
                placeholder="申告ステップ"
                options={processStatus}
              />
            </Form.Item>
          </Col>
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
        title={
          <Space>
            <span>合計: {tableProps.pagination.total} 件</span>
            <UpdateWaybillIP1 onUpload={search.submit} />
          </Space>
        }
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
              disabled={
                !selectedRows?.length ||
                selectedRows?.some((item) => item?.process_status !== 4)
              }
              LS={Form.useWatch('LS', form)}
            />
            <Button type="primary" disabled={!selectedRow} onClick={handleEdit}>
              編集
            </Button>
            <Popconfirm
              title="選択したHAWBをすべて削除しますか?"
              onConfirm={async () => {
                for await (const iterator of selectedRows || []) {
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
            <Button
              disabled={!selectedRows?.length}
              loading={genMutiMainHSCODE_API.loading}
              onClick={() => {
                genMutiMainHSCODE_API.run({
                  ids: selectedRows?.map(({ _id }) => _id) || [],
                });
              }}
            >
              計算代表HSCODE
            </Button>
          </Space>
        }
      >
        <Table
          size="small"
          rowSelection={rowSelection}
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 4000, y: 'calc(100vh - 520px)' }}
        >
          <Table.Column
            sorter
            width={200}
            title="HAWB番号"
            fixed="left"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column
            sorter
            width={100}
            title="MAWB番号"
            dataIndex="MAB"
            fixed="left"
          />
          <Table.Column sorter width={50} title="LS" dataIndex="LS" />
          <Table.ColumnGroup title="申告">
            <Table.Column
              sorter
              width={100}
              title="申告値段"
              render={(row) => row?.IP4 + row?.IP3}
            />
            <Table.Column
              title="個人使用"
              width={100}
              render={(row) => (
                <Radio.Group
                  size="small"
                  value={row.IP1}
                  buttonStyle="solid"
                  onChange={async (e) => {
                    await modifyWaybillIP1API.runAsync({
                      id: row?._id,
                      IP1: e.target.value,
                    });
                    refresh();
                  }}
                >
                  <Radio.Button value="A">A</Radio.Button>
                  <Radio.Button value="B">B</Radio.Button>
                  <Radio.Button value="C">C</Radio.Button>
                  <Radio.Button value="D">D</Radio.Button>
                </Radio.Group>
              )}
            />
          </Table.ColumnGroup>

          <Table.ColumnGroup title="代表HSCODE">
            <Table.Column
              sorter
              width={160}
              title="課税"
              dataIndex="main_HSCODE_tax"
            />
            <Table.Column
              sorter
              width={160}
              title="非課税"
              dataIndex="main_HSCODE_no_tax"
            />
            <Table.Column
              width={60}
              title="計算"
              render={(item) =>
                item?.waybill_type === 'IDA' && (
                  <Button
                    loading={genMainHSCODE_API.loading}
                    onClick={async () => {
                      await genMainHSCODE_API.runAsync({
                        waybillId: item?._id,
                      });
                      refresh();
                    }}
                    size="small"
                  >
                    <FileSearchOutlined />
                  </Button>
                )
              }
            />
          </Table.ColumnGroup>
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
          <Table.Column sorter width={60} title="IP1" dataIndex="IP1" />
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
