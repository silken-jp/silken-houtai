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
        title: intlMenu('CSManagement.permit'),
        breadcrumb: {
          routes: [
            {
              path: 'cn-to-jp/CSManagement/permit',
              breadcrumbName: intlMenu('CSManagement'),
            },
            {
              path: '',
              breadcrumbName: intlMenu('CSManagement.permit'),
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
          <Table.Column width={180} title="コンメン" />
          <Table.Column width={180} title="状態" />
          <Table.Column width={180} title="許可書" />
          <Table.Column width={180} title="HAWB番号" />
          <Table.Column width={180} title="MAWB番号" />
          <Table.Column width={180} title="通関開始日" />
          <Table.Column width={180} title="申告日時" />
          <Table.Column width={180} title="搬入日時" />
          <Table.Column width={180} title="許可日時" />
          <Table.Column width={180} title="搬出日時" />
          <Table.Column width={180} title="お問い合わせ番号" />
          <Table.Column width={180} title="追跡" />
          <Table.Column width={180} title="配送業者" />
          <Table.Column width={180} title="社内整理番号" />
          <Table.Column width={180} title="タイプ" />
          <Table.Column width={180} title="識別" />
          <Table.Column width={180} title="FLIGHT NO" />
          <Table.Column width={180} title="FLIGHT DATE" />
          <Table.Column width={180} title="申告番号" />
          <Table.Column width={180} title="個数" />
          <Table.Column width={180} title="重量（ＫＧ）" />
          <Table.Column width={180} title="審査検査区分" />
          <Table.Column width={180} title="関税" />
          <Table.Column width={180} title="消費税" />
          <Table.Column width={180} title="地方消費税" />
          <Table.Column width={180} title="納税額合計" />
          <Table.Column width={180} title="申告等種別" />
          <Table.Column width={180} title="大額・少額識別" />
          <Table.Column width={180} title="申告先種別コード" />
          <Table.Column width={180} title="口座識別" />
          <Table.Column width={180} title="納付方法" />
          <Table.Column width={180} title="通関蔵置場" />
          <Table.Column width={180} title="記事（税関用）" />
          <Table.Column width={180} title="作成日時" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
