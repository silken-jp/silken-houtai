import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { TrackingCode } from '@/utils/constant';

export interface ExportXlsxProps {
  disabled: boolean;
  handleRun: () => Promise<{ total: any; list: any }>;
}

const ExportXlsx: React.FC<ExportXlsxProps> = (props) => {
  const { loading, run } = useRequest(props?.handleRun, {
    manual: true,
    onSuccess: (result) => {
      handleExport(result?.list);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const handleExport = (data: any[]) => {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => {
      let his = d.track?.history;
      his?.sort(
        (a: any, b: any) =>
          new Date(a?.datatime).getTime() - new Date(b?.datatime).getTime(),
      );
      const tracking = d?.tracking?.trackingHistory
        ?.map(
          (item: any, key: any) =>
            `${TrackingCode[item?.TKG_CD as keyof typeof TrackingCode]}${
              '：' + item?.TKG_DT
            }`,
        )
        ?.join(' ');
      return {
        お問い合わせ番号: d?.HAB,
        追跡: his?.[his?.length - 1]?.code_jp,
        審査検査区分: d?.tracking?.EXA_DIS,
        状態: tracking,
        HAWB番号: d?.HAB,
        MAWB番号: d?.MAB,
        // 配送業者: '',
        // タイプ: '',
        識別: d?.waybill_type,
        'FLIGHT NO': d?.flight_no,
        'FLIGHT DATE': dayFormat(d?.DATE, 'YYYY.MM.DD'),
        申告番号: d?.tracking?.ID,
        個数: d?.PCS,
        '重量（ＫＧ）': d?.GW,
        関税: '0',
        消費税: '0',
        地方消費税: '0',
        納税額合計: '0',
        作成日時: d?.createAt,
      };
    });

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

  return (
    <Button loading={loading} onClick={run} disabled={props?.disabled}>
      Export Xlsx
    </Button>
  );
};

export default ExportXlsx;
