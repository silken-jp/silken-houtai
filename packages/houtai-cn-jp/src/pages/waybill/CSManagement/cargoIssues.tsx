import React from 'react';
import { Form, Table, Input, Button, Row, Col, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybills } from '@/services/request/waybill';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (_: PaginatedParams[0], formData: Object) => {
    try {
      const data = [] || (await getAllWaybills(formData));
      return {
        total: data.length,
        list: data,
      };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  return (
    <PageContainer
      header={{
        title: intlMenu('CSManagement.cargoIssues'),
        breadcrumb: {
          routes: [
            {
              path: '/waybill/CSManagement/cargoIssues',
              breadcrumbName: intlMenu('CSManagement'),
            },
            {
              path: '',
              breadcrumbName: intlMenu('CSManagement.cargoIssues'),
            },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="HAWB番号">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={8} xxl={8}>
            <Form.Item label="MAWB番号">
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
      <Card>
        <Table rowKey="_id" {...tableProps} scroll={{ x: 1300 }}>
          <Table.Column width={180} title="代理店" />
          <Table.Column width={180} title="HAWB番号" />
          <Table.Column width={180} title="MAWB番号" />
          <Table.Column width={180} title="伝票番号" />
          <Table.Column width={180} title="新伝票番号" />
          <Table.Column width={180} title="連絡日" />
          <Table.Column width={180} title="問題該当" />
          <Table.Column width={180} title="返品状態" />
          <Table.Column width={180} title="問題詳細" />
          <Table.Column width={180} title="状態" />
          <Table.Column width={180} title="通知者" />
          <Table.Column width={180} title="回答日" />
          <Table.Column width={180} title="科目" />
          <Table.Column width={180} title="内容" />
          <Table.Column width={180} title="受取人住所" />
          <Table.Column width={180} title="受取人郵便番号" />
          <Table.Column width={180} title="受取人電話番号" />
          <Table.Column width={180} title="受取人" />
          <Table.Column width={180} title="品名" />
          <Table.Column width={180} title="個数" />
          <Table.Column width={180} title="重量" />
          <Table.Column width={180} title="発送日" />
          <Table.Column width={180} title="処理日" />
          <Table.Column width={180} title="料金科目" />
          <Table.Column width={180} title="請求年月" />
          <Table.Column width={180} title="対応方法" />
          <Table.Column width={180} title="備考" />
          <Table.Column width={180} title="登録者" />
          <Table.Column width={180} title="登録構成" />
          <Table.Column width={180} title="登録日時" />
          <Table.Column width={180} title="最後更新者" />
          <Table.Column width={180} title="最後更新構成" />
          <Table.Column width={180} title="更新日時" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
