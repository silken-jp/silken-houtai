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
  Typography,
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import UploadWaybillHSCODE from './components/UploadWaybillHSCODE';
import ExportWaybillHSCODEXlsx from './components/ExportWaybillHSCODEXlsx';
import {
  deleteByWaybillHSCODEId,
  getAllWaybillHSCODEs,
} from '@/services/request/waybill-hscode';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState<any>();

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
      sorter.sortField = 'createdAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllWaybillHSCODEs({
      page,
      perPage,
      ...removeEmpty(formData),
      ...sorter,
    });
    setSelectedRows([]);
    return {
      total: data?.totalCount,
      list: data?.waybillhscodes,
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    manual: true,
    defaultPageSize: 1000,
  });

  const deleteWaybillHSCODE = useRequest(deleteByWaybillHSCODEId, {
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

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/waybill/cts/HSCODE',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: 'HSCODE' },
          ],
        },
        title: 'HSCODE',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="280px">
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="280px">
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="SKU">
              <Input placeholder="SKU番号" />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="hscode">
              <Input placeholder="HSCODE" />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="is_tax_rate">
              <Select
                placeholder="税率有無"
                options={[
                  { value: '0', label: '無' },
                  { value: '1', label: '有' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="160px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
              <ExportWaybillHSCODEXlsx
                form={form}
                count={tableProps.pagination.total}
              />
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        title={
          <Space>
            <span>合計: {tableProps.pagination.total} 件</span>
            <UploadWaybillHSCODE onUpload={search.submit} />
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
            <Popconfirm
              title="選択したHAWBをすべて削除しますか?"
              onConfirm={async () => {
                for await (const iterator of selectedRows) {
                  await deleteWaybillHSCODE.runAsync({
                    waybillHSCODEId: iterator?._id,
                  });
                }
                setSelectedRows([]);
                refresh();
              }}
              okButtonProps={{
                loading: deleteWaybillHSCODE.loading,
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
          scroll={{ x: 3000, y: 'calc(100vh - 520px)' }}
        >
          <Table.Column sorter width={120} title="MAWB番号" dataIndex="MAB" />
          <Table.Column sorter width={120} title="HAWB番号" dataIndex="HAB" />
          <Table.Column
            sorter
            width={150}
            title="订单号"
            dataIndex="order_no"
          />
          <Table.Column
            sorter
            width={200}
            title="中文品名"
            dataIndex="CMN_cn"
          />
          <Table.Column sorter width={300} title="英文品名" dataIndex="CMN" />
          <Table.Column width={60} title="数量" dataIndex="NO" />
          <Table.Column width={100} title="価格" dataIndex="price" />
          <Table.Column width={60} title="币种" dataIndex="currency" />
          <Table.Column
            width={100}
            title="URL"
            dataIndex="URL"
            render={(url: string) => (
              <Typography.Text ellipsis>
                <a target="_blank" href={url}>
                  {url}
                </a>
              </Typography.Text>
            )}
          />
          <Table.Column
            width={120}
            title="销售品名"
            dataIndex="CMN_sale"
            render={(CMN_sale: string) => (
              <Typography.Text ellipsis>{CMN_sale}</Typography.Text>
            )}
          />
          <Table.Column width={120} title="材质" dataIndex="material" />
          <Table.Column
            width={120}
            title="编织方式"
            dataIndex="weaving_style"
          />
          <Table.Column width={100} title="HSCODE" dataIndex="CMD" />
          <Table.Column sorter width={150} title="SKU" dataIndex="SKU" />
          <Table.Column width={100} title="税率" dataIndex="tax_rate" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default SimpleStatusInquiry;
