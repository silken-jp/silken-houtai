import React from 'react';
import { Table, Card, Button, Form, Input, Row, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllFlights, createFlight, updateFlight, deleteByFlightId } from '@/services/request/flight';
import FlightForm from '@/components/Form/FlightForm';
import { useSKForm } from '@/components/Form/useSKForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

function timeToTime(value: number) {
  return `+${Math.floor(value / 60)}h${value % 60}min`;
}

export interface FlightSettingProps {}

const FlightSetting: React.FC<FlightSettingProps> = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm<API.Flight>();

  // api
  const getTableData = async (pageData: PaginatedParams[0], formData: Object) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data = await getAllFlights();
      return {
        total: data.length,
        list: data,
      };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createFlight(v);
      search.submit();
    }
    if (formType === 'edit') {
      await updateFlight({ flightId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: 'Flight', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: `${intlMenu('setting.flight')}`,
        breadcrumb: {
          routes: [
            { path: '/setting/flight', breadcrumbName: intlMenu('setting') },
            { path: '', breadcrumbName: intlMenu('setting.flight') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row>
          <Col span={8}>
            <Form.Item label="FlightNo" name="flight_no">
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
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
      <FlightForm {...formProps} onSubmit={handleSubmit} />
      <Card
        title="Flightリスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table {...tableProps} rowKey="_id">
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="FlightNo" dataIndex="flight_no" />
          <Table.Column title="日本便出発" render={(row) => timeToTime(row?.jp_depart_time)} />
          <Table.Column title="日本到着" render={(row) => timeToTime(row?.arrive_time)} />
          <Table.Column title="通関中" render={(row) => timeToTime(row?.clearance_time)} />
          <Table.Column title="更新時間" render={(row) => dayjs(row?.updatedAt)?.format('YYYY-MM-DD HH:mm')} />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: 'Flight', type: 'edit', data: row });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.flight_no,
                submit: async () => {
                  await deleteByFlightId({ flightId: row?._id });
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

export default FlightSetting;
