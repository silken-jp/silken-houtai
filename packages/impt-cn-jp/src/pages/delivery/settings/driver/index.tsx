import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import { useIntlFormat } from '@/services/useIntl';
import {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteByDriverId,
} from '@/services/request/driver';
import DriverForm from '@/components/Form/DriverForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

const driver: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Driver>();

  // api
  const getTableData = async (
    pageData: PaginatedParams[0],
    formData: Object,
  ) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data = await getAllDrivers();
      return {
        total: data.length,
        list: data,
      };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createDriver(v);
      search.submit();
    }
    if (formType === 'edit') {
      await updateDriver({ driverId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新建司机', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: `${intlMenu('setting.driver')}`,
        breadcrumb: {
          routes: [
            {
              path: '/delivery/settings/driver',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: intlMenu('setting.driver') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="名前" name="name">
              <Input placeholder="名前" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="電話番号" name="tel">
              <Input placeholder="電話番号" />
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
      <DriverForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="ドライバーリスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="名前" dataIndex="name" />
          <Table.Column title="電話番号" dataIndex="tel" />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: 'ドライバー', type: 'edit', data: row });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  await deleteByDriverId({ driverId: row?._id });
                  search.submit();
                },
              });
              return <Actions onEdit={handleEdit} onDelete={handleDelete} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default driver;
