import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  Select,
  DatePicker,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let { search1, search2, ...search } = formData;
    if (search1?.key && search1?.value) {
      search[search1.key] = search1.value;
    }
    if (search2?.key && search2?.value) {
      search[search2.key] = search2.value;
    }
    const data: any[] = [];
    return { total: data?.length, list: data };
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
        <Row gutter={8}>
          <Col flex="100px">
            <Form.Item name="waybill_type">
              <Select
                allowClear
                placeholder="識別"
                options={[
                  { label: 'MIC', value: 'MIC' },
                  { label: 'IDA', value: 'IDA' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="通関結果"
                options={[
                  { label: '許可', value: '1', disabled: true },
                  { label: '未許可', value: '2', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item>
              <Select
                allowClear
                placeholder="納税"
                options={[
                  { label: '有税', value: '1', disabled: true },
                  { label: '無税', value: '2', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="タイプ"
                options={[
                  { label: 'BtoC', value: 'BtoC', disabled: true },
                  { label: 'BtoB', value: 'BtoB', disabled: true },
                  {
                    label: 'AMAZON FBA',
                    value: 'AMAZON FBA',
                    disabled: true,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item>
              <DatePicker.RangePicker
                disabled
                placeholder={['許可開始日', '許可終了日']}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name={['search1', 'key']}>
              <Select
                allowClear
                placeholder="項目名"
                options={[
                  { label: 'FLIGHT NO', value: 'VSN' },
                  { label: '個数', value: 'NO' },
                  { label: '重量（KG）', value: 'GW' },
                  { label: '審査検査区分', value: '2', disabled: true },
                  { label: '関税', value: '3', disabled: true },
                  { label: '消費税', value: '4', disabled: true },
                  { label: '地方消費税', value: '5', disabled: true },
                  { label: '納税額合計', value: '6', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item name={['search1', 'value']}>
              <Input placeholder="検査内容" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name={['search2', 'key']}>
              <Select
                allowClear
                placeholder="項目名"
                options={[
                  { label: 'HAWB番号', value: 'HAB' },
                  { label: 'お問い合わせ番号', value: '1', disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name={['search2', 'value']}>
              <Input placeholder="HAWB番号/お問い合わせ番号/申告番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="配送業者"
                options={[{ label: '佐川急便', value: '1', disabled: true }]}
              />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card>
        <Table rowKey="_id" {...tableProps} scroll={{ x: 6000 }}>
          <Table.Column width={180} title="フォワーダー" />
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
