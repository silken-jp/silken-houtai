import XLSX from 'xlsx';
import { Button } from 'antd';

export interface ExportHAWBXlsxProps {
  disabled?: boolean;
  start: string;
  count: number;
  refresh?: () => void;
}

export const genHabEnd = (start: string, count: number) => {
  const len = start.length;
  const endNum = Number(start) + count;
  const lastNum = endNum % 7;
  let end = String(endNum).slice(0, len);
  const diffLen = len - end.length;
  if (diffLen > 0) {
    end = '0'.repeat(diffLen) + end;
  }
  return `${end}${lastNum}`;
};

const ExportHAWBXlsx: React.FC<ExportHAWBXlsxProps> = (props) => {
  const handleExport = () => {
    // 修正数据格式
    const fixExportData = Array.from({ length: props?.count || 0 }, (_, i) => ({
      HAB: genHabEnd(props.start, i),
    }));

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(fixExportData, { skipHeader: true });
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
    a.download = `${props.start}.xls`;
    a.click();
  };

  return (
    <Button size="small" onClick={handleExport}>
      エクスポート
    </Button>
  );
};

export default ExportHAWBXlsx;
