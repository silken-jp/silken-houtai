import {
  Form,
  Table,
  Input,
  Button,
  Select,
  Row,
  Col,
  Card,
  Space,
  message,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import AgentHAWBGroupForm from '@/components/Form/AgentHAWBGroupForm';
import AutoHAWBForm from '@/components/Form/AutoHAWBForm';
import {
  getAllHAWBGroups,
  createHAWBGroup,
  deleteHAWBGroupById,
  autoHAWBGroup,
} from '@/services/request/agent_hawb_group';
import { AGENT_HAWB, getLabel } from '@/utils/constant';

const AgentHAWB: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } =
    useSKForm.useForm<API.HAWBGroup>();
  const autoForm = useSKForm.useForm<API.AgentHAWB>();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllHAWBGroups({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.habSettingGroups || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    try {
      if (formType === 'add') {
        await createHAWBGroup(v);
        search.submit();
      }
    } catch (error: any) {
      message.destroy();
      message.warning(error?.data?.message, 5);
    }
  };
  const handleAutoSubmit = async (v: any) => {
    try {
      if (autoForm.formType === 'auto') {
        await autoHAWBGroup({
          hab_setting_group: autoForm.formProps?.dataSource?._id,
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
      title: '新規HAWB区間',
      type: 'add',
      data: null,
    });
  };

  return (
    <PageContainer
      title="HAWB区間管理"
      header={{
        breadcrumb: {
          routes: [{ path: '/agent/hawb', breadcrumbName: 'HAWB区間管理' }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="group_name">
              <Select
                placeholder="配送種類"
                options={AGENT_HAWB.GROUP_NAME}
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
      <AgentHAWBGroupForm
        type={formType}
        {...formProps}
        onSubmit={handleSubmit}
      />
      <AutoHAWBForm
        type={autoForm.formType}
        {...autoForm.formProps}
        onSubmit={handleAutoSubmit}
      />
      <Card
        title="HAWB区間リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column
            width={150}
            title="配送種類"
            dataIndex="group_name"
            render={(v) => getLabel(AGENT_HAWB.GROUP_NAME, v)}
          />
          <Table.Column width={150} title="START_HAB" dataIndex="start_hab" />
          <Table.Column width={150} title="END_HAB" dataIndex="end_hab" />
          <Table.Column width={150} title="件数" dataIndex="count" />
          <Table.Column width={150} title="配布済み" dataIndex="used_count" />
          <Table.Column
            width={60}
            fixed="right"
            title="操作"
            render={(row: any) => {
              const handleAuto = () => {
                autoForm.handleOpen({
                  title: 'フォワーダーに自動配布',
                  type: 'auto',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  await deleteHAWBGroupById({ HAWBGroupId: row?._id });
                  search.submit();
                },
              });
              return (
                <Actions
                  menus={[
                    { key: 'add', label: '配布', onClick: handleAuto },
                    { key: 'delete', label: '削除', onClick: handleDelete },
                  ]}
                />
              );
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default AgentHAWB;
