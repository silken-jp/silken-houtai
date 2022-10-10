import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Descriptions,
  Typography,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllTodoTracks } from '@/services/request/track';

const TodoList: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const MAB = Form.useWatch('MAB', form);

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllTodoTracks({
      page,
      perPage,
      isToday: '0',
      category: '3',
      ...formData,
    });
    return { total: data?.totalCount, list: data?.data || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/delivery/todo/check',
              breadcrumbName: intlMenu('delivery'),
            },
            { path: '', breadcrumbName: 'Check MAB Todo' },
          ],
        },
        title: 'Check MAB Todo',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={8}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button disabled={!MAB} type="primary" onClick={search.submit}>
                検索
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card title={MAB} loading={tableProps.loading}>
        <Descriptions bordered column={3}>
          <Descriptions.Item label="件数">
            {tableProps.dataSource?.[0]?.waybills?.length}
          </Descriptions.Item>
          <Descriptions.Item label="未集荷">
            {tableProps.dataSource?.[0]?.waybillsTrackUnDoing?.length}
          </Descriptions.Item>
          <Descriptions.Item label="未配達">
            {tableProps.dataSource?.[0]?.waybillsTrackUnDone?.length}
          </Descriptions.Item>
          <Descriptions.Item label="未集荷HAWB" span={3}>
            <Typography.Paragraph copyable>
              {tableProps.dataSource?.[0]?.waybillsTrackUnDoing?.join(' ')}
            </Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="未配達HAWB" span={3}>
            <Typography.Paragraph copyable>
              {tableProps.dataSource?.[0]?.waybillsTrackUnDone?.join(' ')}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default TodoList;
