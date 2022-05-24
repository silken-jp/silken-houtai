import { Form, Table, Input, Button, Row, Col, Card, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import { CheckCircleTwoTone } from '@ant-design/icons';
////
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import UserForm from '@/components/Form/UserForm';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUserById,
} from '@/services/request/user';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.MICkeys>();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortField = pageData?.sorter?.field;
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortField = pageData?.sorter?.field;
      sorter.sortOrder = -1;
    }
    const data = await getAllUsers({
      page,
      perPage,
      ...sorter,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.users || [] };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createUser(v);
      refresh();
    }
    if (formType === 'edit') {
      await updateUser({ userId: formProps?.dataSource?._id, ...v });
      refresh();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規ユーザー', type: 'add', data: null });
  };

  return (
    <PageContainer
      title="ユーザー管理"
      header={{
        breadcrumb: {
          routes: [{ path: '/user', breadcrumbName: 'ユーザー管理' }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="name">
              <Input placeholder="名前" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="initialName">
              <Input placeholder="initialName" />
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
      <UserForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="ユーザーリスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column
            sorter
            width={150}
            title="InitialName"
            dataIndex="initialName"
          />
          <Table.Column sorter width={300} title="名前" dataIndex="name" />
          <Table.Column title="メール" dataIndex="email" />
          <Table.Column
            title="cleanser"
            render={(row) => row?.is_cleanser && <CheckCircleTwoTone />}
          />
          <Table.Column
            title="broker"
            render={(row) => row?.is_broker && <CheckCircleTwoTone />}
          />
          <Table.Column
            title="creator"
            render={(row) => row?.is_creator && <CheckCircleTwoTone />}
          />
          <Table.Column
            width={100}
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集ユーザー',
                  type: 'edit',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  await deleteUserById({ userId: row?._id });
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

export default StatusInquiry;
