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
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { getDeliveries } from '@/services/request/delivery';
import { useAgentOptions } from '@/services/useAPIOption';

const STATUS = ['', '配達中', '到着', '再配達'];

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();

  // api
  const getTableData = async (_: any, formData: any) => {
    const data = await getDeliveries(formData);
    return {
      total: data.length,
      list: data,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        // title: intlMenu('delivery.self'),
        breadcrumb: {
          routes: [
            { path: `/delivery/self`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: intlMenu('delivery.self') },
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
      <Card title={intlMenu('delivery.self')}>
        <Table {...tableProps} rowKey="_id">
          <Table.Column title="status" render={(row) => STATUS[row?.status]} />
          <Table.Column title="waybill" dataIndex="waybill" />
          <Table.Column title="truck" dataIndex="truck" />
          <Table.Column
            title="createdAt"
            render={(row) => dayjs(row.createdAt).format('YYYY/MM/DD')}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
