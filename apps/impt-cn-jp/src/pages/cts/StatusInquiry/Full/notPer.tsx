import { useLocation } from 'umi';
import { Badge, Table, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import ExportXlsx from '@/pages/cts/StatusInquiry/components/ExportXlsx';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllTrackingsFull } from '@/services/request/tracking';
import { dayFormat } from '@/utils/helper/day';

const StatusInquiryNotPer: React.FC = () => {
  // state
  const searchParams = (useLocation() as any).query;
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
  const getTableData = async () => {
    const data = await getAllTrackingsFull({
      ...searchParams,
      category: 'notPer',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps } = useAntdTable(getTableData);

  const fixExpData = tableProps.dataSource?.map((item: any) => ({
    荷物状態: [, '税关检查', '未搬出'][item?.status],
    申告日: item?.DEC_date,
    HAWB番号: item?.HAB,
    MAWB番号: item?.MAB,
    到着日: item?.DATE,
    登録時間: item?.createdAt,
  }));

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/cts/StatusInquiry/Full',
              breadcrumbName: intlMenu('cts'),
            },
            {
              path: '',
              breadcrumbName: 'Full Status Inquiry',
            },
            { path: '', breadcrumbName: '未許可詳細' },
          ],
        },
        title: `MAB: ${searchParams?.MAB}`,
      }}
    >
      <Card
        title={<>合計: {tableProps.pagination.total} 件</>}
        extra={
          <ExportXlsx filename={searchParams?.MAB} dataSource={fixExpData} />
        }
      >
        <Table
          size="small"
          rowKey="_id"
          {...tableProps}
          pagination={false}
          scroll={{ y: 'calc(100vh - 380px)' }}
        >
          <Table.Column
            width={150}
            title="荷物状態"
            render={(_, row: any) => {
              return [
                <></>,
                <Badge status="success" text="税关检查" />,
                <Badge status="warning" text="未搬出" />,
              ][row?.status];
            }}
          />
          <Table.Column
            width={150}
            title="申告日"
            dataIndex="DEC_date"
            render={(DEC_date) => dayFormat(DEC_date)}
          />
          <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column
            width={150}
            title="到着日"
            dataIndex="DATE"
            render={(DATE) => dayFormat(DATE, 'YYYY.MM.DD')}
          />
          <Table.Column
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

export default StatusInquiryNotPer;
