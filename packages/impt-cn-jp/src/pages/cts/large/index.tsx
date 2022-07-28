import {
  Table,
  Card,
  Space,
  Row,
  Tag,
  Button,
  Dropdown,
  Menu,
  Typography,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { FormOutlined } from '@ant-design/icons';
////
import { updateWaybill } from '@/services/request/waybill';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import Create from '@/components/Common/Create';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import WaybillModal from '@/components/Modal/WaybillModal';
import { useIntlFormat } from '@/services/useIntl';
import { dayFormat } from '@/utils/helper/day';
import { useCTS } from '@/services/useCTS';
import useExportXlsx from '@/services/useCTSActions/useExportXlsx';
import useIssueModal from '@/services/useCTSActions/useIssueModal';
import usePERImage from '@/services/useCTSActions/usePERImage';
import useCleansing from '@/services/useCTSActions/useCleansing';
import useDownloadINVBL from '@/services/useCTSActions/useDownloadINVBL';
import WaybillINVBLForm from '@/components/Form/WaybillINVBLForm';

const LargeWaybill: React.FC = () => {
  // state
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();
  const [intlMenu] = useIntlFormat('menu');
  const {
    form,
    state,
    tableProps,
    search,
    refreshAsync,
    cardProps,
    disActions,
  } = useCTS('L');
  // cleansing功能
  const { cleansingApi, handleCleansing } = useCleansing(
    'L',
    state.selectedRowKeys,
  );
  // 导出问题件功能
  const { PERImageApi, handlePERImage } = usePERImage(state.selectedRowKeys);
  // 新建问题件功能
  const issueModal = useIssueModal({ selectedRows: state.selectedRows });
  // 导出waybill表单功能
  const { exportApi, handleExport } = useExportXlsx('L', state?.selectedRows);
  // 批量打印 INV BL
  const { handleDownload } = useDownloadINVBL('L');

  // format
  const selected = state?.selectedRowKeys?.length || 0;

  // action
  const handleSubmit = async (v: any) => {
    try {
      await updateWaybill({
        waybillId: formProps.dataSource._id,
        ...v,
      });
      await refreshAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/cts/large`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Large' },
          ],
        },
      }}
    >
      <WaybillINVBLForm
        type={formType}
        {...formProps}
        onSubmit={handleSubmit}
      />
      <CTSSearch form={form} search={search} />

      <Row justify="end" className="sk-table-stat">
        <Space>
          <span>サーチ結果で実行する</span>
          <Button
            type="primary"
            disabled={true || disActions.cleansing}
            onClick={cleansingApi.run}
          >
            マスクレンジング
          </Button>
          <Create
            LS="L"
            refreshAsync={refreshAsync}
            disabled={true || disActions.create}
          />
          <Button loading={exportApi.loading} onClick={exportApi.run}>
            Export Xlsx
          </Button>
          <Button onClick={handleDownload}>Print INV&BL</Button>
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
            <Button
              size="small"
              type="dashed"
              disabled={!selected}
              onClick={handleCleansing}
            >
              シングルクレンジング
            </Button>
            <Create
              LS="L"
              useSource
              refreshAsync={refreshAsync}
              disabled={true || disActions.create}
              dataSource={tableProps?.rowSelection?.selectedRowKeys}
            />
            <Dropdown.Button
              overlay={
                <Menu
                  items={[
                    {
                      key: 0,
                      label: '許可書',
                      onClick: handlePERImage,
                    },
                    {
                      key: 1,
                      label: '新規issue',
                      onClick: issueModal.handleAdd,
                    },
                  ]}
                />
              }
              size="small"
              onClick={handleExport}
            >
              Export Xlsx
            </Dropdown.Button>
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 6000 }}>
          <Table.Column
            sorter
            title="HAWB番号"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          {/* <Table.Column
            width={180}
            title="品名"
            render={(row) => {
              const handleEdit = () => {
                handleOpen({
                  title: 'INV BL 品名修正',
                  type: 'IDA',
                  data: row,
                });
              };
              return (
                <>
                  <Typography.Text
                    style={{ width: 120 }}
                    ellipsis={{ tooltip: row?.CMN }}
                  >
                    {row?.CMN}
                  </Typography.Text>
                  <Button size="small" onClick={handleEdit}>
                    <FormOutlined />
                  </Button>
                </>
              );
            }}
          /> */}
          <Table.Column
            width={100}
            title="許可書"
            render={(row) =>
              !!row?.is_PER_image && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() =>
                    PERImageApi.run({
                      waybillIds: [row._id],
                    })
                  }
                >
                  許可書
                </Button>
              )
            }
          />
          <Table.Column sorter title="MAWB番号" dataIndex="MAB" />
          {state.tabKey === '0' && (
            <Table.Column title="コントローラー" dataIndex="" />
          )}
          {state.tabKey === '2' && (
            <Table.Column width={300} title="メモ" dataIndex="holdMemo" />
          )}
          {state.tabKey === '3' && (
            <Table.Column width={300} title="メモ" dataIndex="sendbackMemo" />
          )}
          <Table.Column sorter title="書類作成者" dataIndex="" />
          <Table.Column sorter title="クレンザー" dataIndex="cleanserName" />
          <Table.Column
            sorter
            title="クレンジング時間"
            render={(row) => dayFormat(row?.clsDate)}
          />
          <Table.Column sorter title="クリエーター" dataIndex="creatorName" />
          <Table.Column
            sorter
            title="クリエート時間"
            render={(row) => dayFormat(row?.crtDate)}
          />
          <Table.Column sorter title="ブローカー" dataIndex="brokerName" />
          <Table.Column
            sorter
            title="ブローカーチェック時間"
            render={(row) => dayFormat(row?.brcDate)}
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

export default LargeWaybill;
