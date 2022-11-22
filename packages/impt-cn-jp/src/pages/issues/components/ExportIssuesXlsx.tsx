import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { TrackingCode } from '@/utils/constant';
import { getAllIssues } from '@/services/request/issue';

export interface ExportXlsxProps {
  disabled?: boolean;
  count?: number;
  issue_type?: number;
}

const ExportXlsx: React.FC<ExportXlsxProps> = (props) => {
  const { loading, run } = useRequest(
    async () => {
      const data = await getAllIssues({
        page: 0,
        perPage: 50000,
        issue_type: props?.issue_type,
      });
      return { total: data?.totalCount, list: data?.data };
    },
    {
      manual: true,
      onSuccess: (result) => {
        handleExport(result?.list);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  const handleExport = (data: any[]) => {
    // 修正数据格式
    const fixExportData = data?.map((d: any) => {
      return {
        HAWB番号: d?.waybill?.HAB,
        MAWB番号: d?.waybill?.MAB,
        状態: d?.status,
        個数: d?.waybill?.NO,
        重量: d?.waybill?.GW,
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
      Export Xlsx ({props?.count})
    </Button>
  );
};

export default ExportXlsx;
