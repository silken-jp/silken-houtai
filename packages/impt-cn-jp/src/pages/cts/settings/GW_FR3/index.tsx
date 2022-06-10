import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import {
  createGW_FR3,
  deleteGW_FR3ById,
  getAllGW_FR3s,
  updateGW_FR3,
} from '@/services/request/gw_FR3';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import GW_FR3Form from '@/components/Form/GW_FR3Form';

const GW_FR3Setting: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.CMN>();

  // api
  const getTableData = async (pageData: any, formData: API.Importer) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'createAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllGW_FR3s({
      page,
      perPage,
      ...sorter,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.gwFr3Settings,
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createGW_FR3(v);
      refresh();
    }
    if (formType === 'edit') {
      await updateGW_FR3({ GW_FR3Id: formProps?.dataSource?._id, ...v });
      refresh();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規運賃ルール', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: '運賃管理',
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/GW_FR3',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: '運賃管理' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="PSC">
              <Input placeholder="積出地コード" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="DST">
              <Input placeholder="取卸港コード" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="_GW">
              <Input placeholder="重量" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="FR3">
              <Input placeholder="運賃" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="FR2">
              <Input placeholder="通貨" />
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
      <GW_FR3Form type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="重量-運賃管理リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新建
          </Button>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          scroll={{ y: 'calc(100vh - 550px)' }}
        >
          <Table.Column sorter width={150} title="重量" dataIndex="_GW" />
          <Table.Column sorter width={150} title="運賃" dataIndex="FR3" />
          <Table.Column sorter width={150} title="通貨" dataIndex="FR2" />
          <Table.Column
            sorter
            width={150}
            title="積出地コード"
            dataIndex="PSC"
          />
          <Table.Column
            sorter
            width={150}
            title="取卸港コード"
            dataIndex="DST"
          />
          <Table.Column
            title="操作"
            width={80}
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集運賃ルール',
                  type: 'edit',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: '運賃ルール',
                submit: async () => {
                  await deleteGW_FR3ById({ GW_FR3Id: row?._id });
                  search.submit();
                },
              });
              return <Actions onEdit={handleEdit} onDelete={handleDelete} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default GW_FR3Setting;
