import { Form, Table, Input, Button, Row, Col, Card, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import UploadWaybill from '@/components/Common/UploadWaybill';
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import AgentForm from '@/components/Form/AgentForm';
import {
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgentById,
} from '@/services/request/agent';

const StatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.MICkeys>();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllAgents({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.agents || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createAgent(v);
      search.submit();
    }
    if (formType === 'edit') {
      await updateAgent({ agentId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規代理商', type: 'add', data: null });
  };

  return (
    <PageContainer
      title="代理商管理"
      header={{
        breadcrumb: {
          routes: [{ path: '/agent', breadcrumbName: '代理商管理' }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="代理商名" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="アカウント" name="account">
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}></Col>
          <Col span={12}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <AgentForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="代理商名リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column width={300} title="代理商名" dataIndex="name" />
          <Table.Column title="アカウント" dataIndex="account" />
          <Table.Column
            width={300}
            title="アプロード"
            render={() => <UploadWaybill onUpload={search.submit} />}
          />
          <Table.Column
            width={100}
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集代理商',
                  type: 'edit',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  await deleteAgentById({ agentId: row?._id });
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
