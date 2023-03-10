import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
import { Card, Table, Descriptions } from 'antd';
////
import { getAgent } from '@/services/request/agent';

export interface AgentSettingsProps {}

const AgentSettings: React.FC<AgentSettingsProps> = () => {
  const { agentId } = useParams<any>();
  const { data, loading } = useRequest(() => getAgent({ agentId }));

  return (
    <PageContainer
      title={data?.name}
      loading={loading}
      header={{
        breadcrumb: {
          routes: [{ path: '/agent', breadcrumbName: 'フォワーダー管理' }],
        },
      }}
      tabList={[{ key: 0, tab: '請求設定' }]}
    >
      <Card title="通关费用">
        <Table>
          <Table.Column title="件数" />
          <Table.Column title="价格" />
        </Table>
      </Card>
      <br />
      <Card title="保税费用">
        <Table>
          <Table.Column title="重量上限" />
          <Table.Column title="重量下限" />
          <Table.Column title="价格" />
        </Table>
      </Card>
      <br />
      <Card title="配送费用">
        <Table>
          <Table.Column title="重量上限" />
          <Table.Column title="重量下限" />
          <Table.Column title="价格" />
        </Table>
      </Card>
      <br />
      <Card title="税関検査费用">
        <Descriptions>
          <Descriptions.Item label="单价设置">30 / 每件3k</Descriptions.Item>
          <Descriptions.Item label="包月设置">30,000 / 每月</Descriptions.Item>
        </Descriptions>
      </Card>
      <br />
      <Card title="イレギュラー対応">
        <Table>
          <Table.Column title="DESCRIPTION" />
          <Table.Column title="JPY" />
          <Table.Column title="单位" />
          <Table.Column title="课税" />
          <Table.Column title="REMARK" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default AgentSettings;
