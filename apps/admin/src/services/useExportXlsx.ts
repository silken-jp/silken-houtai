import XLSX from 'xlsx';
import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { getAllIrregular } from './request/irregular';

const handleExportXlsx = (data: any[], filename?: string) => {
  if (data?.length > 0) {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'MIC');

    ws['!cols'] = Array.from(Object.keys(data[0]), () => ({
      wch: 20,
    }));

    const s2ab = (s: any) => {
      // 字符串转字符流
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };
    // 创建二进制对象写入转换好的字节流
    let tmpDown = new Blob(
      [
        s2ab(
          XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary',
          }),
        ),
      ],
      { type: '' },
    );
    let a = document.createElement('a');
    // 利用URL.createObjectURL()方法为a元素生成blob URL
    a.href = URL.createObjectURL(tmpDown); // 创建对象超链接
    a.download = `${filename}.xls`;
    a.click();
  } else {
    message.warn('出力データが見つかりません');
  }
};

const handleExportXlsx2 = (
  dataSource: {
    sheetName: string;
    emptyData?: any[];
    data: any[];
  }[],
  filename?: string,
) => {
  if (dataSource?.length > 0) {
    const wb = XLSX.utils.book_new();

    for (let index = 0; index < dataSource.length; index++) {
      const element = dataSource[index];
      const data =
        element?.data?.length > 0 ? element.data : element.emptyData || [];

      let ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });
      ws['!cols'] = Array.from(Object.keys(data?.[0] || {}), () => ({
        wch: 30,
      }));

      XLSX.utils.book_append_sheet(wb, ws, element.sheetName);
    }

    XLSX.writeFile(wb, `${filename}.xls`);
  } else {
    message.warn('出力データが見つかりません');
  }
};

const useExportIrregularXlsx = () => {
  const exportIrregularApi = useRequest(
    async (params: any) =>
      await getAllIrregular({
        ...params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onSuccess: (result) => {
        // 修正数据格式
        const fixExportData = result?.irregulars?.map((d: any, i: any) => ({
          HAWB: d?.HAB,
          MAWB: d?.MAB,
          日付: dayFormat(d?.date, 'YYYY-MM-DD'),
          返送番号: d?.return_no,
          転送番号: d?.resend_no,
          '返送料金（課税）': d?.return_price,
          '再発送料金（課税）': d?.resend_price,
          '再発送/住所変更手数料（課税）': d?.address_change_fee,
          '再梱包手数料（課税）': d?.repack_fee,
          '換面単費ラベル交換（課税）': d?.label_change_fee,
          課税項目名: d?.tax_field_name,
          課税費用: d?.tax_price,
          課税備考: d?.tax_note,
          非課税項目名: d?.no_tax_field_name,
          非課税費用: d?.no_tax_price,
          非課税備: d?.no_tax_note,
        }));
        handleExportXlsx(fixExportData, 'イレギュラー');
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  return {
    exportIrregularApi,
  };
};

export { useExportIrregularXlsx, handleExportXlsx, handleExportXlsx2 };
export default useExportIrregularXlsx;
