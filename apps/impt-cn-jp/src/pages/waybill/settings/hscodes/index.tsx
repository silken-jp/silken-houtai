import { Table, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { getAllHScodes, importHScodes } from '@/services/request/hscodes';

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
      const h = headers?.[j]?.trim?.();
      if (!h) continue;
      if (line[j] !== null || line[j] !== undefined) {
        obj[h] = line?.[j]?.toString?.();
      }
    }
    res.push(obj);
  }
  return res;
}

const HScodes: React.FC = () => {
  // api
  const getTableData = async () => {
    const data = await getAllHScodes();
    return {
      total: data?.totalCount,
      list: data?.hscodes,
    };
  };
  const { tableProps, refresh } = useAntdTable(getTableData);

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
      <Card title="税号归类参考" extra={<UploadXlsx onUpload={handleUpload} />}>
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
        </Table>
      </Card>
    </PageContainer>
  );
};

export default HScodes;
