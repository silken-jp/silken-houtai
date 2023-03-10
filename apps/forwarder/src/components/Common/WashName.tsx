import { Space, message } from 'antd';
import XLSX from 'xlsx';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { washName } from '@/services/request/root';

const rightHeader = ['ImpNameJP', 'ImpName'];

function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < headers.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        obj[headers?.[j]?.trim?.()] = line?.[j]?.toString?.();
      }
    }
    waybills.push(obj);
  }
  return waybills;
}

const handleExportXlsx = (data: any[], res: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((item, index) => ({
      ...item,
      ImpName: res[index],
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

export interface WashNameProps {
  payload?: any;
  onUpload?: () => void;
}

const WashName: React.FC<WashNameProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    try {
      let data = fixItemToObj(jsonArr) as any[];
      const res = await washName({
        ImpNameJPs: data?.map((item) => item['ImpNameJP']),
      });
      handleExportXlsx(data, res);
      return {
        success: {
          message: `Wash Name Successfully!`,
        },
        failed: null,
      };
    } catch (error) {
      return {
        success: null,
        failed: {
          message: `Wash Name Failed!`,
        },
      };
    }
  }

  return (
    <Space>
      <UploadXlsx
        onUpload={onUpload}
        text="Wash Name"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default WashName;
