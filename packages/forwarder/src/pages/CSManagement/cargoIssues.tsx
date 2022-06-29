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
import CargoIssueForm from '@/components/Form/CargoIssueForm';
import useSKForm from '@silken-houtai/core/lib/useHooks';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Driver>();

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

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'edit') {
      // await updateDriver({ driverId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleEdit = () => {
    handleOpen({ title: '編集', type: 'edit', data: null });
  };

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
      <CargoIssueForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name="waybill_type">
              <Select
                allowClear
                placeholder="状態"
                options={[
                  { label: '問題作成', value: '1' },
                  { label: '代理店対応中', value: '2' },
                  { label: 'SC対応中', value: '3' },
                  { label: '対応完了', value: '4' },
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
                placeholder="問題該当"
                options={[
                  { label: '破損', value: '1' },
                  { label: '搬入時破損', value: '2' },
                  { label: '住所不明', value: '3' },
                  { label: '受取辞退', value: '4' },
                  { label: 'ラベル剥がれ', value: '5' },
                  { label: '長期不在', value: '6' },
                  { label: '住所変更', value: '7' },
                  { label: '滅却', value: '8' },
                  { label: '代替品', value: '9' },
                  { label: '紛失', value: '0' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Select
                allowClear
                placeholder="返品状態"
                options={[
                  { label: '返品済', value: '1' },
                  { label: '未', value: '2' },
                  { label: '搬入時', value: '3' },
                  { label: '滅却', value: '4' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Input placeholder="伝票番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item>
              <Input placeholder="新伝票番号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item>
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item>
              <DatePicker.RangePicker
                disabled
                placeholder={['登録開始日', '登録終了日']}
              />
            </Form.Item>
          </Col>
          <Col flex="160px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                検索
              </Button>
              <Button onClick={search.reset}>リセット</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        extra={
          <Button type="primary" onClick={handleEdit}>
            編集
          </Button>
        }
      >
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
          {/* <Table.Column width={180} title="個数" />
          <Table.Column width={180} title="重量" /> */}
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
