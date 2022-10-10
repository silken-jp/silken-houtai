import { Table, Card, Typography } from 'antd';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { get24HTodoTracks } from '@/services/request/track';

const TimeoutList: React.FC = () => {
  // state
  const [intlMenu] = useIntlFormat('menu');

  // api
  const get24HTodoTracksAPI = useRequest(get24HTodoTracks);

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/delivery/todo/timeoutList',
              breadcrumbName: intlMenu('delivery'),
            },
            { path: '', breadcrumbName: 'Timeout List' },
          ],
        },
        title: 'Timeout List (24 hours)',
      }}
    >
      <Card>
        <Table
          size="small"
          rowKey="_id"
          expandable={{
            expandedRowRender: (row) => (
              <Card size="small">
                <Typography.Paragraph copyable>
                  {row?.waybills?.map((w: any) => w?.HAB).join(' ')}
                </Typography.Paragraph>
              </Card>
            ),
          }}
          pagination={false}
          loading={get24HTodoTracksAPI.loading}
          dataSource={get24HTodoTracksAPI?.data || []}
        >
          <Table.Column width={150} title="MAWB番号" dataIndex="_id" />
          <Table.Column
            width={150}
            title="件数"
            render={(row) => row?.waybills?.length}
          />
          <Table.Column
            width={150}
            title="未集荷"
            render={(row) => row?.waybills?.length}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default TimeoutList;
