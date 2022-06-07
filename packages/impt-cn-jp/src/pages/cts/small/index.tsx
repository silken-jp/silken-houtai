import { Table, Card, Space, Row, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
////
import Create from '@/components/Common/Create';
import Cleansing, { CleansingBYSource } from '@/components/Common/Cleansing';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import ExportXlsx from '@/components/Export/ExportXlsx';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { dayFormat } from '@/utils/helper/day';
import { useCTS } from '@/services/useCTS';

const SmallWaybill: React.FC = () => {
  const { form, state, tableProps, search, cardProps, disActions } =
    useCTS('S');
  const [intlMenu] = useIntlFormat('menu');
  const selected = tableProps?.rowSelection?.selectedRowKeys?.length || 0;

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/cts/small`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Small' },
          ],
        },
      }}
    >
      <CTSSearch form={form} search={search} />

      <Row justify="end" className="sk-table-stat">
        <Space>
          <span>サーチ結果で実行する</span>
          <Cleansing LS="S" disabled={true || disActions.cleansing} />
          {/* <Create LS="S" disabled={disActions.create} /> */}
          <ExportXlsx LS="S" />
        </Space>
      </Row>

      <CTSStatus
        dataSource={state.meta}
        loading={tableProps?.loading}
        type="IDA"
      />

      <Card
        {...cardProps}
        tabBarExtraContent={
          <Space>
            <span>selected: {selected} items</span>
            <CleansingBYSource
              LS="S"
              disabled
              dataSource={tableProps?.rowSelection?.selectedRowKeys}
            />
            {/* <Create
              LS="S"
              useSource
              disabled={disActions.create}
              dataSource={tableProps?.rowSelection?.selectedRowKeys}
            /> */}
            <ExportXlsx LS="S" useSource dataSource={state.selectedRows} />
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
          <Table.Column title="書類作成者" dataIndex="" />
          <Table.Column title="クレンザー" dataIndex="cleanserName" />
          <Table.Column
            title="クレンジング時間"
            render={(row) => dayFormat(row?.clsDate)}
          />
          <Table.Column title="クリエーター" dataIndex="creatorName" />
          <Table.Column
            title="クリエート時間"
            render={(row) => dayFormat(row?.crtDate)}
          />
          <Table.Column title="ブローカー" dataIndex="brokerName" />
          <Table.Column
            title="ブローカーチェック時間"
            render={(row) => dayFormat(row?.brcDate)}
          />
          <Table.Column title="申告番号" dataIndex={['tracking', 'ID']} />
          <Table.Column title="申告者" />
          <Table.Column
            title="申告STATUS"
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column title="申告(時間)" dataIndex={['tracking', 'DEC']} />
          <Table.Column title="許可(時間)" dataIndex={['tracking', 'PER']} />
          <Table.Column
            title="通関開始(時間)"
            dataIndex={['tracking', 'STT']}
          />
          <Table.Column
            title="内点予定(搬入前）/内点(搬入後）(時間)"
            dataIndex={['tracking', 'PIN/CHN']}
            render={(row) => (
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
          <Table.Column title="HCH送信(時間)" dataIndex={['tracking', 'HCH']} />
          <Table.Column
            title="搬入スキャン(時間)"
            dataIndex={['tracking', 'BIN']}
          />
          <Table.Column title="HPK送信(時間)" dataIndex={['tracking', 'HPK']} />
          <Table.Column
            title="搬出スキャン(時間)"
            dataIndex={['tracking', 'BOU']}
          />
          <Table.Column title="OUT送信(時間)" dataIndex={['tracking', 'OUT']} />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default SmallWaybill;
