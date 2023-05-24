import { Card, InputNumber, Button, Space, message } from 'antd';
import XLSX from 'xlsx';
////
import { genImpName } from '@/services/request/root';
import { useState } from 'react';

export interface GenNameProps {}

const GenName: React.FC<GenNameProps> = () => {
  const [num, setNum] = useState(10);
  const handleGen = async () => {
    try {
      const res = await genImpName({ num });
      handleExportXlsx(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportXlsx = (data: any[]) => {
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
      a.download = `Importer_Names.xls`;
      a.click();
    } else {
      message.warn('出力データが見つかりません');
    }
  };

  return (
    <Card title="Gen Importer Names">
      <Space>
        生成件数：
        <InputNumber
          style={{ width: 200 }}
          min={1}
          max={100000}
          value={num}
          onChange={setNum}
        />
        <Button type="primary" onClick={handleGen}>
          生成
        </Button>
      </Space>
    </Card>
  );
};

export default GenName;
