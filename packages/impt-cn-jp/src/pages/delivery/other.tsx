import { Form, Table, Card, Row, Col, Input, Button, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import UploadDeliveryFile from '@/components/Common/UploadDeliveryFile';
import { useIntlFormat } from '@/services/useIntl';
import { getAllTracks } from '@/services/request/track';
import TrackModal from '@/components/Modal/TrackModal';

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllTracks({
      page,
      perPage,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.tracks || [],
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

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
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="お問い合せ送り状NO">
              <Input />
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
      <Card title={intlMenu('delivery.other')} extra={<UploadDeliveryFile />}>
        <Table {...tableProps} rowKey="_id">
          <Table.Column
            title="配達情報"
            render={(row) => row?.history?.[row?.history?.length - 1]?.code_jp}
          />
          <Table.Column
            title="お問い合せ送り状NO"
            render={(row) => <TrackModal dataSource={row} />}
          />
          <Table.Column
            title="出荷日"
            render={(row) => dayFormat(row?.delivery_day, 'YYYY年MM月DD日')}
          />
          <Table.ColumnGroup title="集荷営業所">
            <Table.Column title="所名" dataIndex="pickup_office" />
            <Table.Column title="TEL" dataIndex="pickup_tel" />
            <Table.Column title="FAX" dataIndex="pickup_fax" />
          </Table.ColumnGroup>
          <Table.ColumnGroup title="配達営業所">
            <Table.Column title="所名" dataIndex="delivery_office" />
            <Table.Column title="TEL" dataIndex="delivery_tel" />
            <Table.Column title="FAX" dataIndex="delivery_fax" />
          </Table.ColumnGroup>
          <Table.Column title="お荷物個数" dataIndex="no" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
