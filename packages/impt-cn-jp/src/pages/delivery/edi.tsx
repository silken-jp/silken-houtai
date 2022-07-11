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
import UploadDeliveryFile from '@/components/Common/UploadDeliveryFile';
import { useIntlFormat } from '@/services/useIntl';
import { getAllTracks } from '@/services/request/track';
import TrackModal from '@/components/Modal/TrackModal';
import { useAgentOptions } from '@/services/useAPIOption';

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
          <Col span={3}>
            <Form.Item name="HAB">
              <Input placeholder="お問い合せ送り状NO" />
            </Form.Item>
          </Col>
          <Col span={3}>
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
      <Card title={intlMenu('delivery.other')} extra={<UploadDeliveryFile />}>
        <Table {...tableProps} rowKey="_id" scroll={{ x: 2500, y: 400 }}>
          <Table.Column
            title="フォワーダー"
            width={200}
            render={(row) =>
              agentOptions?.find((item) => item.value === row?.agent)?.label
            }
          />
          <Table.Column title="MAB" width={200} />
          <Table.Column title="件数" width={200} />
          <Table.Column title="アップロード" width={200} />
          <Table.Column title="アップロード時間" width={200} />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
