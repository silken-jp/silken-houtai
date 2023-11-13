import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Tag,
  Col,
  Card,
  Select,
  Space,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { DATABASE_NAME, TrackingCode } from '@/utils/constant';
import { getTrackingsHistories } from '@/services/request/history';

499641611210;

const TrackingsHistory: React.FC = () => {
  const [form] = Form.useForm();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getTrackingsHistories({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.trackings || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  return (
    <PageContainer
      title="通関データ"
      header={{
        breadcrumb: {
          routes: [
            { path: '/history/waybills', breadcrumbName: 'バックアップデータ' },
            { path: '', breadcrumbName: '通関データ' },
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
              name="MAWB_NO"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value || getFieldValue('BL_')) {
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
              name="BL_"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value || getFieldValue('MAWB_NO')) {
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
          <Table.Column width={150} title="HAWB" dataIndex="BL_" />
          <Table.Column width={150} title="MAWB" dataIndex="MAWB_NO" />
          <Table.Column width={150} title="審査検査区分" dataIndex="EXA_DIS" />
          <Table.Column width={150} title="輸出入区分" dataIndex="DAT_TPE" />
          <Table.Column
            width={150}
            title="識別(MIC/IDA)"
            dataIndex="MIC_IDA"
            render={(MIC_IDA) => ['MIC', 'IDA'][MIC_IDA]}
          />
          <Table.Column
            width={180}
            title="状態"
            render={(row) => {
              return row?.trackingHistory?.map((item: any, key: any) => (
                <Tag key={key} color="blue">
                  {TrackingCode[item?.TKG_CD as keyof typeof TrackingCode]}
                  {'：' + item?.TKG_DT}
                </Tag>
              ));
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default TrackingsHistory;
