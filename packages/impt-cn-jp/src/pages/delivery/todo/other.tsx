import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllTodoTracks } from '@/services/request/track';

interface SubTableProps {
  dataSource: any[];
}
const SubTable: React.FC<SubTableProps> = (props) => {
  return (
    <Table size="small" rowKey="_id" dataSource={props.dataSource}>
      <Table.Column sorter width={200} title="HAWB番号" dataIndex="HAB" />
    </Table>
  );
};

const TodoList: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
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
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/delivery/todo/today',
              breadcrumbName: intlMenu('delivery'),
            },
            { path: '', breadcrumbName: 'Other Todo' },
          ],
        },
        title: 'Other Todo',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
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
      <Card>
        <Table
          size="small"
          rowKey="_id"
          expandable={{
            expandedRowRender: (row) => <SubTable dataSource={row?.waybills} />,
          }}
          {...tableProps}
        >
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column width={150} title="MAWB番号" dataIndex="_id" />
          <Table.Column
            width={150}
            title="Todo Count"
            render={(row) => row?.waybills?.length}
          />
          <Table.Column width={150} title="FlightNo" dataIndex="flight_no" />
          <Table.Column
            width={150}
            title="FlightDate"
            dataIndex="DATE"
            render={(flightDate) => dayFormat(flightDate, 'YYYY.MM.DD')}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default TodoList;
