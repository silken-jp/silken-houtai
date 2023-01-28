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
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import AgentHAWBForm from '@/components/Form/AgentHAWBForm';
import {
  getAllAgentHAWBs,
  createAgentHAWB,
  updateAgentHAWB,
  deleteAgentHAWBById,
} from '@/services/request/agent_hawb';
import { useAgentOptions } from '@/services/useAPIOption';
import { getLabel, AGENT_HAWB } from '@/utils/constant';

const AgentHAWB: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } =
    useSKForm.useForm<API.AgentHAWB>();
  const { agentOptions } = useAgentOptions();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllAgentHAWBs({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.habSettings || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    try {
      if (formType === 'add') {
        await createAgentHAWB(v);
        search.submit();
      }
      if (formType === 'edit') {
        await updateAgentHAWB({
          agentHAWBId: formProps?.dataSource?._id,
          ...v,
        });
        search.submit();
      }
    } catch (error: any) {
      message.destroy();
      message.warning(error?.data?.message, 5);
    }
  };
  const handleAdd = () => {
    handleOpen({
      title: '新規フォワーダー',
      type: 'add',
      data: { agentOptions },
    });
  };

  return (
    <PageContainer
      title="フォワーダーHAWB配布"
      header={{
        breadcrumb: {
          routes: [
            { path: '/agent/hawb', breadcrumbName: 'フォワーダーHAWB配布' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="agent">
              <Select
                placeholder="フォワーダー名"
                options={agentOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="cargo_type">
              <Select
                placeholder="配送種類"
                options={AGENT_HAWB.CARGO_TYPE}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="tracking_type">
              <Select
                placeholder="配送会社"
                options={AGENT_HAWB.TRACKING_TYPE}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="start_hab">
              <Input placeholder="HAWB" />
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
      <AgentHAWBForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="HAWBリスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.ColumnGroup title="HAWB">
            <Table.Column width={100} title="START" dataIndex="start_hab" />
            <Table.Column width={100} title="END" dataIndex="end_hab" />
          </Table.ColumnGroup>
          <Table.Column width={150} title="件数" dataIndex="count" />
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(v) => getLabel(agentOptions, v)}
          />
          <Table.Column
            width={140}
            title="配送種類"
            dataIndex="cargo_type"
            render={(v) => getLabel(AGENT_HAWB.CARGO_TYPE, v)}
          />
          <Table.Column
            width={150}
            title="配送会社"
            dataIndex="tracking_type"
            render={(v) => getLabel(AGENT_HAWB.TRACKING_TYPE, v)}
          />
          <Table.Column
            width={60}
            fixed="right"
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集フォワーダー',
                  type: 'edit',
                  data: { ...row, agentOptions },
                });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  await deleteAgentHAWBById({ agentHAWBId: row?._id });
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

export default AgentHAWB;
