import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills, createWaybill, updateWaybill, deleteByWaybillId } from '@/services/request/waybill';
import WaybillForm from '@/components/Form/WaybillForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Waybill>();

  // api
  const getTableData = async (_: PaginatedParams[0], formData: Object) => {
    try {
      const data = await getAllWaybills(formData);
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
    <PageContainer header={{ title: `BtoB` }}>
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="日本伝票番号" name="jp_delivery_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="日本宅配会社" name="jp_delivery_company">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="中国伝票番号" name="cn_delivery_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="中国宅配会社" name="cn_delivery_company">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="FLIGHT NO" name="flight_no">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset} style={{ marginLeft: 16 }}>
                リセット
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <WaybillForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="運送状リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps}>
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="日本伝票番号" dataIndex="jp_delivery_no" />
          <Table.Column title="日本宅配会社" dataIndex="jp_delivery_company" />
          <Table.Column title="FLIGHT NO" dataIndex="flight_no" />
          <Table.Column
            title="単証入力時間"
            render={(row) =>
              row?.waybill_input_time ? dayjs(row?.waybill_input_time).format('YYYY-MM-DD HH:mm') : '-'
            }
          />
          <Table.Column title="中国伝票番号" dataIndex="cn_delivery_no" />
          <Table.Column title="中国宅配会社" dataIndex="cn_delivery_company" />
          <Table.Column title="操作時間" render={(row) => dayjs(row?.updatedAt).format('YYYY-MM-DD HH:mm')} />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: '运单', type: 'edit', data: row });
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
