import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
////
import { useIntlPage } from '@/services/useIntl';
import UploadXlsx from '@/components/Upload/UploadXlsx';
import {
  getAllWaybills,
  createMultiWaybill,
  updateMultiWaybill,
  deleteByWaybillId,
} from '@/services/request/waybill';
import { deleteConfirm } from '@/components/Common/Actions';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const intlPage = useIntlPage();

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

  async function onUploadCreate(jsonArr: any) {
    const { successCount, failedNo } = await createMultiWaybill(jsonArr);
    search.submit();
    const success =
      successCount > 0
        ? {
            message: '批量新建导入完成',
            description: `已成功导入，并生成了 ${successCount}/${
              jsonArr.length - 1
            } 条数据`,
          }
        : null;
    const failed =
      failedNo?.length > 0
        ? {
            message: success ? '部分数据新建失败' : '导入失败',
            description: `新建失败行数：${failedNo.join(', ')}`,
          }
        : null;
    return { success, failed };
  }

  async function onUploadUpdate(jsonArr: any) {
    const { successCount, failedNo } = await updateMultiWaybill(jsonArr);
    search.submit();
    const success =
      successCount > 0
        ? {
            message: '批量更新导入完成',
            description: `已成功导入，并更新了 ${successCount}/${
              jsonArr.length - 1
            } 条数据`,
          }
        : null;
    const failed =
      failedNo?.length > 0
        ? {
            message: success ? '部分数据更新失败' : '导入失败',
            description: `更新失败行数：${failedNo.join(', ')}`,
          }
        : null;
    return { success, failed };
  }

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
      <Card
        title="运单列表"
        extra={
          <Space>
            <a
              href="http://onassets.weixin-jp.com/assets/waybills-import.xlsx"
              download
            >
              导入模板下载
            </a>
            <UploadXlsx onUpload={onUploadCreate} text="批量新建" />
            <UploadXlsx onUpload={onUploadUpdate} text="批量更新" />
          </Space>
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
              const [handleDelete] = deleteConfirm({
                name: '运单',
                submit: async () => {
                  await deleteByWaybillId({ waybillId: row?._id });
                  search.submit();
                },
              });
              return (
                <Button type="link" onClick={handleDelete}>
                  删除
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