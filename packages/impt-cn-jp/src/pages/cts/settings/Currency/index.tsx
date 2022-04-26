import { Table, Card } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
////
import { useIntlFormat } from '@/services/useIntl';
import {
  getCurrencies,
  importMultiCurrency,
} from '@/services/request/currency';
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { dayFormat } from '@/utils/helper/day';

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
    for (let j = 1; j < line.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        obj[headers?.[j]?.trim?.()] = line?.[j]?.toString?.();
      }
    }
    res.push(obj);
  }
  return res;
}

const Currency: React.FC = () => {
  // state
  const [intlMenu] = useIntlFormat('menu');

  // api
  const getTableData = async () => {
    const data = await getCurrencies();
    return {
      total: data?.length,
      list: data,
    };
  };
  const { tableProps, refresh } = useAntdTable(getTableData);

  async function handleUpload(arr: any[]) {
    arr.unshift([
      '',
      'country_name',
      'currency_name',
      'ISO',
      'per_jpy',
      'hundred_jpy',
    ]);
    const currencies = fixItemToObj(arr);
    const { successCount: count, failedNo } = await importMultiCurrency({
      currencies,
    });
    refresh();
    const success = count > 0 ? successFormat(count, currencies.length) : null;
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
        title: '為替レート管理',
        breadcrumb: {
          routes: [
            {
              path: '/cts/settings/Currency',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: '為替レート管理' },
          ],
        },
      }}
    >
      <Card
        title="為替レートリスト"
        extra={<UploadXlsx onUpload={handleUpload} />}
      >
        <Table
          rowKey="_id"
          {...tableProps}
          scroll={{ x: 1300 }}
          pagination={false}
        >
          <Table.Column width={200} title="国名" dataIndex="country_name" />
          <Table.Column width={150} title="通貨" dataIndex="currency_name" />
          <Table.Column width={150} title="ISO" dataIndex="ISO" />
          <Table.Column
            width={300}
            title="当該通貨1単位につき(円)"
            dataIndex="per_jpy"
          />
          <Table.Column
            width={300}
            title="当該通貨100単位につき(円)"
            dataIndex="hundred_jpy"
          />
          <Table.Column
            width={200}
            title="更新時間"
            render={(row) => dayFormat(row?.updatedAt)}
          />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default Currency;
