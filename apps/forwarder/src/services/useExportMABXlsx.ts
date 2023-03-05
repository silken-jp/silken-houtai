import XLSX from 'xlsx';
import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { getStatusInquiry } from '@/services/request/waybill';

const handleExportXlsx = (data: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => ({
      MAWB番号: d?._id,
      FlightNo: d?.flightNo,
      FlightDate: dayFormat(d?.flightDate, 'YYYY/MM/DD'),
      件数: d?.NOCount,
      未申告件数: d?.notDecNo,
      MIC許可: d?.micPerNo,
      IDC許可: d?.idaPerNo,
      未許可: d?.notPerNo,
      '許可率（区分１）': `${((d?.count1 * 100) / d?.NOCount || 0)?.toFixed(
        2,
      )}% (${d?.count1})`,
      '審査率（区分２）': `${((d?.count2 * 100) / d?.NOCount || 0)?.toFixed(
        2,
      )}% (${d?.count2})`,
      '検査率（区分３）': `${(
        ((d?.count3 + d?.count3K) * 100) / d?.NOCount || 0
      )?.toFixed(2)} (${d?.count3 + d?.count3K})%`,
      個数: d?.waybillCount,
      '重量（KG）': d?.GWCount?.toFixed(2),
      登録時間: dayFormat(d?.createdAt),
    }));

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(fixExportData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'MIC');

    ws['!cols'] = Array.from(Object.keys(fixExportData[0]), () => ({
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
    a.download = `${Date.now()}.xls`;
    a.click();
  } else {
    message.warn('出力データが見つかりません');
  }
};

const useExportMABXlsx = (dataSource: any) => {
  const exportMABApi = useRequest(
    async (params: any) =>
      await getStatusInquiry({
        ...params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onSuccess: (result) => {
        handleExportXlsx(result?.mawbs);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const handleExportMAB = () => {
    handleExportXlsx(dataSource);
  };
  return {
    exportMABApi,
    handleExportMAB,
  };
};

export default useExportMABXlsx;
