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
  message,
  Popconfirm,
  DatePicker,
  Select,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import { deleteALLWaybillsByMAWB, updateMAB } from '@/services/request/waybill';
import { getMabs } from '@/services/request/mabs';
import Create from './components/Create';
import MABForm from './components/MABForm';
import UploadWaybill from './components/UploadWaybill';
import UpdateWaybill from './components/UpdateWaybill';
import ExportWaybillXlsx from './components/ExportWaybillXlsx';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any>();
  const { formType, formProps, handleOpen } = useSKForm.useForm<any>();

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
    const data = await getMabs({
      page,
      perPage,
      ...sorter,
      ...removeEmpty(formData),
      flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
      flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    });
    setSelectedRow(null);
    setSelectedRowKeys([]);
    return { total: data?.totalCount, list: data?.mawbs || [] };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 30,
  });
  const deleteALLWaybills = useRequest(deleteALLWaybillsByMAWB, {
    manual: true,
  });

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys,
    onChange: (keys: any[], [selectedRow]: any[]) => {
      setSelectedRow(selectedRow);
      setSelectedRowKeys(keys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: !record.mab,
      name: record.mab,
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
    try {
      if (formType === 'edit') {
        await updateMAB({
          oldMab: selectedRow.mab,
          ...v,
        });
        setSelectedRow(null);
        setSelectedRowKeys([]);
        refresh();
      }
    } catch (error: any) {
      message.destroy();
      message.error(error?.message);
    }
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/waybill/cts/MAWB',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: 'MAWB' },
          ],
        },
        title: 'MAWB',
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
      <MABForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title={
          <Space>
            <span>合計: {tableProps.pagination.total} 件</span>
            <UploadWaybill
              agentOptions={agentOptions}
              onUpload={search.submit}
            />
          </Space>
        }
        extra={
          <Space>
            <Create
              refreshAsync={search.submit}
              dataSource={selectedRow}
              disabled={!selectedRow}
            />
            <ExportWaybillXlsx
              disabled={!selectedRow}
              dataSource={selectedRow}
              refresh={refresh}
            />
            <Button type="primary" disabled={!selectedRow} onClick={handleEdit}>
              編集
            </Button>
            <Popconfirm
              title={`【MAWB番号 ${selectedRow?.mab} 合${selectedRow?.waybillCount}個 】 を全て削除しますか?`}
              onConfirm={async () => {
                await deleteALLWaybills.runAsync({
                  mawb: selectedRow?.mab,
                });
                setSelectedRow(null);
                refresh();
              }}
              okButtonProps={{
                loading: deleteALLWaybills.loading,
              }}
              okText="Yes"
              cancelText="No"
              disabled={!selectedRow}
            >
              <Button disabled={!selectedRow} type="primary">
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
          scroll={{ x: 2000 }}
        >
          <Table.Column
            width={60}
            title="アップデート"
            render={(row) => (
              <UpdateWaybill
                payload={{ mab_id: row?._id }}
                onUpload={search.submit}
                disabled={!!row.creator}
              />
            )}
          />
          <Table.Column
            sorter
            width={120}
            title="フォワーダー"
            dataIndex="agentId"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column
            sorter
            width={120}
            title="Uploader"
            dataIndex="uploaderId"
            render={(uploaderId) =>
              userOptions?.find((item) => item?.value === uploaderId)?.label
            }
          />
          <Table.Column sorter width={150} title="MAWB番号" dataIndex="mab" />
          <Table.ColumnGroup title="件数">
            <Table.Column sorter width={60} title="M" dataIndex="mCount" />
            <Table.Column sorter width={60} title="L" dataIndex="lCount" />
            <Table.Column sorter width={60} title="S" dataIndex="sCount" />
            <Table.Column
              sorter
              width={60}
              title="合計"
              dataIndex="waybillCount"
            />
          </Table.ColumnGroup>
          <Table.Column
            sorter
            width={120}
            title="FlightNo"
            dataIndex="flightNo"
          />
          <Table.Column
            sorter
            width={120}
            title="FlightDate"
            dataIndex="flightDate"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={120} title="仕出地" dataIndex="PSC" />
          <Table.Column sorter width={120} title="個数" dataIndex="NOCount" />
          <Table.Column
            sorter
            width={120}
            title="重量（KG）"
            dataIndex="GWCount"
            render={(GWCount) => GWCount?.toFixed(2)}
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
