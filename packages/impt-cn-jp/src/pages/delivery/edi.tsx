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
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { dayFormat } from '@/utils/helper/day';
import UploadDeliveryFile from '@/components/Common/UploadDeliveryFile';
import { useIntlFormat } from '@/services/useIntl';
import { getAllEDIs } from '@/services/request/edi-put';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';

interface DeliveryProps {}

const Delivery: React.FC<DeliveryProps> = (props) => {
  // state
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const data = await getAllEDIs({
      page,
      perPage,
      sortField: 'createdAt',
      sortOrder: -1,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.ediPuts || [],
    };
  };
  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 100,
  });

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
            <Form.Item name="filename">
              <Input placeholder="ファイル名" />
            </Form.Item>
          </Col>
          <Col flex="200px">
            <Form.Item name="uploader">
              <Select
                placeholder="アップローダー"
                allowClear
                options={userOptions}
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
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card title={intlMenu('delivery.other')} extra={<UploadDeliveryFile />}>
        <Table {...tableProps} rowKey="_id" scroll={{ y: 400 }}>
          <Table.Column
            title="フォワーダー"
            width={200}
            render={(row) =>
              agentOptions?.find((item) => item.value === row?.agent)?.label
            }
          />
          <Table.Column title="ファイル名" width={200} dataIndex="filename" />
          <Table.Column title="MAB" width={200} dataIndex="MAB" />
          <Table.Column title="件数" width={200} dataIndex="hawb_count" />
          <Table.Column
            title="アップローダー"
            width={200}
            dataIndex="uploader"
            render={(uploader) =>
              userOptions?.find((item) => item.value === uploader)?.label
            }
          />
          <Table.Column
            title="アップロード時間"
            width={200}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Delivery;
