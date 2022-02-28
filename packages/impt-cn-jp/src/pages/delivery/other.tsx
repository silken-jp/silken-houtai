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

const STATUS = ['', '配達中', '到着', '再配達'];

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  // api
  const getTableData = async (_: any, formData: any) => {
    const data = [] || (await getDeliveries(formData));
    return {
      total: data.length,
      list: data,
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        // title: intlMenu('delivery.other'),
        breadcrumb: {
          routes: [
            { path: `/delivery/other`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: intlMenu('delivery.other') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Track">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="配送会社">
              <Select options={[]} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item style={{ textAlign: 'right' }}>
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
        <Table {...tableProps} rowKey="_id">
          <Table.Column title="status" render={(row) => STATUS[row?.status]} />
          <Table.Column title="waybill" dataIndex="waybill" />
          <Table.Column title="truck" dataIndex="truck" />
          <Table.Column
            title="createAt"
            render={(row) => dayjs(row.createdAt).format('YYYY/MM/DD')}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
