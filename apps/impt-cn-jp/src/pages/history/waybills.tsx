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
import WaybillModal from '@/components/Modal/WaybillModal';
import { DATABASE_NAME } from '@/utils/constant';
import { getWaybillsHistories } from '@/services/request/history';
import { dayFormat } from '@/utils/helper/day';

const WaybillsHistory: React.FC = () => {
  const [form] = Form.useForm();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getWaybillsHistories({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  return (
    <PageContainer
      title="貨物データ"
      header={{
        breadcrumb: {
          routes: [
            { path: '/history/waybills', breadcrumbName: 'バックアップデータ' },
            { path: '', breadcrumbName: '貨物データ' },
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
        <Table rowKey="_id" {...tableProps}>
          <Table.Column
            width={150}
            title="HAWB"
            render={(row) => <WaybillModal dataSource={row} />}
          />
          <Table.Column width={150} title="MAWB" dataIndex="MAB" />
          <Table.Column
            sorter
            width={80}
            title="識別"
            dataIndex="waybill_type"
          />
          <Table.Column sorter width={100} title="仕出地" dataIndex="PSC" />
          <Table.Column
            sorter
            width={120}
            title="FLIGHT NO"
            dataIndex="flight_no"
          />
          <Table.Column
            sorter
            width={120}
            title="FLIGHT DATE"
            dataIndex="DATE"
            render={(DATE) => dayFormat(DATE, 'YYYY.MM.DD')}
          />
          <Table.Column sorter width={80} title="個数" dataIndex="PCS" />
          <Table.Column
            sorter
            width={120}
            title="重量（ＫＧ）"
            dataIndex="GW"
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default WaybillsHistory;
