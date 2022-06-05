import { Table, Card, Space, Row, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { CheckCircleTwoTone } from '@ant-design/icons';
////
import Create from '@/components/Common/Create';
import Brock, { BrockBYSource } from '@/components/Common/Brock';
import Cleansing, { CleansingBYSource } from '@/components/Common/Cleansing';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import ExportXlsx from '@/components/Export/ExportXlsx';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { dayFormat } from '@/utils/helper/day';
import { useCTS } from '@/services/useCTS';

const ManifestWaybill: React.FC = () => {
  const [intlMenu] = useIntlFormat('menu');
  const { form, state, tableProps, search, cardProps, disActions } =
    useCTS('M');
  const selected = tableProps?.rowSelection?.selectedRowKeys?.length || 0;

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
          <Cleansing LS="M" disabled={disActions.cleansing} />
          <Brock LS="M" disabled={disActions.brock} />
          <Create
            LS="M"
            disabled={disActions.create}
            dataSource={tableProps.dataSource}
          />
          <ExportXlsx LS="M" />
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
            <Create
              LS="M"
              useSource
              disabled={disActions.create}
              dataSource={state.selectedRows}
            />
            <ExportXlsx LS="M" useSource dataSource={state.selectedRows} />
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 3000 }}>
          <Table.Column
            width={150}
            title="HAWB番号"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
          {state.tabKey === '0' && (
            <Table.Column title="コントローラー" dataIndex="" />
          )}
          {state.tabKey === '2' && (
            <Table.Column width={300} title="メモ" dataIndex="holdMemo" />
          )}
          {state.tabKey === '3' && (
            <Table.Column width={300} title="メモ" dataIndex="sendbackMemo" />
          )}
          <Table.Column
            width={150}
            title="クレンザー"
            dataIndex="cleanserName"
          />
          <Table.Column
            title="クレンジング時間"
            render={(row) => dayFormat(row?.clsDate)}
          />
          <Table.Column width={150} title="ブローカー" dataIndex="brokerName" />
          <Table.Column
            title="ブローカーチェック時間"
            render={(row) => dayFormat(row?.brcDate)}
          />
          <Table.Column
            width={150}
            title="クリエーター"
            dataIndex="creatorName"
          />
          <Table.Column
            title="クリエート時間"
            render={(row) => dayFormat(row?.crtDate)}
          />
          <Table.Column title="申告番号" dataIndex={['tracking', 'ID']} />
          <Table.Column title="申告者" />
          <Table.Column title="申告時間" dataIndex={['tracking', 'DEC_date']} />
          <Table.Column
            title="申告STATUS"
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column
            title="許可済み"
            render={(row) =>
              row?.tracking?.PER_date && (
                <CheckCircleTwoTone twoToneColor="#1890ff" />
              )
            }
          />
          <Table.Column title="許可時間" dataIndex={['tracking', 'PER_date']} />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default ManifestWaybill;
