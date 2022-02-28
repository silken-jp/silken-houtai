import { Table, Card, Button, Form, Input, Row, Col, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import { useIntlFormat } from '@/services/useIntl';
import MICkeyForm from '@/components/Form/MICkeyForm';
import Actions, { deleteConfirm } from '@/components/Common/Actions';

const MICkey: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.MICkeys>();

  // api
  const getTableData = async (
    pageData: PaginatedParams[0],
    formData: Object,
  ) => {
    try {
      const page = pageData.current - 1;
      const perPage = pageData.pageSize;
      const data: any[] = [
        {
          price: [1, 200999],
          words: 'sweater, T-shirt',
          code: 'IDA',
          LS: 'S',
          tab: 'S',
        },
        {
          price: [200999],
          words: 'sweater, T-shirt',
          code: 'MIC',
          LS: '',
          tab: 'M',
        },
        {
          price: [20099900],
          words: 'sweater, T-shirt',
          code: 'IDA',
          LS: 'L',
          tab: 'O',
        },
      ]; // await getAllDrivers();
      return {
        total: data.length,
        list: data,
      };
    } catch (error: any) {
      return { error };
    }
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      // await createDriver(v);
      search.submit();
    }
    if (formType === 'edit') {
      // await updateDriver({ driverId: formProps?.dataSource?._id, ...v });
      search.submit();
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規フォルダ変更', type: 'add', data: null });
  };

  return (
    <PageContainer
      header={{
        title: `${intlMenu('setting.MICkey')}`,
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/MICkey',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: intlMenu('setting.MICkey') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="キーワード" name="words">
              <Input placeholder="キーワード" />
            </Form.Item>
          </Col>
          <Col span={8}></Col>
          <Col span={8}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <MICkeyForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="フォルダ変更リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" {...tableProps} scroll={{ x: 1200 }}>
          <Table.Column width={80} title="No" render={(_, __, i) => i + 1} />
          <Table.Column
            width={180}
            title="金額設定"
            render={(row) =>
              `${row?.price?.[0] || 1} ~ ${row?.price?.[1] || ''}`
            }
          />
          <Table.Column width={800} title="キーワード" dataIndex="words" />
          <Table.Column width={160} title="業務コード" dataIndex="code" />
          {/* <Table.Column width={100} title="LS" dataIndex="LS" /> */}
          <Table.Column width={200} title="Value Group" dataIndex="tab" />
          <Table.Column
            width={80}
            title="操作"
            render={(row: any) => {
              const handleEdit = () => {
                handleOpen({
                  title: '編集フォルダ変更',
                  type: 'edit',
                  data: row,
                });
              };
              const [handleDelete] = deleteConfirm({
                name: row?.name,
                submit: async () => {
                  // await deleteByDriverId({ driverId: row?._id });
                  search.submit();
                },
              });
              // TODO: copy機能
              return <Actions onEdit={handleEdit} onDelete={handleDelete} />;
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default MICkey;
