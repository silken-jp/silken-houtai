import React from 'react';
import { Table, Card, Button, Form, Input, Row, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlPage } from '@/services/useIntl';
import {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteByDriverId,
} from '@/services/request/driver';
import DriverForm from '@/components/Form/DriverForm';
import { useSKForm } from '@/components/Form/useSKForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

const driver: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const intlPage = useIntlPage();
  const { formType, formProps, handleOpen } = useSKForm<API.Driver>();

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
    } catch (error) {
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
        title: `${intlPage.driver}`,
        breadcrumb: {
          routes: [{ path: '', breadcrumbName: intlPage.driver }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="司机" name="driverId">
              <Input placeholder="司机" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button disabled type="primary" onClick={search.submit}>
                搜索
              </Button>
              <Button
                disabled
                onClick={search.reset}
                style={{ marginLeft: 16 }}
              >
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DriverForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="司机列表"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="名字" dataIndex="name" />
          <Table.Column title="电话" dataIndex="tel" />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: '编辑司机', type: 'edit', data: row });
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
