import React from 'react';
import { Table, Card, Button, Form, Input, Row, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
////
import { useIntlPage } from '@/services/useIntl';
import {
  getAllFlights,
  createFlight,
  updateFlight,
  deleteByFlightId,
} from '@/services/request/flight';
import FlightForm from '@/components/Form/FlightForm';
import { useSKForm } from '@/components/Form/useSKForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

export interface FlightSettingProps {}

const FlightSetting: React.FC<FlightSettingProps> = () => {
  // state
  const intlPage = useIntlPage();
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } = useSKForm<API.Flight>();
  // api
  const getTableData = async (
    pageData: PaginatedParams[0],
    formData: Object,
  ) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data = await getAllFlights({});
      return {
        total: data.length,
        list: data,
      };
    } catch (error) {
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
    handleOpen({ title: '新建航班', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: `${intlPage.flight}`,
        breadcrumb: {
          routes: [
            { path: '', breadcrumbName: intlPage.setting },
            { path: '', breadcrumbName: intlPage.flight },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row>
          <Col span={8}>
            <Form.Item label="航班号" name="flight_no">
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
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
      <FlightForm {...formProps} onSubmit={handleSubmit} />
      <Card
        title="航班列表"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table {...tableProps} rowKey="_id">
          <Table.Column title="ID" render={(_, __, i) => i + 1} />
          <Table.Column title="航班号" dataIndex="flight_no" />
          <Table.Column title="日本航班起飞" dataIndex="jp_depart_time" />
          <Table.Column title="航班到达" dataIndex="arrive_time" />
          <Table.Column title="通关中" dataIndex="clearance_time" />
          <Table.Column
            title="修改时间"
            dataIndex="updatedAt"
            render={(updatedAt) =>
              moment(updatedAt).local().format('YYYY-MM-DD HH:mm')
            }
          />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({ title: '编辑航班', type: 'edit', data: row });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.flight_no,
                submit: async () => {
                  await deleteByFlightId({ flightId: row?._id });
                  search.submit();
                },
              });
              return (
                <Actions
                  iconType="button"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default FlightSetting;
