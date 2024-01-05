import { useLocation } from 'umi';
import { Badge, Table, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import ExportXlsx from '@/pages/cts/StatusInquiry/components/ExportXlsx';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import { getAllTrackingsFull } from '@/services/request/tracking';

const StatusInquiryNotDec: React.FC = () => {
  // state
  const searchParams = (useLocation() as any).query;
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();
  const getTableData = async () => {
    const data = await getAllTrackingsFull({
      ...searchParams,
      category: 'notDec',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps } = useAntdTable(getTableData);

  const fixExpData = tableProps.dataSource?.map((item: any) => ({
    申告状態: [, '申告待ち', '時間オーバー'][item?.status],
    未申告理由: item?.DEC_date,
    HAWB番号: item?.HAB,
    到着日: item?.DATE,
    登録時間: item?.createdAt,
  }));

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/cts/StatusInquiry',
              breadcrumbName: intlMenu('cts'),
            },
            {
              path: '',
              breadcrumbName: 'Full Status Inquiry',
            },
            { path: '', breadcrumbName: '未申告詳細' },
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
            title="申告状態"
            render={(_, row: any) => {
              return [
                <></>,
                <Badge status="warning" text="申告待ち" />,
                <Badge status="error" text="時間オーバー" />,
              ][row?.status];
            }}
          />
          <Table.Column title="未申告理由" dataIndex="not_dec_reason" />
          <Table.Column
            width={100}
            title="ブローカー"
            dataIndex="broker"
            render={(broker) =>
              userOptions?.find((item) => item?.value === broker)?.label
            }
          />
          <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column
            width={250}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column
            width={100}
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

export default StatusInquiryNotDec;