import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
////
import { useIntlFormat } from '@/services/useIntl';
import UploadWaybill from '@/components/Common/UploadWaybill';
import { getAllWaybills, deleteByWaybillId } from '@/services/request/waybill';
import { deleteConfirm } from '@/components/Common/Actions';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
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

  return (
    <PageContainer
      header={{
        title: `${intlMenu('waybill.BtoC')}`,
        breadcrumb: {
          routes: [
            {
              path: '/jp-to-cn/waybill/BtoC',
              breadcrumbName: intlMenu('waybill'),
            },
            { path: '', breadcrumbName: intlMenu('waybill.BtoC') },
          ],
        },
      }}
    >
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
      <Card
        title="運送状リスト"
        extra={
          <UploadWaybill
            onUploadCreate={search.submit}
            onUploadUpdate={search.submit}
          />
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
              row?.waybill_input_time
                ? dayjs(row?.waybill_input_time).format('YYYY-MM-DD HH:mm')
                : '-'
            }
          />
          <Table.Column title="中国伝票番号" dataIndex="cn_delivery_no" />
          <Table.Column title="中国宅配会社" dataIndex="cn_delivery_company" />
          <Table.Column
            title="操作時間"
            render={(row) => dayjs(row?.updatedAt).format('YYYY-MM-DD HH:mm')}
          />
          <Table.Column
            title="操作"
            render={(row: any) => {
              const [handleDelete] = deleteConfirm({
                name: '运单',
                submit: async () => {
                  await deleteByWaybillId({ waybillId: row?._id });
                  search.submit();
                },
              });
              return (
                <Button type="link" onClick={handleDelete}>
                  削除
                </Button>
              );
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
