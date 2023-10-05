import { useLocation } from 'umi';
import dayjs from 'dayjs';
import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  message,
  DatePicker,
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
// import useSKForm from '@silken-houtai/core/lib/useHooks';
import { getBillingWaybills } from '@/services/request/billing';
// import DetailForm from '../components/DetailForm';
// import Actions from '@/components/Common/Actions';
import { useAgentOptions } from '@/services/useAPIOption';
import { renderDate } from '@/utils/helper/day';
// import ExportHAWBXlsx from '../components/ExportXlsx';
import { handleExportXlsx } from '@/services/useExportXlsx';

const Detail: React.FC = () => {
  // state
  const [form] = Form.useForm();
  // const { formType, formProps, handleOpen } = useSKForm.useForm<any>();
  const { agentOptions } = useAgentOptions();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialValues = {
    agent: params.get('agent'),
    start_date: params.has('start_date')
      ? dayjs(params.get('start_date'))
      : null,
    end_date: params.has('end_date') ? dayjs(params.get('end_date')) : null,
  };

  // api
  const getTableData = async (_: any, formData: any) => {
    const data = await getBillingWaybills({
      agent: formData.agent,
      start_date: formData?.start_date
        ? dayjs(formData?.start_date).format('YYYY/MM/DD 00:00:00.000')
        : '',
      end_date: formData?.end_date
        ? dayjs(formData?.end_date).format('YYYY/MM/DD 23:59:59.000')
        : '',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual:
      !initialValues.agent ||
      !initialValues.start_date ||
      !initialValues.end_date,
    cacheKey: 'getBillingWaybills',
  });

  const onExport = () => {
    const dataSource = tableProps.dataSource?.map((d: any) => ({
      搬入日: renderDate()(d?.DATE),
      通関日: renderDate()(d?.PER_date),
      曜日: d?.PER_date ? dayjs(d?.PER_date).format('ddd') : '',
      'MAWB No.': d?.MAB,
      'HAWB No.': d?.BL_,
      申告等番号: d?.ID,
      // 'B2B&C': '',
      輸入者: d?.ImpName,
      郵便番号: d?.Zip,
      輸入者住所: d?.IAD,
      個数: d?.NO,
      WEIGHT: d?.GW,
      区分: d?.EXA_DIS,
      // 到着上屋: '',
      IC通関: d?.waybill_type === 'IDA' ? d?.clearance : '',
      MIC通関: d?.waybill_type === 'MIC' ? d?.clearance : '',
      保税倉庫作業量: d?.second_bonded,
      // B2B通関: '',
      // ゆうパケット貨物: '',
      保管料金: d?.storage,
      税関検査: d?.inspection,
      内容点検: d?.a,
      関税: d?.CUS_DTY,
      消費税: d?.CON_TAX,
      地方消費税: d?.LC_TAX,
      納税:
        Number(d?.CUS_DTY || 0) +
        Number(d?.CON_TAX || 0) +
        Number(d?.LC_TAX || 0),
    }));
    handleExportXlsx(dataSource, '詳細');
  };

  // async function handleSubmit(v: any) {
  //   try {
  //     if (formType === 'edit') {
  //       await updateWaybill({
  //         waybillId: formProps?.dataSource?._id,
  //         irregular: v?.irregular,
  //       });
  //       refresh();
  //     }
  //   } catch (error: any) {
  //     message.destroy();
  //     message.error(error?.message);
  //   }
  // }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/billing/lists/detail',
              breadcrumbName: '請求管理',
            },
            { path: '', breadcrumbName: '詳細' },
          ],
        },
        title: '詳細',
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={initialValues}
      >
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="start_date">
              <DatePicker placeholder="開始時間" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="end_date">
              <DatePicker placeholder="終了時間" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      {/* <DetailForm type={formType} {...formProps} onSubmit={handleSubmit} /> */}
      <Card
        title={
          <Space>
            <span>料金詳細</span>
            <Button
              size="small"
              disabled={tableProps.loading}
              onClick={onExport}
            >
              エクスポート
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          loading={tableProps.loading}
          dataSource={tableProps.dataSource}
          scroll={{ x: 4000, y: 'calc( 100vh - 500px )' }}
        >
          <Table.Column
            width={120}
            title="搬入日"
            dataIndex="DATE"
            render={renderDate()}
          />
          <Table.Column
            width={120}
            title="通関日"
            dataIndex="PER_date"
            render={renderDate()}
          />
          <Table.Column
            width={60}
            title="曜日"
            render={(row) =>
              row?.PER_date ? dayjs(row?.PER_date).format('ddd') : ''
            }
          />
          <Table.Column width={120} title="MAWB No." dataIndex="MAB" />
          <Table.Column width={120} title="HAWB No." dataIndex="BL_" />
          <Table.Column width={120} title="申告等番号" dataIndex="ID" />
          {/* <Table.Column width={120} title="B2B&C" dataIndex="" /> */}
          <Table.Column width={180} title="輸入者" dataIndex="ImpName" />
          <Table.Column width={120} title="郵便番号" dataIndex="Zip" />
          <Table.Column width={250} title="輸入者住所" dataIndex="IAD" />
          <Table.Column width={60} title="個数" dataIndex="NO" />
          <Table.Column width={60} title="WEIGHT" dataIndex="GW" />
          <Table.Column width={60} title="区分" dataIndex="EXA_DIS" />
          {/* <Table.Column width={120} title="到着上屋" dataIndex="" /> */}
          <Table.Column
            width={70}
            title="IC通関"
            render={(row) =>
              row?.waybill_type === 'IDA' ? row?.clearance : ''
            }
          />
          <Table.Column
            width={70}
            title="MIC通関"
            render={(row) =>
              row?.waybill_type === 'MIC' ? row?.clearance : ''
            }
          />
          <Table.Column
            width={120}
            title="保税倉庫作業量"
            dataIndex="second_bonded"
          />
          {/* <Table.Column width={120} title="B2B通関" dataIndex="" /> */}
          {/* <Table.Column width={120} title="ゆうパケット貨物" dataIndex="" /> */}
          <Table.Column width={120} title="保管料金" dataIndex="storage" />
          <Table.Column width={120} title="税関検査" dataIndex="inspection" />
          <Table.Column width={120} title="内容点検" dataIndex="" />
          <Table.Column width={120} title="関税" dataIndex="CUS_DTY" />
          <Table.Column width={120} title="消費税" dataIndex="CON_TAX" />
          <Table.Column width={120} title="地方消費税" dataIndex="LC_TAX" />
          <Table.Column
            width={120}
            title="納税額"
            render={(row) =>
              Number(row?.CUS_DTY || 0) +
              Number(row?.CON_TAX || 0) +
              Number(row?.LC_TAX || 0)
            }
          />
          {/* <Table.Column
            width={60}
            fixed="right"
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集フォワーダー',
                  type: 'edit',
                  data: row,
                });
              };
              return <Actions onEdit={handleEdit} />;
            }}
          /> */}
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Detail;
