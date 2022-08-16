import { useState } from 'react';
import {
  Form,
  Table,
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Select,
} from 'antd';
import { Link } from 'umi';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import type { TableRowSelection } from 'antd/lib/table/interface';
////
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { getAllMABTracks } from '@/services/request/track';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import useExportMABDeliveryXlsx from '@/services/useExportMABDeliveryXlsx';
import { removeEmpty } from '@/utils/helper/helper';

export const sagawaCategory = [
  { value: '2', label: '集荷受付' },
  { value: '5', label: '配達完了' },
  { value: '-2', label: '未集荷受付' },
  { value: '-5', label: '未配達完了' },
];

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const { exportMABDeliveryApi, handleExportMABDelivery } =
    useExportMABDeliveryXlsx(selectedRows, agentOptions);

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllMABTracks({
      page,
      perPage,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.tracks || [],
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
  });

  //action
  const handleExportALL = () => {
    exportMABDeliveryApi.run(removeEmpty(form.getFieldsValue()));
  };
  const handleClear = () => {
    setSelectedRowKeys([]);
  };
  const rowSelection: TableRowSelection<API.Issue> = {
    type: 'checkbox',
    fixed: true,
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys: any[], rows: any[]) => {
      setSelectedRows(rows);
      setSelectedRowKeys(keys);
    },
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            { path: `/delivery/other`, breadcrumbName: intlMenu('delivery') },
            { path: '', breadcrumbName: intlMenu('delivery.other') },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row justify="end" gutter={16}>
          <Col flex="200px">
            <Form.Item name="agent">
              <Select
                placeholder="フォワーダー"
                allowClear
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="MAB">
              <Input placeholder="MAB" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="category">
              <Select
                placeholder="配送状態"
                allowClear
                options={sagawaCategory}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={search.submit}>
                  検索
                </Button>
                <Button onClick={search.reset}>リセット</Button>
                <Button
                  onClick={handleExportALL}
                  loading={exportMABDeliveryApi.loading}
                >
                  Export(一括)
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card
        title={intlMenu('delivery.other')}
        extra={
          <Space>
            <span>selected: {selectedRowKeys?.length || 0} items</span>
            <Button size="small" type="link" onClick={handleClear}>
              clear
            </Button>
            <Button onClick={handleExportMABDelivery}>Export</Button>
          </Space>
        }
      >
        <Table
          {...tableProps}
          rowKey="_id"
          rowSelection={rowSelection}
          scroll={{ x: 2500, y: 400 }}
        >
          <Table.Column
            title="フォワーダー"
            width={200}
            render={(row) =>
              agentOptions?.find((item) => item.value === row?.agent)?.label
            }
          />
          <Table.Column
            width={250}
            title="MAB"
            dataIndex="MAB"
            render={(MAB) => (
              <Link to={`/delivery/other/sagawa?MAB=${MAB}`}>{MAB}</Link>
            )}
          />
          <Table.Column width={250} title="件数" dataIndex="hawb_count" />
          <Table.Column
            width={250}
            title="未受付"
            render={(row) => (
              <Link to={`/delivery/other/sagawa?MAB=${row?.MAB}&category=-2`}>
                {row?.hawb_count - row?.acceptCount}
              </Link>
            )}
          />
          <Table.Column
            width={250}
            title="未配達"
            render={(row) => (
              <Link to={`/delivery/other/sagawa?MAB=${row?.MAB}&category=-5`}>
                {row?.hawb_count - row?.arriveCount}
              </Link>
            )}
          />
          <Table.Column
            width={250}
            title="Uploader"
            render={(row) =>
              userOptions?.find((item) => item.value === row?.uploader)?.label
            }
          />
          <Table.Column
            width={250}
            title="createdAt"
            render={(row) => dayFormat(row?.createdAt, 'YYYY年MM月DD日')}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
