import { Space, message } from 'antd';
import XLSX from 'xlsx';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';

// const exampleHref = 'http://onassets.weixin-jp.com/assets/waybills-import.xlsx';
const rightHeader = ['HAB'];

const zenkaku2Hankaku = (str: string) => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９ー]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < headers.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        obj[headers?.[j]?.trim?.()] = zenkaku2Hankaku(
          line?.[j]?.toString?.() || '',
        );
      }
    }
    waybills.push(obj);
  }
  return waybills;
}

const handleExportXlsx = (data: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((item) => ({
      ...item,
    }));

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
  } else {
    message.warn('出力データが見つかりません');
  }
};

export interface WashAddressProps {
  payload?: any;
  onUpload?: () => void;
}

const WashAddress: React.FC<WashAddressProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    try {
      let data = fixItemToObj(jsonArr) as any[];
      handleExportXlsx(data);
      return {
        success: {
          message: `Wash Address Successfully!`,
        },
        failed: null,
      };
    } catch (error) {
      return {
        success: null,
        failed: {
          message: `Wash Address Failed!`,
        },
      };
    }
  }

  return (
    <Space>
      <UploadXlsx
        onUpload={onUpload}
        text="Zenkaku To Hankaku"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default WashAddress;
