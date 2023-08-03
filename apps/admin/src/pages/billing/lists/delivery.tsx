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
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllWaybills } from '@/services/request/waybill';
import UploadDelivery from '../components/UploadDelivery';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const SagawaDelivery: React.FC = () => {
  // state
  const [form] = Form.useForm();

  // api
  const { agentOptions } = useAgentOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'flightDate';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllWaybills({
      page,
      perPage,
      ...sorter,
      ...removeEmpty(formData),
    });
    return { total: data?.totalCount, list: data?.waybills || [] };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    manual: true,
  });

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/billing/lists/delivery',
              breadcrumbName: '請求管理',
            },
            { path: '', breadcrumbName: '佐川請求料金' },
          ],
        },
        title: '佐川請求料金',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col>
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
        title="佐川請求料金リスト"
        extra={<UploadDelivery onUpload={search.submit} />}
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 3500 }}>
          <Table.Column
            sorter
            width={100}
            title="請求書番号"
            dataIndex={['delivery_invoice', 'invoice_no']}
          />
          <Table.Column
            sorter
            width={100}
            title="お客様コード"
            dataIndex={['delivery_invoice', 'customer_no']}
          />
          <Table.Column
            sorter
            width={200}
            title="お客様名称１"
            dataIndex={['delivery_invoice', 'customer_name1']}
          />
          <Table.Column
            sorter
            width={200}
            title="お客様名称２"
            dataIndex={['delivery_invoice', 'customer_name2']}
          />
          <Table.Column
            sorter
            width={100}
            title="伝票種別"
            dataIndex={['delivery_invoice', 'document_type']}
          />
          <Table.Column
            sorter
            width={100}
            title="担当営業所種別"
            dataIndex={['delivery_invoice', 'office_type']}
          />
          <Table.Column
            sorter
            width={100}
            title="担当営業所名称"
            dataIndex={['delivery_invoice', 'office_name']}
          />
          <Table.Column
            sorter
            width={100}
            title="日付種別"
            dataIndex={['delivery_invoice', 'date_type']}
          />
          <Table.Column
            sorter
            width={100}
            title="出荷日"
            dataIndex={['delivery_invoice', 'shipment_date']}
          />
          <Table.Column
            sorter
            width={100}
            title="お問合せNO"
            dataIndex={['delivery_invoice', 'hab']}
          />
          <Table.Column
            sorter
            width={100}
            title="都道府県"
            dataIndex={['delivery_invoice', 'state']}
          />
          <Table.Column
            sorter
            width={100}
            title="営業所種別"
            dataIndex={['delivery_invoice', 'sales_office_type']}
          />
          <Table.Column
            sorter
            width={100}
            title="営業所名称"
            dataIndex={['delivery_invoice', 'sales_office_name']}
          />
          <Table.Column
            sorter
            width={100}
            title="便種名称"
            dataIndex={['delivery_invoice', 'flight_type']}
          />
          <Table.Column
            sorter
            width={100}
            title="個数"
            dataIndex={['delivery_invoice', 'no']}
          />
          <Table.Column
            sorter
            width={100}
            title="税区分"
            dataIndex={['delivery_invoice', 'tax_category']}
          />
          <Table.Column
            sorter
            width={100}
            title="運賃合計金額"
            dataIndex={['delivery_invoice', 'fee']}
          />
          <Table.Column
            sorter
            width={100}
            title="代引手数料"
            dataIndex={['delivery_invoice', 'COD_fee']}
          />
          <Table.Column
            sorter
            width={100}
            title="保険料"
            dataIndex={['delivery_invoice', 'insurance_fee']}
          />
          <Table.Column
            sorter
            width={100}
            title="中継料"
            dataIndex={['delivery_invoice', 'relay_fee']}
          />
          <Table.Column
            sorter
            width={100}
            title="運賃請求金額"
            dataIndex={['delivery_invoice', 'total_fee']}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default SagawaDelivery;
