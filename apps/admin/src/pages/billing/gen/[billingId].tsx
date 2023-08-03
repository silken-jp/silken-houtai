import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card, Button, Space } from 'antd';
import { useRequest } from 'ahooks';
import { useParams, Link } from 'umi';
import { LinkOutlined } from '@ant-design/icons';
////
import {
  getBillingById,
  billingAdvance,
  billingFirstBonded,
  billingSecondBonded,
  billingStorage,
  billingClearance,
  billingInspection,
  billingIrregular,
  BillingDelivery,
} from '@/services/request/billing';
import { useAgentOptions } from '@/services/useAPIOption';
import { dayFormat } from '@/utils/helper/day';
import { renderPrice } from '@/utils/helper/helper';

const GenBilling: React.FC = () => {
  // state
  const { billingId } = useParams<any>();
  const { renderAgentLabel } = useAgentOptions();
  const billingAPI = useRequest(() => getBillingById({ billingId }));

  const params = new URLSearchParams({
    agent: billingAPI?.data?.agent,
    start_date: dayFormat(billingAPI?.data?.start_date, 'YYYY-MM-DD') || '',
    end_date: dayFormat(billingAPI?.data?.end_date, 'YYYY-MM-DD') || '',
  });

  const title =
    renderAgentLabel(billingAPI?.data?.agent) +
    dayFormat(billingAPI?.data?.start_date, ' 【 YYYY年MM月DD日 ~ ') +
    dayFormat(billingAPI?.data?.end_date, 'YYYY年MM月DD日 】');

  // api
  // 一次上屋料金
  const firstBondedAPI = useRequest(
    async () => {
      await billingFirstBonded({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // 二次上屋料金
  const secondBondedAPI = useRequest(
    async () => {
      await billingSecondBonded({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // 通関料
  const clearanceAPI = useRequest(
    async () => {
      await billingClearance({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  //保管料
  const storageAPI = useRequest(
    async () => {
      await billingStorage({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // 税関検査費用
  const inspectionAPI = useRequest(
    async () => {
      await billingInspection({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // 配送料金（＊）
  const deliveryAPI = useRequest(
    async () => {
      await BillingDelivery({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // 立替関税・消費税◎
  const irregularAPI = useRequest(
    async () => {
      await billingIrregular({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );
  // イレギュラー費用
  const advanceAPI = useRequest(
    async () => {
      await billingAdvance({ billingId });
      billingAPI.refresh();
    },
    { manual: true },
  );

  const dataSource = [
    {
      key: '0',
      field: (
        <Button loading={firstBondedAPI.loading} onClick={firstBondedAPI.run}>
          一次上屋料金
        </Button>
      ),
      ...billingAPI?.data?.first_bonded_field,
    },
    {
      key: '1',
      field: (
        <Button loading={secondBondedAPI.loading} onClick={secondBondedAPI.run}>
          二次上屋料金
        </Button>
      ),
      ...billingAPI?.data?.second_bonded_field,
    },
    {
      key: '2',
      field: (
        <Button loading={clearanceAPI.loading} onClick={clearanceAPI.run}>
          通関料
        </Button>
      ),
      ...billingAPI?.data?.clearance_field,
    },
    {
      key: '3',
      field: (
        <Button loading={storageAPI.loading} onClick={storageAPI.run}>
          保管料
        </Button>
      ),
      ...billingAPI?.data?.storage_field,
    },
    {
      key: '4',
      field: (
        <Button loading={inspectionAPI.loading} onClick={inspectionAPI.run}>
          税関検査費用
        </Button>
      ),
      ...billingAPI?.data?.inspection_field,
    },
    {
      key: '5',
      field: (
        <Button loading={deliveryAPI.loading} onClick={deliveryAPI.run}>
          配送料金（＊）
        </Button>
      ),
      ...billingAPI?.data?.delivery_field,
    },
    // {
    //   key: '6',
    //   field: '成田チャーター運賃取消料（＊）',
    // },
    {
      key: '7',
      field: (
        <Button loading={advanceAPI.loading} onClick={advanceAPI.run}>
          立替関税・消費税◎
        </Button>
      ),
      ...billingAPI?.data?.advance_field,
    },
    {
      key: '8',
      field: (
        <Button loading={irregularAPI.loading} onClick={irregularAPI.run}>
          イレギュラー費用（＊）
        </Button>
      ),
      ...billingAPI?.data?.irregular_field,
    },
    {
      key: '9',
      field: (
        <Button loading={irregularAPI.loading} onClick={irregularAPI.run}>
          イレギュラー費用（不課税）
        </Button>
      ),
      ...billingAPI?.data?.irregular_no_tax_field,
    },
  ];

  return (
    <PageContainer
      title="生成請求書"
      header={{
        breadcrumb: {
          routes: [
            { path: '/billing/gen', breadcrumbName: '請求書管理' },
            { path: '', breadcrumbName: '生成請求書' },
          ],
        },
      }}
    >
      <Card
        title={title}
        extra={
          <Space>
            <Link
              to={`/billing/lists/detail?${params.toString()}`}
              target="_blank"
            >
              <Button icon={<LinkOutlined />}>詳細</Button>
            </Link>
            <Link
              to={`/billing/lists/MAWB?${params.toString()}`}
              target="_blank"
            >
              <Button icon={<LinkOutlined />}>マスタデータ</Button>
            </Link>
            <Link
              to={`/billing/lists/irregular?${params.toString()}`}
              target="_blank"
            >
              <Button icon={<LinkOutlined />}>イレギュラー費用</Button>
            </Link>
          </Space>
        }
      >
        <Table
          size="small"
          dataSource={dataSource}
          pagination={false}
          rowKey="key"
        >
          <Table.Column title="請求項目" dataIndex="field" />
          <Table.Column
            title="数量"
            dataIndex="count"
            render={(count) => (count ? `${count} 件` : '-')}
          />
          <Table.Column title="単価" dataIndex="unit_price" />
          <Table.ColumnGroup title="金額">
            <Table.Column
              title="立替項目（◎）"
              dataIndex="advance"
              render={renderPrice()}
            />
            <Table.Column
              title="不課税項目"
              dataIndex="no_tax_price"
              render={renderPrice()}
            />
            <Table.Column
              title="課税項目"
              dataIndex="tax_price"
              render={renderPrice()}
            />
          </Table.ColumnGroup>
        </Table>
      </Card>
    </PageContainer>
  );
};

export default GenBilling;
