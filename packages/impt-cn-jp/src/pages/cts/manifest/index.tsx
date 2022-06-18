import { Table, Card, Space, Row, Button, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
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
  const {
    form,
    state,
    tableProps,
    search,
    refreshAsync,
    cardProps,
    disActions,
  } = useCTS('M');
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
            refreshAsync={refreshAsync}
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
              refreshAsync={refreshAsync}
              disabled={disActions.create}
              dataSource={state.selectedRows}
            />
            <ExportXlsx LS="M" useSource dataSource={state.selectedRows} />
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 6000 }}>
          <Table.Column
            sorter
            width={250}
            title="HAWB番号"
            dataIndex="HAB"
            render={(_, row: any) => <WaybillModal dataSource={row} />}
          />
          <Table.Column sorter width={150} title="MAWB番号" dataIndex="MAB" />
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
            sorter
            width={150}
            title="クレンザー"
            dataIndex="cleanserName"
          />
          <Table.Column
            sorter
            title="クレンジング時間"
            dataIndex="clsDate"
            render={(clsDate) => dayFormat(clsDate)}
          />
          <Table.Column
            sorter
            width={150}
            title="ブローカー"
            dataIndex="brokerName"
          />
          <Table.Column
            sorter
            title="ブローカーチェック時間"
            dataIndex="brcDate"
            render={(brcDate) => dayFormat(brcDate)}
          />
          <Table.Column
            sorter
            width={150}
            title="クリエーター"
            dataIndex="creatorName"
          />
          <Table.Column
            sorter
            title="クリエート時間"
            dataIndex="crtDate"
            render={(crtDate) => dayFormat(crtDate)}
          />
          <Table.Column
            sorter
            title="申告番号"
            dataIndex={['tracking', 'ID']}
          />
          <Table.Column sorter title="申告者" />
          <Table.Column
            sorter
            title="申告STATUS"
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column
            sorter
            title="申告(時間)"
            dataIndex={['tracking', 'DEC']}
          />
          <Table.Column
            sorter
            title="許可(時間)"
            dataIndex={['tracking', 'PER']}
          />
          <Table.Column
            sorter
            title="通関開始(時間)"
            dataIndex={['tracking', 'STT']}
          />
          <Table.Column
            sorter
            title="内点予定(搬入前）/内点(搬入後）(時間)"
            dataIndex={['tracking', 'PIN']}
            render={(_, row: any) => (
              <>
                {row?.tracking?.PIN && (
                  <Tag>{`内点予定(搬入前）: ${row?.tracking?.PIN}`}</Tag>
                )}
                {row?.tracking?.CHN && (
                  <Tag>{`内点(搬入後: ${row?.tracking?.CHN}`}</Tag>
                )}
              </>
            )}
          />
          <Table.Column
            sorter
            title="HCH送信(時間)"
            dataIndex={['tracking', 'HCH']}
          />
          <Table.Column
            sorter
            title="搬入スキャン(時間)"
            dataIndex={['tracking', 'BIN']}
          />
          <Table.Column
            sorter
            title="HPK送信(時間)"
            dataIndex={['tracking', 'HPK']}
          />
          <Table.Column
            sorter
            title="搬出スキャン(時間)"
            dataIndex={['tracking', 'BOU']}
          />
          <Table.Column
            sorter
            title="OUT送信(時間)"
            dataIndex={['tracking', 'OUT']}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default ManifestWaybill;
