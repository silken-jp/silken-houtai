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
import { useIntlFormat } from '@/services/useIntl';
import { useAgentOptions } from '@/services/useAPIOption';
import { getAllTrackingsFull } from '@/services/request/tracking';
import { dayFormat } from '@/utils/helper/day';

const StatusInquiryNotPer: React.FC = () => {
  // state
  const searchParams = (useLocation() as any).query;
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');

  // api
  const { agentOptions } = useAgentOptions();
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
    // const data = await getAllWaybills({
    //   page,
    //   perPage,
    //   ...sorter,
    //   ...formData,
    //   flightStartDate: formData?.flightStartDate?.format('YYYY.MM.DD'),
    //   flightEndDate: formData?.flightEndDate?.format('YYYY.MM.DD'),
    // });
    const data = await getAllTrackingsFull({
      ...formData,
      ...searchParams,
      category: 'isCheck',
    });
    return { total: data?.length, list: data || [] };
  };
  const { tableProps } = useAntdTable(getTableData, {
    form,
  });

  const fixExpData = tableProps.dataSource?.map((item: any) => ({
    検査状態: [, '検査待ち', '検査済み'][item?.status],
    許可日: item?.PER_date,
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
            { path: '', breadcrumbName: '検査詳細' },
          ],
        },
        title: '検査詳細',
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
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightStartDate">
              <DatePicker placeholder="許可日start" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="flightEndDate">
              <DatePicker placeholder="許可日end" />
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
            title="検査状態"
            render={(_, row: any) => {
              return [
                <></>,
                <Badge status="success" text="検査済み" />,
                <Badge status="warning" text="検査待ち" />,
              ][row?.status];
            }}
          />
          <Table.Column
            width={150}
            title="許可日"
            dataIndex="PER_date"
            render={(DATE) => dayFormat(DATE)}
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

export default StatusInquiryNotPer;
