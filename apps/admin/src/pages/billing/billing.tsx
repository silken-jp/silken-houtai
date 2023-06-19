import { Form, Table, Input, Button, Row, Col, Card, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import BillingForm from './components/BillingForm';
import { Link } from 'umi';
import {
  createBilling,
  deleteBillingById,
  getAllBilling,
} from '@/services/request/billing';
import { dayFormat, renderDate } from '@/utils/helper/day';
import { useAgentOptions } from '@/services/useAPIOption';
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { renderLabel, BILLING } from '@/utils/constant/Billing';

const BillingList: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { renderAgentLabel } = useAgentOptions();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Billing>();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllBilling({
      page,
      perPage,
      ...formData,
    });
    return { total: data?.totalCount, list: data?.billings || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createBilling({
        agent: v?.agent,
        start_date: dayFormat(v?.start_date, 'YYYY/MM/DD 00:00:00.000')!,
        end_date: dayFormat(v?.end_date, 'YYYY/MM/DD 23:59:59.000')!,
      });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規請求書', type: 'add', data: null });
  };

  return (
    <PageContainer
      title="請求書管理"
      header={{
        breadcrumb: {
          routes: [{ path: '/agent', breadcrumbName: '請求書管理' }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="name">
              <Input placeholder="請求書名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="account">
              <Input placeholder="アカウント" />
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
      <BillingForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="請求書リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column
            width={60}
            title="状態"
            dataIndex="status"
            render={renderLabel(BILLING.STATUS)}
          />
          <Table.Column<API.Billing>
            width={150}
            title="フォワーダー名"
            dataIndex="agent"
            render={(agent, row) => (
              <Link to={`/billing/gen/${row?._id}`}>
                {renderAgentLabel(agent)}
              </Link>
            )}
          />
          <Table.Column
            width={100}
            title="請求開始日"
            dataIndex="start_date"
            render={renderDate()}
          />
          <Table.Column
            width={100}
            title="請求終了日"
            dataIndex="end_date"
            render={renderDate()}
          />
          <Table.Column width={150} title="請求金額" dataIndex="" />
          <Table.Column
            width={60}
            fixed="right"
            title="操作"
            render={(row: any) => {
              const [handleDelete] = deleteConfirm({
                name: '請求書',
                submit: async () => {
                  await deleteBillingById({ billingId: row?._id });
                  search.submit();
                },
              });
              return <Actions onDelete={handleDelete} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default BillingList;
