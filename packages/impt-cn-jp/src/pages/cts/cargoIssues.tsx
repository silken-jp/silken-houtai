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
import { TableRowSelection } from 'antd/lib/table/interface';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import useSKForm from '@silken-houtai/core/lib/useHooks';
import { useIntlFormat } from '@/services/useIntl';
import CargoIssueForm from '@/components/Form/CargoIssueForm';
import { useAgentOptions } from '@/services/useAPIOption';
import {
  deleteIssueById,
  getAllIssues,
  updateIssue,
} from '@/services/request/issue';
import { useUserOptions } from '@/services/useAPIOption';
import { dayFormat, dayUTC } from '@/utils/helper/day';
import { getUserInfo } from '@/services/useStorage';

const waybill: React.FC = () => {
  // state
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Issue>();
  const { agentOptions } = useAgentOptions();
  const userInfo = getUserInfo();

  // api
  const { userOptions } = useUserOptions();
  const getTableData = async (pageData: any, formData: any) => {
    const page = pageData.current - 1;
    const perPage = pageData.pageSize;
    let { createdDateArr, ...params } = formData;
    let sorter: any = {};
    if (Array.isArray(pageData?.sorter?.field)) {
      sorter.sortField = pageData?.sorter?.field?.join('.');
    } else if (!!pageData?.sorter?.field) {
      sorter.sortField = pageData?.sorter?.field;
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
      ...sorter,
      ...params,
    });
    return { total: data?.totalCount, list: data?.data };
  };
  const { tableProps, search } = useAntdTable(getTableData, { form });
  const deleteIssue = useRequest(deleteIssueById, { manual: true });

  // action
  const handleSubmit = async (v: any) => {
    if (formType === 'edit') {
      await updateIssue({
        issueId: selectedRowKeys[0],
        price_projects: v?.price_projects?.flatMap((p: any) =>
          p?.name && p.price ? [p] : [],
        ),
        updated_user: userInfo?._id,
        issue_category: v?.issue_category,
        issue_detail: v?.issue_detail,
        status: v?.status,
        cargo_status: v?.cargo_status,
        new_tracking_no: v?.new_tracking_no,
        solve_method: v?.solve_method,
        solve_note: v?.solve_note,
        ...(v?.send_date ? { send_date: v?.send_date?.toString() } : {}),
        ...(v?.solve_date ? { solve_date: v?.solve_date?.toString() } : {}),
      });
      search.submit();
      handleClear();
    }
  };
  const handleDelete = async () => {
    try {
      if (selectedRows?.length === 0) {
        throw new Error('項目を選択してください。');
      } else if (selectedRows?.length === 1) {
        await deleteIssue.runAsync({ issueId: selectedRowKeys[0] });
        search.submit();
      } else {
        throw new Error('複数の項目を同時に削除できません。');
      }
    } catch (error: any) {
      message.warn(error?.message || error);
    }
  };
  const handleEdit = () => {
    if (selectedRows?.length === 0) {
      message.warn('項目を選択してください。');
    } else if (selectedRows?.length === 1) {
      handleOpen({
        title: '編集',
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

  const rowSelection: TableRowSelection<API.Issue> = {
    type: 'radio',
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
            <Form.Item name="agent">
              <Select
                allowClear
                placeholder="フォワーダー"
                options={agentOptions}
              />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="status">
              <Select
                allowClear
                placeholder="状態"
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
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="issue_category">
              <Select
                allowClear
                placeholder="問題該当"
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
                placeholder="返品状態"
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
              <Input placeholder="伝票番号" />
            </Form.Item>
          </Col>
          <Col flex="150px">
            <Form.Item name="new_tracking_no">
              <Input placeholder="新伝票番号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item name="HAB">
              <Input placeholder="HAWB番号" />
            </Form.Item>
          </Col>
          <Col flex="270px">
            <Form.Item name="createdDateArr">
              <DatePicker.RangePicker
                placeholder={['登録開始日', '登録終了日']}
              />
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
        extra={
          <Space>
            <span>selected: {selectedRowKeys?.length || 0} items</span>
            <Button size="small" type="link" onClick={handleClear}>
              clear
            </Button>
            <Button type="primary" onClick={handleEdit}>
              編集
            </Button>
            <Button loading={deleteIssue.loading} danger onClick={handleDelete}>
              削除
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          scroll={{ x: 6000 }}
          rowSelection={rowSelection}
        >
          <Table.Column
            sorter
            width={180}
            title="フォワーダー"
            dataIndex="agent"
            render={(agent) =>
              agentOptions?.find((item) => item?.value === agent)?.label
            }
          />
          <Table.Column
            width={180}
            title="HAWB番号"
            dataIndex={['waybill', 'HAB']}
          />
          <Table.Column
            width={180}
            title="MAWB番号"
            dataIndex={['waybill', 'MAB']}
          />
          <Table.Column
            width={180}
            title="伝票番号"
            dataIndex={['waybill', 'HAB']}
          />
          <Table.Column
            sorter
            width={180}
            title="新伝票番号"
            dataIndex="new_tracking_no"
          />
          <Table.Column
            sorter
            width={180}
            title="連絡日"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt, 'YYYY/MM/DD')}
          />
          <Table.Column
            sorter
            width={180}
            title="問題該当"
            dataIndex="issue_category"
          />
          <Table.Column
            sorter
            width={180}
            title="返品状態"
            dataIndex="cargo_status"
          />
          <Table.Column
            sorter
            width={180}
            title="問題詳細"
            dataIndex="issue_detail"
          />
          <Table.Column width={180} sorter title="状態" dataIndex="status" />
          <Table.Column width={180} title="通知者" />
          <Table.Column
            sorter
            width={180}
            title="回答日"
            dataIndex="reply_date"
            render={(reply_date) => dayFormat(reply_date, 'YYYY/MM/DD')}
          />
          <Table.Column
            sorter
            width={180}
            title="科目"
            dataIndex="reply_subject"
          />
          <Table.Column width={180} title="内容" dataIndex="reply_content" />
          <Table.Column
            width={180}
            title="受取人住所"
            dataIndex="receiver_add"
          />
          <Table.Column
            width={180}
            title="受取人郵便番号"
            dataIndex="receiver_zip"
          />
          <Table.Column
            width={180}
            title="受取人電話番号"
            dataIndex="receiver_tel"
          />
          <Table.Column width={180} title="受取人" dataIndex="receiver_name" />
          <Table.Column width={180} title="品名" dataIndex="CMN" />
          <Table.Column
            width={180}
            title="個数"
            dataIndex={['waybill', 'NO']}
          />
          <Table.Column
            width={180}
            title="重量"
            dataIndex={['waybill', 'GW']}
          />
          <Table.Column
            width={180}
            title="発送日"
            dataIndex="send_date"
            render={(send_date) => dayFormat(send_date, 'YYYY/MM/DD')}
          />
          <Table.Column
            width={180}
            title="処理日"
            dataIndex="solve_date"
            render={(solve_date) => dayFormat(solve_date, 'YYYY/MM/DD')}
          />
          <Table.Column width={180} title="料金科目" />
          <Table.Column width={180} title="請求年月" />
          <Table.Column width={180} title="対応方法" dataIndex="solve_method" />
          <Table.Column width={180} title="備考" dataIndex="solve_note" />
          <Table.Column
            sorter
            width={180}
            title="登録者"
            dataIndex="created_user"
            render={(created_user) =>
              userOptions?.find((item) => item?.value === created_user)?.label
            }
          />
          {/* <Table.Column width={180} title="登録構成" /> */}
          <Table.Column
            sorter
            width={180}
            title="登録日時"
            dataIndex="createdAt"
            render={(createdAt) => dayFormat(createdAt)}
          />
          <Table.Column
            width={180}
            title="最後更新者"
            dataIndex="updated_user"
            render={(updated_user) =>
              userOptions?.find((item) => item?.value === updated_user)?.label
            }
          />
          {/* <Table.Column width={180} title="最後更新構成" /> */}
          <Table.Column
            sorter
            width={180}
            title="更新日時"
            dataIndex="updatedAt"
            render={(updatedAt) => dayFormat(updatedAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default waybill;
