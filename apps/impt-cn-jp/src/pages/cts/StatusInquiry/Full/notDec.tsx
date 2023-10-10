import { useLocation } from 'umi';
import dayjs from 'dayjs';
import {
  Form,
  Badge,
  Table,
  Input,
  Button,
  Row,
  Col,
  Card,
  Space,
  DatePicker,
  Select,
} from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import ExportXlsx from '@/pages/cts/StatusInquiry/components/ExportXlsx';
import { dayFormat } from '@/utils/helper/day';
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import { getAllTrackingsFull } from '@/services/request/tracking';

const StatusInquiryNotDec: React.FC = () => {
  // state
  const searchParams = (useLocation() as any).query;
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();
  const getTableData = async (pageData: any, formData: any) => {
    // const page = pageData.current - 1;
    // const perPage = pageData.pageSize;
    // let sorter: any = {};
    // if (typeof pageData?.sorter?.field === 'string') {
    //   sorter.sortField = pageData?.sorter?.field;
    // } else if (Array.isArray(pageData?.sorter?.field)) {
    //   sorter.sortField = pageData?.sorter?.field?.join('.');
    // } else {
    //   sorter.sortField = 'flightDate';
    // }
    // if (pageData?.sorter?.order === 'ascend') {
    //   sorter.sortOrder = 1;
    // }
    // if (pageData?.sorter?.order === 'descend') {
    //   sorter.sortOrder = -1;
    // }
    const data = await getAllTrackingsFull({
      ...formData,
      ...searchParams,
      category: 'notDec',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps } = useAntdTable(getTableData, {
    form,
  });

  const fixExpData = tableProps.dataSource?.map((item: any) => ({
    申告状態: [, '申告待ち', '時間オーバー'][item?.status],
    未申告理由: item?.DEC_date,
    HAWB番号: item?.HAB,
    到着日: item?.DATE,
    登録時間: item?.createdAt,
  }));

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/cts/StatusInquiry/Full',
              breadcrumbName: intlMenu('cts'),
            },
            {
              path: '',
              breadcrumbName: 'Full Status Inquiry',
            },
            { path: '', breadcrumbName: '未申告詳細' },
          ],
        },
        title: `MAB: ${searchParams?.MAB}`,
      }}
    >
      {/* <Form
        form={form}
        className="sk-table-search"
        initialValues={{
          ...searchParams,
        }}
      >
        <Row justify="end" gutter={16}>
          <Col span={3}>
            <Form.Item name="agentId">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="broker">
              <Select
                allowClear
                placeholder="ブローカー"
                options={userOptions}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightStartDate">
              <DatePicker placeholder="到着開始日" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightEndDate">
              <DatePicker placeholder="到着終了日" />
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
      </Form> */}
      <Card
        title={<>合計: {tableProps.pagination.total} 件</>}
        extra={
          <ExportXlsx filename={searchParams?.MAB} dataSource={fixExpData} />
        }
      >
        <Table
          size="small"
          rowKey="_id"
          {...tableProps}
          pagination={false}
          scroll={{ y: 'calc(100vh - 380px)' }}
        >
          <Table.Column
            width={150}
            title="申告状態"
            render={(_, row: any) => {
              return [
                <></>,
                <Badge status="warning" text="申告待ち" />,
                <Badge status="error" text="時間オーバー" />,
              ][row?.status];
            }}
          />
          <Table.Column width={300} title="未申告理由" dataIndex="" />
          <Table.Column
            width={150}
            title="ブローカー"
            dataIndex="broker"
            render={(broker) =>
              userOptions?.find((item) => item?.value === broker)?.label
            }
          />
          <Table.Column width={150} title="HAWB番号" dataIndex="HAB" />
          <Table.Column
            width={150}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column
            width={150}
            title="到着日"
            dataIndex="DATE"
            render={(DATE) => dayFormat(DATE, 'YYYY.MM.DD')}
          />
          <Table.Column
            width={180}
            title="登録時間"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default StatusInquiryNotDec;
