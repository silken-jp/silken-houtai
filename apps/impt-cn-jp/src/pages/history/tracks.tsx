import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Select,
  Space,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { DATABASE_NAME } from '@/utils/constant';
import { getTracksHistories } from '@/services/request/history';
import TrackModal from './components/TrackModal';
import { dayFormat } from '@/utils/helper/day';

const TracksHistory: React.FC = () => {
  const [form] = Form.useForm();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getTracksHistories({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.tracks || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  return (
    <PageContainer
      title="配送データ"
      header={{
        breadcrumb: {
          routes: [
            { path: '/history/waybills', breadcrumbName: 'バックアップデータ' },
            { path: '', breadcrumbName: '配送データ' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item
              name="DB"
              rules={[
                { required: true, message: 'データベースを選択してください' },
              ]}
            >
              <Select
                placeholder="データベース"
                options={DATABASE_NAME}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="MAB"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value || getFieldValue('HAB')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('HAWB/MAWBを入力してください'),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="MAWB" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="HAB"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value || getFieldValue('MAB')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('HAWB/MAWBを入力してください'),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="HAWB" />
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
      <Card title="データベース">
        <Table rowKey="_id" {...tableProps} scroll={{ x: 1800 }}>
          <Table.Column width={150} title="HAWB" dataIndex="HAB" />
          <Table.Column width={150} title="MAWB" dataIndex="MAB" />
          <Table.Column
            width={200}
            title="追跡"
            render={(row) => {
              return <TrackModal dataSource={row} />;
            }}
          />
          <Table.Column
            width={150}
            title="出荷日"
            render={(row) => dayFormat(row?.delivery_day, 'YYYY年MM月DD日')}
          />
          <Table.ColumnGroup title="集荷営業所">
            <Table.Column
              title="所名"
              width={120}
              render={(row) =>
                row?.pickup_office && `${row.pickup_office} 営業所`
              }
            />
            <Table.Column title="TEL" width={150} dataIndex="pickup_tel" />
            <Table.Column title="FAX" width={150} dataIndex="pickup_fax" />
          </Table.ColumnGroup>
          <Table.ColumnGroup title="配達営業所">
            <Table.Column
              title="所名"
              width={120}
              render={(row) =>
                row?.delivery_office && `${row.delivery_office} 営業所`
              }
            />
            <Table.Column title="TEL" width={150} dataIndex="delivery_tel" />
            <Table.Column title="FAX" width={150} dataIndex="delivery_fax" />
          </Table.ColumnGroup>
          <Table.Column title="お荷物個数" width={100} dataIndex="no" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default TracksHistory;
