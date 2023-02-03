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
  let end = String(endNum).slice(0, len);
  const diffLen = len - end.length;
  if (diffLen > 0) {
    end = '0'.repeat(diffLen) + end;
  }
  return end;
};

const ExportHAWBXlsx: React.FC<ExportHAWBXlsxProps> = (props) => {
  const handleExport = () => {
    // 修正数据格式
    const fixExportData = Array.from({ length: props?.count || 0 }, (_, i) => ({
      VSN: '',
      DATE: '',
      ARR: '',
      MAB: '',
      HAB: genHabEnd(props.start, i),
      PCS: '',
      GW: '',
      GWT: '',
      CMN: '',
      SKB: '',
      ImpName: '',
      ImpNameJP: '',
      IAD: '',
      IADJP: '',
      Zip: '',
      Tel: '',
      EPN: '',
      EAD: '',
      EPY_Zip: '',
      EPO: '',
      DST: '',
      PSC: '',
      OR: '',
      IP1: '',
      IP2: '',
      IP3: '',
      IP4: '',
      FR1: '',
      FR2: '',
      FR3: '',
      IN1: '',
      IN2: '',
      IN3: '',
      receiver_name: '',
      receiver_add: '',
      receiver_tel: '',
      receiver_zip: '',
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
