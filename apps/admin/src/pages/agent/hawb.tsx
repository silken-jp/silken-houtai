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
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { getAllAgentHAWBs } from '@/services/request/agent_hawb';
import { useAgentOptions } from '@/services/useAPIOption';
import { getLabel, AGENT_HAWB } from '@/utils/constant';
import ExportHAWBXlsx from './components/ExportHAWBXlsx';

const AgentHAWB: React.FC = () => {
  // state
  const [form] = Form.useForm();
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

  return (
    <PageContainer
      title="HAWB配布"
      header={{
        breadcrumb: {
          routes: [{ path: '/agent/hawb', breadcrumbName: 'HAWB配布' }],
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
            <Form.Item name="group_name">
              <Select
                placeholder="配送会社"
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
      <Card title="HAWBリスト">
        <Table rowKey="_id" {...tableProps}>
          <Table.Column width={100} title="START_HAB" dataIndex="start_hab" />
          <Table.Column width={100} title="END_HAB" dataIndex="end_hab" />
          <Table.Column width={150} title="件数" dataIndex="count" />
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(v) => getLabel(agentOptions, v)}
          />
          <Table.Column
            width={150}
            title="配送会社"
            dataIndex="group_name"
            render={(v) => getLabel(AGENT_HAWB.GROUP_NAME, v)}
          />
          <Table.Column
            width={150}
            title="操作"
            render={(row) => (
              <ExportHAWBXlsx start={row.start_hab} count={row.count} />
            )}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default AgentHAWB;
