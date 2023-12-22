import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllWaybillHSCODEs } from '@/services/request/waybill-hscode';

export interface ExportWaybillHSCODEXlsxProps {
  form?: any;
  count: number;
  refresh?: () => void;
}

const ExportWaybillHSCODEXlsx: React.FC<ExportWaybillHSCODEXlsxProps> = (
  props,
) => {
  const values = props.form.getFieldsValue();
  const { loading, run } = useRequest(
    async () => {
      let list: any = [];
      const pageNum = Math.ceil(props.count / 500);
      for (let page = 0; page < pageNum; page++) {
        const data = await getAllWaybillHSCODEs({
          page,
          perPage: 500,
          ...values,
        });
        list = [...list, ...data.waybillhscodes];
      }
      return { total: props.count, list };
    },
    {
      manual: true,
      ready: !!props.count,
      onSuccess: async (result) => {
        handleExport(result?.list);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  const handleExport = (data: API.HScodes[]) => {
    // 修正数据格式
    const fixExportData = data.map((item) => ({
      MAB: item?.MAB,
      HAB: item?.HAB,
      order_no: item?.order_no,
      CMN_cn: item?.CMN_cn,
      CMN: item?.CMN,
      NO: item?.NO,
      price: item?.price,
      currency: item?.currency,
      URL: item?.URL,
      CMN_sale: item?.CMN_sale,
      material: item?.material,
      weaving_style: item?.weaving_style,
      CMD: item?.CMD,
      SKU: item?.SKU,
      OR: item?.OR,
      unit_price: item?.unit_price,
      tax_rate: item?.tax_rate,
    }));

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(fixExportData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'MIC');

    ws['!cols'] = Array.from(Object.keys(fixExportData[0]), () => ({
      wch: 20,
    }));

    XLSX.writeFile(wb, `HSCODE.xls`);
  };

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={run}
      disabled={!props?.count}
    >
      エクスポート
    </Button>
  );
};

export default ExportWaybillHSCODEXlsx;
