import {
  Table,
  Card,
  Space,
  Row,
  Button,
  Tag,
  Dropdown,
  Menu,
  Typography,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { FormOutlined } from '@ant-design/icons';
////
import Create from '@/components/Common/Create';
import CTSSearch from '@/components/Search/CTSSearch';
import CTSStatus from '@/components/Common/CTSStatus';
import WaybillModal from '@/components/Modal/WaybillModal';
import CargoIssueForm from '@/components/Form/CargoIssueForm';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useCTS } from '@/services/useCTS';
import useCleansing from '@/services/useCTSActions/useCleansing';
import useBrockCheck from '@/services/useCTSActions/useBrockCheck';
import useExportXlsx from '@/services/useCTSActions/useExportXlsx';
import useIssueModal from '@/services/useCTSActions/useIssueModal';
import usePERImage from '@/services/useCTSActions/usePERImage';
import useDownloadINVBL from '@/services/useCTSActions/useDownloadINVBL';
import WaybillINVBLForm from '@/components/Form/WaybillINVBLForm';
import { updateWaybill } from '@/services/request/waybill';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';

const ManifestWaybill: React.FC = () => {
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
  } = useCTS('M', {
    pagination: {
      position: ['topLeft', 'bottomRight'],
    },
  });
  // cleansing功能
  const { cleansingApi, handleCleansing } = useCleansing(
    'M',
    state.selectedRowKeys,
  );
  // brockCheck
  const {
    brockCheckApi,
    simpleBrockCheckApi,
    handleBrockCheck,
    handleBrockCheckSimple,
  } = useBrockCheck('M', state.selectedRowKeys);
  // 导出问题件功能
  const { PERImageApi, handlePERImage } = usePERImage(state.selectedRowKeys);
  // 新建问题件功能
  const issueModal = useIssueModal({ selectedRows: state.selectedRows });
  // 导出waybill表单功能
  const { exportApi, handleExport } = useExportXlsx('M', state?.selectedRows);
  // 批量打印 INV BL
  const { handleDownload } = useDownloadINVBL('M');

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
        title: 'Manifest',
        breadcrumb: {
          routes: [
            { path: `/cts/manifest`, breadcrumbName: intlMenu('cts') },
            { path: '', breadcrumbName: 'Manifest' },
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
      <CargoIssueForm
        type={issueModal.formType}
        {...issueModal.formProps}
        onSubmit={issueModal.handleSubmit}
      />
      <Row justify="end" className="sk-table-stat">
        <Space>
          <span>サーチ結果で実行する</span>
          <Button
            type="primary"
            disabled={disActions.cleansing}
            onClick={cleansingApi.run}
          >
            Mas CLS
          </Button>
          {/* <Link to="/cts/check/Brok">
            <Button type="primary" disabled={disActions.brock}>
              Muti BRC
            </Button>
          </Link> */}
          <Button
            type="primary"
            disabled={disActions.brock}
            onClick={brockCheckApi.run}
          >
            Mas BRC (ST)
          </Button>
          <Button
            disabled={disActions.brock}
            style={{ background: '#ffcf77' }}
            onClick={simpleBrockCheckApi.run}
          >
            Mas BRC (EX)
          </Button>
          <Create
            LS="M"
            text="Mas CRT"
            refreshAsync={refreshAsync}
            disabled={disActions.create}
            dataSource={tableProps.dataSource}
          />
          <Button
            disabled={disActions.export}
            loading={exportApi.loading}
            onClick={exportApi.run}
          >
            Export Xlsx
          </Button>
          <Button onClick={handleDownload}>Print INV&BL</Button>
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
            <Button
              size="small"
              type="dashed"
              disabled={!selected}
              onClick={handleCleansing}
            >
              Single CLS
            </Button>
            <Button
              size="small"
              type="primary"
              disabled={!selected}
              onClick={handleBrockCheck}
            >
              Single BRC (ST)
            </Button>
            <Button
              size="small"
              disabled={!selected}
              style={{ background: '#ffcf77' }}
              onClick={handleBrockCheckSimple}
            >
              Single BRC (EX)
            </Button>
            <Create
              LS="M"
              text="Single CRT"
              useSource
              refreshAsync={refreshAsync}
              disabled={disActions.create}
              dataSource={state.selectedRows}
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
                    // {
                    //   key: 1,
                    //   label: '新規issue',
                    //   onClick: issueModal.handleAdd,
                    // },
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
        <Table
          size="small"
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 6000, y: 600 }}
        >
          <Table.Column
            sorter
            width={250}
            title="HAWB番号"
            dataIndex="HAB"
            render={(_, row: any) => <WaybillModal dataSource={row} />}
          />
          <Table.Column
            sorter
            width={220}
            title="品名"
            dataIndex="CMN"
            render={(_, row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: 'INV/BL 修正',
                  type: 'MIC',
                  data: row,
                });
              };
              return (
                <Space>
                  <Typography.Text
                    style={{ width: 120 }}
                    ellipsis={{ tooltip: row?.CMN }}
                  >
                    {row?.CMN}
                  </Typography.Text>
                  <Button size="small" onClick={handleEdit}>
                    <FormOutlined />
                  </Button>
                </Space>
              );
            }}
          />
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
