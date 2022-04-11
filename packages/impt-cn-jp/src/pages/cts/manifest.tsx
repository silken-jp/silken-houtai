import { Table, Card, Space, Row, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
////
import Create from '@/components/Common/Create';
import Brock, { BrockBYSource } from '@/components/Common/Brock';
import Cleansing, { CleansingBYSource } from '@/components/Common/Cleansing';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { dayFormat } from '@/utils/helper/day';
import { useCTS } from '@/services/useCTS';

const ManifestWaybill: React.FC = () => {
  const [intlMenu] = useIntlFormat('menu');
  const { form, state, tableProps, search, cardProps } = useCTS('M');
  const selected = tableProps?.rowSelection?.selectedRowKeys?.length || 0;

  const status = form.getFieldValue('status');
  const MAB = form.getFieldValue('MAB');

  return (
    <PageContainer
      header={{
        title: 'Manifest',
        breadcrumb: {
          routes: [
            { path: `/cts/manifest`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Manifest' },
          ],
        },
      }}
    >
      <CTSSearch form={form} search={search} />

      <Row justify="end" className="sk-table-stat">
        <Space>
          <span>サーチ結果で実行する</span>
          <Cleansing LS="M" disabled={![, '0'].includes(status)} />
          <Brock LS="M" disabled={![, '1', '2'].includes(status)} />
          <Create type="MIC" disabled={!MAB} />
        </Space>
      </Row>

      <CTSStatus
        dataSource={state.meta}
        loading={tableProps?.loading}
        type="MIC"
      />

      <Card
        {...cardProps}
        tabBarExtraContent={
          <Space>
            <span>selected: {selected} items</span>
            <Button size="small" type="link" onClick={state.handleClear}>
              clear
            </Button>
            <CleansingBYSource
              LS="M"
              dataSource={tableProps?.rowSelection?.selectedRowKeys}
            />
            <BrockBYSource
              LS="M"
              dataSource={tableProps?.rowSelection?.selectedRowKeys}
            />
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 3000 }}>
          <Table.Column
            title="HAWB番号"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column title="MAWB番号" dataIndex="MAB" />
          {state.tabKey === 'Other' && (
            <Table.Column title="コントローラー" dataIndex="" />
          )}
          <Table.Column title="クレンザー" dataIndex="cleanserName" />
          <Table.Column
            title="クレンジング時間"
            render={(row) => dayFormat(row?.clsDate)}
          />
          <Table.Column title="ブローカー" dataIndex="brokerName" />
          <Table.Column
            title="ブローカーチェック時間"
            render={(row) => dayFormat(row?.brcDate)}
          />
          <Table.Column title="クリエーター" dataIndex="creatorName" />
          <Table.Column
            title="クリエート時間"
            render={(row) => dayFormat(row?.crtDate)}
          />
          <Table.Column title="申告番号" dataIndex="" />
          <Table.Column title="申告者" dataIndex="" />
          <Table.Column title="申告時間" dataIndex="" />
          <Table.Column title="申告STATUS" dataIndex="" />
          <Table.Column title="許可済み" dataIndex="" />
          <Table.Column title="許可時間" dataIndex="" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default ManifestWaybill;
