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
import { getAgentInfo } from '@/services/useStorage';
import { useIntlFormat } from '@/services/useIntl';
import { getAllWaybillsAdvance } from '@/services/request/waybill';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const agentInfo = getAgentInfo();

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
    console.log(search);
    const data = await getAllWaybillsAdvance({
      ...search,
      waybill_status: 1,
      LS: 'M',
      page,
      perPage,
      sortField: 'createdAt',
      sortOrder: -1,
    });
    return { total: data?.totalCount, list: data?.waybills };
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
                  { label: 'FLIGHT NO', value: '1', disabled: true },
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
          {/* <Table.Column
            width={180}
            title="フォワーダー"
            render={() => agentInfo?.name}
          /> */}
          <Table.Column width={180} title="コンメン" />
          <Table.Column width={180} title="状態" />
          <Table.Column width={180} title="許可書" />
          <Table.Column width={180} title="HAWB番号" dataIndex="HAB" />
          <Table.Column width={180} title="MAWB番号" dataIndex="MAB" />
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
          <Table.Column width={180} title="識別" dataIndex="waybill_type" />
          <Table.Column width={180} title="FLIGHT NO" />
          <Table.Column width={180} title="FLIGHT DATE" />
          <Table.Column width={180} title="申告番号" />
          <Table.Column width={180} title="個数" dataIndex="NO" />
          <Table.Column width={180} title="重量（ＫＧ）" dataIndex="GW" />
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
