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
  message,
  DatePicker,
} from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useExportIssueXlsx from '@/services/useExportIssueXlsx';
import { useIntlFormat } from '@/services/useIntl';
import CargoIssueForm from '@/components/Form/CargoIssueForm';
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { getAllIssues, updateIssue } from '@/services/request/issue';
import { useUserOptions } from '@/services/useAPIOption';
import { dayFormat } from '@/utils/helper/day';
import { getAgentInfo } from '@/services/useStorage';
import { removeEmpty } from '@/utils/helper/helper';

const waybill: React.FC = () => {
  // state
  const [form] = Form.useForm();
  const agentInfo = getAgentInfo();
  const [intlMenu] = useIntlFormat('menu');
  const [intlPages] = useIntlFormat('pages');
  const [intlWaybill] = useIntlFormat('waybill');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Issue>();
  const { userOptions } = useUserOptions();

  const { exportIssuesApi, handleExportIssues } = useExportIssueXlsx(
    selectedRows,
    userOptions,
  );

  // api
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    const { createdDateArr, ...params } = formData;
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
    if (createdDateArr?.[0] && createdDateArr?.[1]) {
      params.createdStartDate = createdDateArr?.[0]?.startOf('day').toString();
      params.createdEndDate = createdDateArr?.[1]?.endOf('day').toString();
    }
    const data = await getAllIssues({
      page,
      perPage,
      agent: agentInfo?._id,
      ...sorter,
      ...params,
    });
    return { total: data?.totalCount, list: data?.data };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'edit') {
      await updateIssue({
        issueId: selectedRowKeys[0],
        reply_subject: v?.reply_subject,
        reply_date: v?.reply_date?.toString(),
        reply_content: v?.reply_content,
        receiver_name: v?.receiver_name,
        receiver_tel: v?.receiver_tel,
        receiver_zip: v?.receiver_zip,
        receiver_add: v?.receiver_add,
        CMN: v?.CMN,
      });
      search.submit();
      handleClear();
    }
  };
  const handleEdit = () => {
    if (selectedRows?.length === 0) {
      message.warn('編集項目を選択してください。');
    } else if (selectedRows?.length === 1) {
      handleOpen({
        title: intlPages('form.edit'),
        type: 'edit',
        data: {
          ...selectedRows[0],
          created_user: userOptions?.find(
            (item) => item?.value === selectedRows[0]?.created_user,
          ),
          updated_user: userOptions?.find(
            (item) => item?.value === selectedRows[0]?.updated_user,
          ),
        },
      });
    } else {
      message.warn('複数の項目を同時に編集できません。');
    }
  };
  const handleClear = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };
  const handleExportALL = () => {
    exportIssuesApi.run(removeEmpty(form.getFieldsValue()));
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
        title: intlMenu('CSManagement.cargoIssues'),
        breadcrumb: {
          routes: [
            {
              path: '/waybill/CSManagement/cargoIssues',
              breadcrumbName: intlMenu('CSManagement'),
            },
            {
              path: '',
              breadcrumbName: intlMenu('CSManagement.cargoIssues'),
            },
          ],
        },
      }}
    >
      <CargoIssueForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="150px">
            <Form.Item name="status">
              <Select
                allowClear
                placeholder={intlWaybill('status')}
                options={[
                  { label: '未処理', value: '未処理' },
                  { label: '問題作成', value: '問題作成' },
                  { label: '代理店対応中', value: '代理店対応中' },
                  { label: 'CS対応中', value: 'CS対応中' },
                  { label: '対応完了', value: '対応完了' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="auto">
            <Form.Item name="MAB">
              <Input placeholder={intlWaybill('MAB')} />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="issue_category">
              <Select
                allowClear
                placeholder={intlWaybill('issue_category')}
                options={[
                  { label: '破損', value: '破損' },
                  { label: '搬入時破損', value: '搬入時破損' },
                  { label: '住所不明', value: '住所不明' },
                  { label: '受取辞退', value: '受取辞退' },
                  { label: 'ラベル剥がれ', value: 'ラベル剥がれ' },
                  { label: '長期不在', value: '長期不在' },
                  { label: '住所変更', value: '住所変更' },
                  { label: '滅却', value: '滅却' },
                  { label: '代替品', value: '代替品' },
                  { label: '紛失', value: '紛失' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="cargo_status">
              <Select
                allowClear
                placeholder={intlWaybill('cargo_status')}
                options={[
                  { label: '返品済', value: '返品済' },
                  { label: '未', value: '未' },
                  { label: '搬入時', value: '搬入時' },
                  { label: '滅却', value: '滅却' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="HAB">
              <Input placeholder={intlWaybill('HAB')} />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="new_tracking_no">
              <Input placeholder={intlWaybill('new_tracking_no')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item name="HAB">
              <Input placeholder={intlWaybill('HAB')} />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item name="createdDateArr">
              <DatePicker.RangePicker
                placeholder={[
                  intlWaybill('createdDateStart'),
                  intlWaybill('createdDateEnd'),
                ]}
              />
            </Form.Item>
          </Col>
          <Col flex="160px">
            <Space>
              <Button type="primary" onClick={search.submit}>
                {intlPages('search.submit')}
              </Button>
              <Button onClick={search.reset}>
                {intlPages('search.reset')}
              </Button>
              <Button
                onClick={handleExportALL}
                loading={exportIssuesApi.loading}
              >
                {intlPages('action.exportAll')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Card
        extra={
          <Space>
            <span>selected: {selectedRowKeys?.length || 0} items</span>
            <Button size="small" type="link" onClick={handleClear}>
              {intlPages('form.clear')}
            </Button>
            <Button type="primary" onClick={handleEdit}>
              {intlPages('form.edit')}
            </Button>
            <Button onClick={handleExportIssues}>
              {intlPages('action.export')}
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          scroll={{ x: 6000, y: 'calc(100vh - 580px)' }}
          rowSelection={rowSelection}
        >
          <Table.Column
            width={180}
            title={intlWaybill('hawbNo')}
            dataIndex={['waybill', 'HAB']}
          />
          <Table.Column
            width={180}
            title={intlWaybill('mawbNo')}
            dataIndex={['waybill', 'MAB']}
          />
          <Table.Column
            width={180}
            title={intlWaybill('HAB')}
            dataIndex={['waybill', 'HAB']}
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('new_tracking_no')}
            dataIndex="new_tracking_no"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('createdAt')}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt, 'YYYY/MM/DD')}
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('issue_category')}
            dataIndex="issue_category"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('cargo_status')}
            dataIndex="cargo_status"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('issue_detail')}
            dataIndex="issue_detail"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('status')}
            dataIndex="status"
          />
          {/* <Table.Column width={180} sorter title="通知者" /> */}
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('reply_date')}
            dataIndex="reply_date"
            render={(reply_date) => dayFormat(reply_date, 'YYYY/MM/DD')}
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('reply_subject')}
            dataIndex="reply_subject"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('reply_content')}
            dataIndex="reply_content"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('receiver_add')}
            dataIndex="receiver_add"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('receiver_zip')}
            dataIndex="receiver_zip"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('receiver_tel')}
            dataIndex="receiver_tel"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('receiver_name')}
            dataIndex="receiver_name"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('CMN')}
            dataIndex="CMN"
          />
          <Table.Column
            width={180}
            title={intlWaybill('NO')}
            dataIndex={['waybill', 'NO']}
          />
          <Table.Column
            width={180}
            title={intlWaybill('GW')}
            dataIndex={['waybill', 'GW']}
          />
          <Table.Column
            width={180}
            title={intlWaybill('send_date')}
            sorter
            dataIndex="send_date"
            render={(send_date) => dayFormat(send_date, 'YYYY/MM/DD')}
          />
          <Table.Column
            width={180}
            title={intlWaybill('solve_date')}
            sorter
            dataIndex="solve_date"
            render={(solve_date) => dayFormat(solve_date, 'YYYY/MM/DD')}
          />
          <Table.Column width={180} sorter title="料金科目" />
          <Table.Column width={180} sorter title="請求年月" />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('solve_method')}
            dataIndex="solve_method"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('solve_note')}
            dataIndex="solve_note"
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('created_user')}
            dataIndex="created_user"
            render={(created_user) =>
              userOptions?.find((item) => item?.value === created_user)?.label
            }
          />
          {/* <Table.Column width={180} title="登録構成" /> */}
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('createdAt')}
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('updated_user')}
            dataIndex="updated_user"
            render={(updated_user) =>
              userOptions?.find((item) => item?.value === updated_user)?.label
            }
          />
          {/* <Table.Column width={180} title="最後更新構成" /> */}
          <Table.Column
            width={180}
            sorter
            title={intlWaybill('updatedAt')}
            dataIndex="updatedAt"
            render={(updatedAt) => dayFormat(updatedAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
