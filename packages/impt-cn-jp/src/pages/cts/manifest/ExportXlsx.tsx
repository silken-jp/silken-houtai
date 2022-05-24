import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';

import { dayFormat } from '../../../utils/helper/day';
import { getSearchParams } from '@/services/useStorage';
import { getAllWaybillsAdvance } from '@/services/request/waybill';

export interface ExportXlsxProps {
  useSource?: boolean;
  dataSource?: any[];
}

const ExportXlsx: React.FC<ExportXlsxProps> = (props) => {
  const { loading, run } = useRequest(getAllWaybillsAdvance, {
    manual: true,
    onSuccess: (result) => {
      handleExport(result?.waybills);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const handleExport = (data: any[]) => {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => ({
      NO: i + 1,
      'MASTER AIR WAYBILL NO.': d?.MAB,
      'FLIGHT NO.': d?.flight_no,
      DATE: dayFormat(d?.ARR, 'YYYY/MM/DD'),
      'HOUSE AIR WAYBILL NO.': d?.HAB,
      PCS: d?.PCS,
      WEIGHT: d?.GW,
      CODE: d?.GWT,
      'DESCRIPTION OF GOODS': d?.CMN,
      'CONSIGNEE NAME': d?.ImpName,
      'CONSIGNEE ADDRESS': d?.IAD,
      'TEL NO.': d?.Tel,
      'SHIPPER NAME': d?.EPN,
      'SHIPPER ADDRESS': d?.EAD,
      CURRENCY: d?.IP3,
      'DECLARED VALUE OF CUSTOMS': d?.IP4,
      ORIGIN: d?.EPO,
      'TRACKING NO.': '',
      'C.C AMOUNT': '',
      'CONSIGNEE ZIP': d?.Zip,
      インボイス識別: d?.IV1,
      インボイス番号: d?.IV3,
      'インボイス価格区分 コード': d?.IP1,
      'インボイス価格条件 コード': d?.IP2,
      運賃区分: d?.FR1,
      運賃通貨コード: d?.FR2,
      運賃: d?.FR3,
      保険区分コード: d?.IN1,
      保険通貨コード: d?.IN2,
      保険金額: d?.IN3,
      原産地: d?.OR,
      '記事(NT1) 元INVOICE価格': d?.NT1,
    }));

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(fixExportData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'MIC');

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
    a.download = `${Date.now()}.xls`;
    a.click();
  };

  const handleRun = () => {
    if (props?.useSource) {
      handleExport(props?.dataSource || []);
    } else {
      run({ ...getSearchParams('M'), perPage: 100000000 });
    }
  };

  return (
    <Button loading={loading} onClick={handleRun}>
      Export Xlsx
    </Button>
  );
};

export default ExportXlsx;
