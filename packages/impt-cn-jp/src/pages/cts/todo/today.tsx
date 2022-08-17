import { useState } from 'react';
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
import { EditOutlined } from '@ant-design/icons';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllTodoTracks } from '@/services/request/track';
import { updateWaybill } from '@/services/request/waybill';
import TodoMemoForm from '@/components/Form/TodoMemoForm';

const TodoList: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const [tabKey, setTabKey] = useState('1');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  const tabArr = [
    { key: '1', tab: '未申告' },
    { key: '2', tab: '申告済でホールド' },
  ];

  // api
  const { agentOptions } = useAgentOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllTodoTracks({
      page,
      perPage,
      isToday: '1',
      category: tabKey,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.data || [] };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });

  // action
  const handleTabChange = (key: any) => {
    setTabKey(key);
    search.submit();
  };
  const handleSubmit = async (v: any) => {
    console.log(v);
    // if (formType === 'edit') {
    //   await updateWaybill({ waybillId: v._id, todo_memo: v?.todo_memo });
    //   refresh();
    // }
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/cts/todo',
              breadcrumbName: intlMenu('cts'),
            },
            { path: '', breadcrumbName: 'Today Todo' },
          ],
        },
        title: 'Today Todo',
      }}
    >
      <TodoMemoForm type={formType} {...formProps} onSubmit={handleSubmit} />
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
            <Form.Item name="_id">
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
      <Card
        tabList={tabArr}
        onTabChange={handleTabChange}
        activeTabKey={tabKey}
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 1200 }}>
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column width={150} title="MAWB番号" dataIndex="MAB" />
          <Table.Column
            width={250}
            title="Memo"
            render={(row) => (
              <Space>
                <Button
                  size="small"
                  onClick={() =>
                    handleOpen({
                      title: row?.HAB,
                      type: 'edit',
                      data: row,
                    })
                  }
                >
                  <EditOutlined />
                </Button>
                {row?.todo_memo}
              </Space>
            )}
          />
          <Table.Column width={150} title="HoldMemo" dataIndex="holdMemo" />
          <Table.Column
            width={150}
            title="SendbackMemo"
            dataIndex="sendbackMemo"
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
