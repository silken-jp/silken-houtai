import {
  Form,
  Table,
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { getAllTracks } from '@/services/request/track';
import TrackModal from '@/components/Modal/TrackModal';
import { useAgentOptions } from '@/services/useAPIOption';

export const sagawaCategory = [
  // { value: '0', label: '出荷データ受付' },
  // { value: '1', label: '出荷データ確定' },
  { value: '2', label: '集荷受付' },
  { value: '3', label: '貨物輸送' },
  { value: '4', label: '配達持出' },
  { value: '5', label: '配達完了・消し込み' },
  // { value: '6', label: '貨物追跡' },
  // { value: '7', label: '請求・代引・保険・着払処理' },
  // { value: '9', label: 'その他' },
];

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllTracks({
      page,
      perPage,
      sortField: 'delivery_day',
      sortOrder: -1,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.tracks || [],
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 100,
  });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/delivery/other`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: intlMenu('delivery.other') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col flex="200px">
            <Form.Item name="HAB">
              <Input placeholder="お問い合せ送り状NO" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="MAB">
              <Input placeholder="MAB" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="category">
              <Select
                placeholder="配送状態"
                allowClear
                options={sagawaCategory}
              />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="agent">
              <Select
                placeholder="フォワーダー"
                allowClear
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card title={intlMenu('delivery.other')}>
        <Table {...tableProps} rowKey="_id" scroll={{ x: 2500, y: 400 }}>
          <Table.Column
            title="フォワーダー"
            width={200}
            render={(row) =>
              agentOptions?.find((item) => item.value === row?.agent)?.label
            }
          />
          <Table.Column
            title="配達情報"
            width={400}
            render={(row) => <TrackModal dataSource={row} />}
          />
          <Table.Column
            width={250}
            title="お問い合せ送り状NO"
            dataIndex="HAB"
          />
          <Table.Column
            width={250}
            title="出荷日"
            render={(row) => dayFormat(row?.delivery_day, 'YYYY年MM月DD日')}
          />
          <Table.ColumnGroup title="集荷営業所">
            <Table.Column
              title="所名"
              width={200}
              render={(row) =>
                row?.pickup_office && `${row.pickup_office} 営業所`
              }
            />
            <Table.Column title="TEL" width={200} dataIndex="pickup_tel" />
            <Table.Column title="FAX" width={200} dataIndex="pickup_fax" />
          </Table.ColumnGroup>
          <Table.ColumnGroup title="配達営業所">
            <Table.Column
              title="所名"
              width={200}
              render={(row) =>
                row?.delivery_office && `${row.delivery_office} 営業所`
              }
            />
            <Table.Column title="TEL" width={200} dataIndex="delivery_tel" />
            <Table.Column title="FAX" width={200} dataIndex="delivery_fax" />
          </Table.ColumnGroup>
          <Table.Column title="お荷物個数" width={200} dataIndex="no" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
