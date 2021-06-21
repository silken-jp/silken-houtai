import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
////
import { useIntlPage } from '@/services/useIntl';
import {
  getAllWaybills,
  createWaybill,
  updateWaybill,
  deleteByWaybillId,
} from '@/services/request/waybill';
import WaybillForm from '@/components/Form/WaybillForm';
import { useSKForm } from '@/components/Form/useSKForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const intlPage = useIntlPage();
  const { formType, formProps, handleOpen } = useSKForm<API.Waybill>();

  // apollo
  const getTableData = async (_: PaginatedParams[0], formData: Object) => {
    try {
      const data = await getAllWaybills(formData);
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
      await createWaybill(v);
      search.submit();
    }
    if (formType === 'edit') {
      await updateWaybill({ waybillId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新建司机', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: `${intlPage.waybill}`,
        breadcrumb: {
          routes: [{ path: '', breadcrumbName: intlPage.waybill }],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="日本物流单号" name="jp_delivery_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="日本快递公司" name="jp_delivery_company">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="中国物流单号" name="cn_delivery_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="中国快递公司" name="cn_delivery_company">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="航班号" name="flight_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={search.submit}>
                搜索
              </Button>
              <Button onClick={search.reset} style={{ marginLeft: 16 }}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <WaybillForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="运单列表"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="日本物流单号" dataIndex="jp_delivery_no" />
          <Table.Column title="日本快递公司" dataIndex="jp_delivery_company" />
          <Table.Column title="航班号" dataIndex="flight_no" />
          <Table.Column
            title="单证录入时间"
            render={(row) =>
              row?.waybill_input_time
                ? moment(row?.waybill_input_time)
                    .local()
                    .format('YYYY-MM-DD hh:mm')
                : '-'
            }
          />
          <Table.Column title="中国物流单号" dataIndex="cn_delivery_no" />
          <Table.Column title="中国快递公司" dataIndex="cn_delivery_company" />
          <Table.Column
            title="操作时间"
            render={(row) =>
              moment(row?.updatedAt).local().format('YYYY-MM-DD hh:mm')
            }
          />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: '编辑运单', type: 'edit', data: row });
              };
              const [handleDelete] = deleteConfirm({
                name: '运单',
                submit: async () => {
                  await deleteByWaybillId({ waybillId: row?._id });
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

export default waybill;
