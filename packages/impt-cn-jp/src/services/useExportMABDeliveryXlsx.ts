import XLSX from 'xlsx';
import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { getAllMABTracks } from './request/track';

const handleExportXlsx = (data: any[], agentOptions: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => ({
      フォワーダー: agentOptions?.find((item) => item.value === d?.agent)
        ?.label,
      MAWB番号: d?.MAB,
      件数: d?.hawb_count,
      未受付: d?.hawb_count - d?.acceptCount,
      未配達: d?.hawb_count - d?.arriveCount,
      登録日時: dayFormat(d?.createdAt),
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

const useExportMABDeliveryXlsx = (dataSource: any, agentOptions: any[]) => {
  const exportMABDeliveryApi = useRequest(
    async (params: any) =>
      await getAllMABTracks({
        ...params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onSuccess: (result) => {
        handleExportXlsx(result?.tracks, agentOptions);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const handleExportMABDelivery = () => {
    handleExportXlsx(dataSource, agentOptions);
  };
  return {
    exportMABDeliveryApi,
    handleExportMABDelivery,
  };
};

export default useExportMABDeliveryXlsx;
