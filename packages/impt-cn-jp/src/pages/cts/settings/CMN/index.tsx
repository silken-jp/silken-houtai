import {
  Table,
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import { useIntlFormat } from '@/services/useIntl';
import {
  getAllCMNs,
  createCMN,
  updateCMN,
  deleteCMN,
} from '@/services/request/cmn';
import { deleteConfirm } from '@/components/Common/Actions';
import CMNForm from '@/components/Form/CMNForm';

const CMNSetting: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.CMN>();

  // api
  const getTableData = async (pageData: any, formData: API.CMN) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllCMNs({
      page,
      perPage,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.cmnSettings,
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, { form });
  const createCMN_API = useRequest(createCMN, {
    manual: true,
    onSuccess: refresh,
  });
  const updateCMN_API = useRequest(updateCMN, {
    manual: true,
    onSuccess: refresh,
  });
  const deleteCMN_API = useRequest(deleteCMN, {
    manual: true,
    onSuccess: refresh,
  });
  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      createCMN_API.run(v);
    }
  };
  const handleAdd = () => {
    handleOpen({ title: '新規品名変換ルール', type: 'add', data: null });
  };
  const onCell = (row: any, rowIndex?: number) => {
    const firstIndex = tableProps?.dataSource?.findIndex(
      (item) => item?.modifed_CMN === row.modifed_CMN,
    );
    if (rowIndex === firstIndex) {
      return {
        rowSpan: tableProps?.dataSource.reduce(
          (a, b) => (row.modifed_CMN === b.modifed_CMN ? a + 1 : a),
          0,
        ),
      };
    } else {
      return { rowSpan: 0 };
    }
  };

  return (
    <PageContainer
      header={{
        title: '品名変換リスト',
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/CMN',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: '品名変換リスト' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col span={4}>
            <Form.Item name="origin_CMN">
              <Input placeholder="Origin" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="modifed_CMN">
              <Input placeholder="Modifed" />
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
      <CMNForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Card
        title="品名変換リスト"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新規
          </Button>
        }
      >
        <Table rowKey="_id" size="small" bordered {...tableProps}>
          <Table.Column
            width={100}
            title="Remove Origin"
            render={(row) => {
              const [handleDelete] = deleteConfirm({
                title: `REMOVE [ ${row?.origin_CMN} ]`,
                submit: async () => {
                  deleteCMN_API.run({ origin_CMN: row?.origin_CMN });
                },
              });
              return (
                <Button size="small" type="ghost" danger onClick={handleDelete}>
                  削除
                </Button>
              );
            }}
          />
          <Table.Column
            title="Origin"
            render={(row) => {
              return (
                <Typography.Paragraph
                  style={{ margin: 0 }}
                  editable={{
                    tooltip: 'click to edit text',
                    onChange: (v: string) => {
                      if (row?.origin_CMN !== v) {
                        updateCMN_API.run({
                          before_origin_CMN: row?.origin_CMN,
                          after_origin_CMN: v,
                        });
                      }
                    },
                  }}
                >
                  {row?.origin_CMN}
                </Typography.Paragraph>
              );
            }}
          />
          <Table.Column
            title="Modifed"
            onCell={onCell}
            render={(row) => {
              return (
                <Typography.Paragraph
                  style={{ margin: 0 }}
                  editable={{
                    tooltip: 'click to edit text',
                    onChange: (v: string) => {
                      if (row?.modifed_CMN !== v) {
                        updateCMN_API.run({
                          before_modifed_CMN: row?.modifed_CMN,
                          after_modifed_CMN: v,
                        });
                      }
                    },
                  }}
                >
                  {row?.modifed_CMN}
                </Typography.Paragraph>
              );
            }}
          />
          <Table.Column
            width={100}
            title="Add To Modifed"
            onCell={onCell}
            render={(row) => {
              const handleEdit = () => {
                handleOpen({
                  title: '追加品名変換ルール',
                  type: 'add',
                  data: row,
                });
              };
              return (
                <Button size="small" type="primary" onClick={handleEdit}>
                  追加
                </Button>
              );
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default CMNSetting;
