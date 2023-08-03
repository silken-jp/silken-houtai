import { useLocation } from 'umi';
import dayjs from 'dayjs';
import {
  Form,
  Table,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useAgentOptions } from '@/services/useAPIOption';
import { getBillingMABs } from '@/services/request/billing';
import UpdateMAB from '../components/UpdateMAB';
import { renderDate } from '@/utils/helper/day';

const SimpleStatusInquiry: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialValues = {
    agent: params.get('agent'),
    start_date: params.has('start_date')
      ? dayjs(params.get('start_date'))
      : null,
    end_date: params.has('end_date') ? dayjs(params.get('end_date')) : null,
  };

  // api
  const { agentOptions } = useAgentOptions();
  const getTableData = async (_: any, formData: any) => {
    const data = await getBillingMABs({
      agent: formData.agent,
      start_date: formData?.start_date
        ? dayjs(formData?.start_date).format('YYYY/MM/DD 00:00:00.000')
        : '',
      end_date: formData?.end_date
        ? dayjs(formData?.end_date).format('YYYY/MM/DD 23:59:59.000')
        : '',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual:
      !initialValues.agent ||
      !initialValues.start_date ||
      !initialValues.end_date,
  });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/billing/lists/MAWB',
              breadcrumbName: '請求管理',
            },
            { path: '', breadcrumbName: 'マスタデータ' },
          ],
        },
        title: 'マスタデータ',
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={initialValues}
      >
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
          <Col>
            <Form.Item name="start_date">
              <DatePicker placeholder="開始時間" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="end_date">
              <DatePicker placeholder="終了時間" />
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
      <Card title="マスタデータ" extra={<UpdateMAB />}>
        <Table
          rowKey="_id"
          size="small"
          loading={tableProps.loading}
          dataSource={tableProps.dataSource}
        >
          <Table.Column width={150} title="MAWB番号" dataIndex="mab" />
          <Table.Column
            width={150}
            title="入港日"
            dataIndex="flightDate"
            render={renderDate()}
          />
          <Table.Column width={150} title="便名" dataIndex="VSN" />
          <Table.Column
            width={120}
            title="一次上屋料金"
            dataIndex="first_bonded"
          />
          <Table.Column
            width={120}
            title="ターミナル料金"
            dataIndex="first_bonded"
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default SimpleStatusInquiry;
