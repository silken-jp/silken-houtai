import { useState } from 'react';
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
import { dayFormat } from '@/utils/helper/day';
import { useAgentOptions, useUserOptions } from '@/services/useAPIOption';
import { getAllTrackings } from '@/services/request/tracking';

const EXA_DIS_OPT: any[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '3k', label: '3k' },
];

const MIC_IDA_OPT: any[] = [
  { value: '0', label: 'MIC' },
  { value: '1', label: 'IDA' },
];

const Tracking: React.FC = () => {
  // state
  const [form] = Form.useForm();
  // const [selectedRows, setSelectedRows] = useState<any>();

  // const selectedRow = selectedRows?.length === 1 ? selectedRows[0] : null;

  // api
  const { agentOptions } = useAgentOptions();
  const { userOptions } = useUserOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let sorter: any = {};
    if (typeof pageData?.sorter?.field === 'string') {
      sorter.sortField = pageData?.sorter?.field;
    } else if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else {
      sorter.sortField = 'createdAt';
    }
    if (pageData?.sorter?.order === 'ascend') {
      sorter.sortOrder = 1;
    }
    if (pageData?.sorter?.order === 'descend') {
      sorter.sortOrder = -1;
    }
    const data = await getAllTrackings({
      page,
      perPage,
      ...formData,
      ...sorter,
    });
    return {
      total: data?.totalCount,
      list: data?.waybills,
    };
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    manual: true,
    // defaultPageSize: 500,
  });

  // const rowSelection: any = {
  //   type: 'checkbox',
  //   fixed: true,
  //   selectedRowKeys: selectedRows?.map((s: any) => s?._id) || [],
  //   preserveSelectedRowKeys: true,
  //   onChange: (_: any[], selectedRows: any[]) => {
  //     setSelectedRows(selectedRows);
  //   },
  //   getCheckboxProps: (record: any) => ({
  //     disabled: !record._id,
  //     name: record._id,
  //   }),
  // };

  return (
    <PageContainer
      header={{
        breadcrumb: {
          routes: [
            {
              path: '/waybill/Tracking',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: '通関結果' },
          ],
        },
        title: '通関結果',
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="180px">
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="EXA_DIS">
              <Select
                allowClear
                placeholder="審査検査区分"
                options={EXA_DIS_OPT}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="MIC_IDA">
              <Select allowClear placeholder="MIC_IDA" options={MIC_IDA_OPT} />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="160px">
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
        title={<>合計: {tableProps.pagination.total} 件</>}
        // extra={
        //   <Space>
        //     <span>selected: {selectedRows?.length || 0} items</span>
        //     <Button
        //       size="small"
        //       type="link"
        //       onClick={() => setSelectedRows(null)}
        //     >
        //       clear
        //     </Button>
        //   </Space>
        // }
      >
        <Table
          size="small"
          // rowSelection={rowSelection}
          rowKey="_id"
          {...tableProps}
        >
          <Table.Column
            sorter
            width={100}
            title="フォワーダー"
            dataIndex="agent"
            render={(agentId) =>
              agentOptions?.find((item) => item?.value === agentId)?.label
            }
          />
          <Table.Column sorter width={100} title="HAWB番号" dataIndex="BL_" />
          <Table.Column
            sorter
            width={100}
            title="MAWB番号"
            dataIndex="MAWB_NO"
          />
          <Table.Column sorter width={60} title="識別" dataIndex="MIC_IDA" />
          <Table.Column
            sorter
            width={60}
            title="審査検査区分"
            dataIndex="EXA_DIS"
          />
          <Table.Column
            sorter
            width={120}
            title="DEC_date"
            dataIndex="DEC_date"
            render={(DEC_date) => dayFormat(DEC_date, 'YYYY.MM.DD')}
          />
          <Table.Column
            sorter
            width={120}
            title="PER_date"
            dataIndex="PER_date"
            render={(PER_date) => dayFormat(PER_date, 'YYYY.MM.DD')}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Tracking;
