import { useLocation } from 'umi';
import dayjs from 'dayjs';
import {
  Form,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  message,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import Actions from '@/components/Common/Actions';
import {
  getAllIrregular,
  updateIrregular,
  deleteIrregularById,
} from '@/services/request/irregular';
import IrregularForm from '../components/IrregularForm';
import UploadIrregularOther from '../components/UploadIrregularOther';
import UploadIrregularReturn from '../components/UploadIrregularReturn';
import { renderDate } from '@/utils/helper/day';

function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v ?? false));
}

const Irregular: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const { formType, formProps, handleOpen } = useSKForm.useForm<any>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialValues = {
    agent: params.get('agent'),
    start_date: dayjs(params.get('start_date')),
    end_date: dayjs(params.get('end_date')),
  };

  // api
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
    const data = await getAllIrregular({
      page,
      perPage,
      ...sorter,
      ...removeEmpty(formData),
    });
    return { total: data?.totalCount, list: data?.irregulars || [] };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
  });

  async function handleSubmit(v: any) {
    try {
      if (formType === 'edit') {
        await updateIrregular({
          irregularId: formProps?.dataSource?._id,
        });
        refresh();
      }
    } catch (error: any) {
      message.destroy();
      message.error(error?.message);
    }
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/billing/lists/irregular',
              breadcrumbName: '請求管理',
            },
            { path: '', breadcrumbName: 'イレギュラー費用' },
          ],
        },
        title: 'イレギュラー費用',
      }}
    >
      <Form
        form={form}
        className="sk-table-search"
        initialValues={initialValues}
      >
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={3}>
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
      <IrregularForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="HAWBイレギュラー費用リスト"
        extra={
          <Space>
            <UploadIrregularReturn />
            <UploadIrregularOther />
          </Space>
        }
      >
        <Table size="small" rowKey="_id" {...tableProps} scroll={{ x: 3200 }}>
          <Table.Column sorter width={120} title="HAWB" dataIndex="HAB" />
          <Table.Column
            width={80}
            title="日付"
            dataIndex="date"
            render={renderDate()}
          />
          <Table.Column width={120} title="返送番号" dataIndex={'return_no'} />
          <Table.Column width={120} title="転送番号" dataIndex="resend_no" />
          <Table.Column
            width={120}
            title="返送料金（課税）"
            dataIndex="return_price"
          />
          <Table.Column
            width={120}
            title="再発送料金（課税）"
            dataIndex="resend_price"
          />
          <Table.Column
            width={180}
            title="再発送/住所変更手数料（課税）"
            dataIndex="address_change_fee"
          />
          <Table.Column
            width={120}
            title="再梱包手数料（課税）"
            dataIndex="repack_fee"
          />
          <Table.Column
            width={150}
            title="換面単費ラベル交換（課税）"
            dataIndex="label_change_fee"
          />
          <Table.Column
            width={120}
            title="課税項目名"
            dataIndex="tax_field_name"
          />
          <Table.Column width={120} title="課税費用" dataIndex="tax_price" />
          <Table.Column width={120} title="課税備考" dataIndex="tax_note" />
          <Table.Column
            width={120}
            title="非課税項目名"
            dataIndex="no_tax_field_name"
          />
          <Table.Column
            width={120}
            title="非課税費用"
            dataIndex="no_tax_price"
          />
          <Table.Column
            width={120}
            title="非課税備考"
            dataIndex="no_tax_note"
          />
          <Table.Column
            width={60}
            fixed="right"
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集フォワーダー',
                  type: 'edit',
                  data: row,
                });
              };
              return <Actions onEdit={handleEdit} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Irregular;
