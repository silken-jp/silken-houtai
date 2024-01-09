import {
  Table,
  Card,
  Space,
  Form,
  Row,
  Col,
  Button,
  Input,
  Popconfirm,
} from 'antd';
import { useAntdTable, useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import {
  deleteHscodesById,
  getAllHScodes,
  importHScodes,
} from '@/services/request/hscodes';
import ExportHSCODESettingXlsx from '../components/ExportHSCODESettingXlsx';

const successFormat = (count: number, sum: number) => ({
  message: `Upload Completed`,
  description: `Upload successfully with ${count}/${sum} data.`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `${failedNo} data upload failed` : 'Upload failed',
  description: `Number of failed rows: ${failedNo.join(', ')}`,
});

function fixItemToObj(params: any[]) {
  let res = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < line.length; j++) {
      let h = headers?.[j]?.trim?.();
      if (!h) continue;
      if (line[j] !== null || line[j] !== undefined) {
        if (h === 'CMD') {
          h = 'hscode';
        }
        obj[h] = line?.[j]?.toString?.();
      }
    }
    res.push(obj);
  }
  return res;
}

const HScodes: React.FC = () => {
  // state
  const [form] = Form.useForm();

  // api
  const getTableData = async (pageData: any, formData: any) => {
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
    const data = await getAllHScodes({
      page: 0,
      perPage: 99999999,
      ...sorter,
      ...formData,
    });
    return {
      total: data?.totalCount,
      list: data?.hscodes,
    };
  };
  const { tableProps, refresh, search } = useAntdTable(getTableData, { form });
  const deleteHscodeAPI = useRequest(deleteHscodesById, { manual: true });

  async function handleUpload(arr: any[]) {
    const hscodesArray = (fixItemToObj(arr) as API.HScodes[]).filter(
      (item) => !!item.hscode && !!item.tax_rate,
    );
    const { successCount: count, failedNo } = await importHScodes({
      hscodesArray,
    });
    refresh();
    const success =
      count > 0 ? successFormat(count, hscodesArray.length) : null;
    const failed =
      failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;

    return {
      success,
      failed,
    };
  }

  return (
    <PageContainer
      header={{
        title: '税号归类参考',
        breadcrumb: {
          routes: [
            {
              path: '/waybill/settings/hscodes',
              breadcrumbName: '通関管理',
            },
            { path: '', breadcrumbName: '税号归类参考' },
          ],
        },
      }}
    >
      <Form form={form} className="sk-table-search">
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item name="hscode">
              <Input placeholder="HSCODE" />
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
        title="税号归类参考"
        extra={
          <Space>
            <ExportHSCODESettingXlsx />
            <UploadXlsx onUpload={handleUpload} text="アップロード" />
          </Space>
        }
      >
        <Table
          rowKey="_id"
          size="small"
          {...tableProps}
          pagination={false}
          footer={() => (
            <div style={{ textAlign: 'end' }}>
              total: {tableProps.dataSource.length}
            </div>
          )}
          scroll={{ y: 'calc(100vh - 400px)' }}
        >
          <Table.Column sorter width={300} title="HSCODE" dataIndex="hscode" />
          <Table.Column sorter width={300} title="税率" dataIndex="tax_rate" />
          <Table.Column
            width={50}
            title="操作"
            render={(row) => {
              return (
                <Popconfirm
                  title={`HSCODE【${row?.hscode}】を削除しますか?`}
                  onConfirm={async () => {
                    await deleteHscodeAPI.runAsync({
                      hscodeId: row?._id,
                    });
                    refresh();
                  }}
                  okButtonProps={{
                    loading: deleteHscodeAPI.loading,
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" danger>
                    削除
                  </Button>
                </Popconfirm>
              );
            }}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default HScodes;
