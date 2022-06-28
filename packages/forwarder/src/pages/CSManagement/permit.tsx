import {
  Form,
  Table,
  Input,
  Tag,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import ExportXlsx from '@/components/Export/ExportXlsx';
import { getAgentInfo } from '@/services/useStorage';
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills } from '@/services/request/waybill';
import { getAllTracks } from '@/services/request/track';
import { dayFormat } from '@/utils/helper/day';
import TrackModal from '@/components/Modal/TrackModal';
import { getAllTrackings } from '@/services/request/tracking';
import { TrackingCode } from '@/utils/constant';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const agentInfo = getAgentInfo();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let { search1, search2, ...search } = formData;
    if (search1?.key && search1?.value) {
      search[search1.key] = search1.value;
    }
    if (search2?.key && search2?.value) {
      search[search2.key] = search2.value;
    }
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'createAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllWaybills({
      ...JSON.parse(JSON.stringify(search), (_, value) =>
        value === null || value === '' ? undefined : value,
      ),
      agent: agentInfo._id,
      page,
      perPage,
      ...sorter,
    });
    const { tracks = [] } = await getAllTracks({
      page: 0,
      perPage,
      HAB: data?.waybills?.map((item: any) => item?.HAB).join(' '),
      agent: agentInfo._id,
    });
    const { trackings = [] } = await getAllTrackings({
      page: 0,
      perPage,
      BL_: data?.waybills?.map((item: any) => item?.HAB).join(' '),
    });
    return {
      total: data?.totalCount,
      list: data?.waybills?.map((item: any) => ({
        ...item,
        track: tracks?.find((t: any) => t?.HAB === item?.HAB),
        tracking: trackings?.find((t: any) => t?.BL_ === item?.HAB),
      })),
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        title: intlMenu('CSManagement.permit'),
        breadcrumb: {
          routes: [
            {
              path: 'cn-to-jp/CSManagement/permit',
              breadcrumbName: intlMenu('CSManagement'),
            },
            {
              path: '',
              breadcrumbName: intlMenu('CSManagement.permit'),
            },
          ],
        },
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={{ search2: { key: 'HAB' } }}
      >
        <Row gutter={8}>
          <Col flex="100px">
            <Form.Item name="waybill_type">
              <Select
                allowClear
                placeholder="識別"
                options={[
                  { label: 'MIC', value: 'MIC' },
                  { label: 'IDA', value: 'IDA' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="通関結果"
                options={[
                  { label: '許可', value: '1', disabled: true },
                  { label: '未許可', value: '2', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item>
              <Select
                allowClear
                placeholder="納税"
                options={[
                  { label: '有税', value: '1', disabled: true },
                  { label: '無税', value: '2', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="タイプ"
                options={[
                  { label: 'BtoC', value: 'BtoC', disabled: true },
                  { label: 'BtoB', value: 'BtoB', disabled: true },
                  {
                    label: 'AMAZON FBA',
                    value: 'AMAZON FBA',
                    disabled: true,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item>
              <DatePicker.RangePicker
                disabled
                placeholder={['許可開始日', '許可終了日']}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name={['search1', 'key']}>
              <Select
                allowClear
                placeholder="項目名"
                options={[
                  { label: 'FLIGHT NO', value: 'flight_no' },
                  { label: '個数', value: 'NO' },
                  { label: '重量（KG）', value: 'GW' },
                  { label: '審査検査区分', value: '2', disabled: true },
                  { label: '関税', value: '3', disabled: true },
                  { label: '消費税', value: '4', disabled: true },
                  { label: '地方消費税', value: '5', disabled: true },
                  { label: '納税額合計', value: '6', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item name={['search1', 'value']}>
              <Input placeholder="検査内容" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name={['search2', 'key']}>
              <Select
                allowClear
                placeholder="項目名"
                options={[
                  { label: 'HAWB番号', value: 'HAB' },
                  { label: 'お問い合わせ番号', value: '1', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name={['search2', 'value']}>
              <Input placeholder="HAWB番号/お問い合わせ番号/申告番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="配送業者"
                options={[{ label: '佐川急便', value: '1' }]}
              />
            </Form.Item>
          </Col>
          <Col flex="160px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        extra={
          <ExportXlsx
            handleRun={() =>
              getTableData(
                {
                  current: 1,
                  pageSize: 100000,
                },
                form.getFieldsValue(true),
              )
            }
          />
        }
      >
        <Table
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 6000, y: 'calc(100vh - 530px)' }}
        >
          <Table.Column
            sorter
            width={120}
            title="お問い合わせ番号"
            dataIndex="HAB"
          />
          <Table.Column
            width={200}
            title="追跡"
            render={(row) => {
              return <TrackModal dataSource={row?.track} />;
            }}
          />
          {/* <Table.Column width={120} title="コメント" /> */}
          <Table.Column
            sorter
            width={150}
            title="申告STATUS"
            dataIndex={['tracking', 'EXA_DIS']}
          />
          <Table.Column
            width={200}
            title="状態"
            render={(row) =>
              row?.tracking?.trackingHistory?.map((item: any, key: any) => (
                <Tag key={key} color="blue">
                  {TrackingCode[item?.TKG_CD as keyof typeof TrackingCode]}
                  {'：' + item?.TKG_DT}
                </Tag>
              ))
            }
          />
          <Table.Column sorter width={100} title="許可書" />
          <Table.Column sorter width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column sorter width={150} title="MAWB番号" dataIndex="MAB" />
          <Table.Column sorter width={150} title="配送業者" />
          <Table.Column sorter width={150} title="タイプ" />
          <Table.Column
            sorter
            width={80}
            title="識別"
            dataIndex="waybill_type"
          />
          <Table.Column
            sorter
            width={100}
            title="FLIGHT NO"
            dataIndex="flightNo"
          />
          <Table.Column
            sorter
            width={100}
            title="FLIGHT DATE"
            dataIndex="flightDate"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
          <Table.Column
            sorter
            width={180}
            title="申告番号"
            dataIndex={['tracking', 'ID']}
          />
          <Table.Column sorter width={80} title="個数" dataIndex="NO" />
          <Table.Column
            sorter
            width={100}
            title="重量（ＫＧ）"
            dataIndex="GW"
          />
          <Table.Column sorter width={150} title="審査検査区分" />
          <Table.Column sorter width={150} title="関税" render={() => 0} />
          <Table.Column sorter width={150} title="消費税" render={() => 0} />
          <Table.Column
            sorter
            width={150}
            title="地方消費税"
            render={() => 0}
          />
          <Table.Column
            sorter
            width={150}
            title="納税額合計"
            render={() => 0}
          />
          <Table.Column
            sorter
            width={150}
            title="作成日時"
            dataIndex="createAt"
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
