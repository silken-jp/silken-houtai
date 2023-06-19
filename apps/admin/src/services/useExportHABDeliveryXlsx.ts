import XLSX from 'xlsx';
import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { getAllTracks } from './request/track';

function fixHistory(params: any[]) {
  const his = Array.from(params || []);
  his?.sort(
    (a: any, b: any) =>
      new Date(a?.datatime).getTime() - new Date(b?.datatime).getTime(),
  );
  return his[his?.length - 1];
}

const handleExportXlsx = (data: any[], agentOptions: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => ({
      フォワーダー: agentOptions?.find((item) => item.value === d?.agent)
        ?.label,
      配達情報: fixHistory(d?.history)?.code_jp,
      お問い合せ送り状NO: d?.HAB,
      お荷物個数: d?.no,
      集荷営業所名: d?.pickup_office && `${d.pickup_office} 営業所`,
      集荷営業所TEL: d?.pickup_tel,
      集荷営業所FAX: d?.pickup_fax,
      配達営業所名: d?.delivery_office && `${d.delivery_office} 営業所`,
      配達営業所TEL: d?.delivery_tel,
      配達営業所FAX: d?.delivery_fax,
      出荷日: dayFormat(d?.delivery_day),
      更新日: dayFormat(d?.updatedAt),
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

const useExportHABDeliveryXlsx = (dataSource: any, agentOptions: any[]) => {
  const exportHABDeliveryApi = useRequest(
    async (params: any) =>
      await getAllTracks({
        ...params,
        page: 0,
        perPage: 100000000,
        sortField: 'delivery_day',
        sortOrder: -1,
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
  const handleExportHABDelivery = () => {
    handleExportXlsx(dataSource, agentOptions);
  };
  return {
    exportHABDeliveryApi,
    handleExportHABDelivery,
  };
};

export default useExportHABDeliveryXlsx;
