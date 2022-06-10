import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import { useIntlFormat } from '@/services/useIntl';
import {
  createGW_IP4,
  deleteGW_IP4ById,
  getAllGW_IP4s,
  updateGW_IP4,
} from '@/services/request/gw_IP4';
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import GW_IP4Form from '@/components/Form/GW_IP4Form';

const GW_IP4Setting: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.CMN>();

  // api
  const getTableData = async (pageData: any, formData: API.GW_IP4) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'createAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllGW_IP4s({
      page,
      perPage,
      ...sorter,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.gwIp4Settings,
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createGW_IP4(v);
      refresh();
    }
    if (formType === 'edit') {
      await updateGW_IP4({ GW_IP4Id: formProps?.dataSource?._id, ...v });
      refresh();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規インボイス価格ルール', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: 'インボイス価格管理',
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/GW_IP4',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: 'インボイス価格管理' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="GW_min">
              <Input placeholder="GW_min" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="GW_max">
              <Input placeholder="GW_max" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="interval">
              <Input placeholder="刻み" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="IP4_min">
              <Input placeholder="IP4_min" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="IP4_max">
              <Input placeholder="IP4_max" />
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
      <GW_IP4Form type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="重量-インボイス価格リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          scroll={{ y: 'calc(100vh - 550px)' }}
        >
          <Table.ColumnGroup title="重量範囲">
            <Table.Column sorter width={150} title="min" dataIndex="GW_min" />
            <Table.Column sorter width={150} title="max" dataIndex="GW_max" />
          </Table.ColumnGroup>
          <Table.Column sorter width={150} title="刻み" dataIndex="interval" />
          <Table.ColumnGroup title="インボイス価格範囲">
            <Table.Column sorter width={150} title="min" dataIndex="IP4_min" />
            <Table.Column sorter width={150} title="max" dataIndex="IP4_max" />
          </Table.ColumnGroup>
          <Table.Column
            title="操作"
            width={80}
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集インボイス価格ルール',
                  type: 'edit',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: 'インボイス価格ルール',
                submit: async () => {
                  await deleteGW_IP4ById({ GW_IP4Id: row?._id });
                  search.submit();
                },
              });
              return <Actions onEdit={handleEdit} onDelete={handleDelete} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default GW_IP4Setting;
