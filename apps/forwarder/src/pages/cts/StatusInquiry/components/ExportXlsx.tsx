import XLSX from 'xlsx';
import { Button } from 'antd';

export interface ExportXlsxProps {
  disabled?: boolean;
  filename?: string;
  dataSource?: any[];
}

const ExportXlsx: React.FC<ExportXlsxProps> = (props) => {
  const handleExport = () => {
    // 修正数据格式
    const fixExportData = props?.dataSource || [];

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
    a.download = `${props?.filename || Date.now()}.xls`;
    a.click();
  };

  return (
    <Button type="primary" onClick={handleExport} disabled={props?.disabled}>
      エクスポート
    </Button>
  );
};

export default ExportXlsx;
