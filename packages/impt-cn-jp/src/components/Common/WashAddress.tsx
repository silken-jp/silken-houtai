import { Space, message } from 'antd';
import XLSX from 'xlsx';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { washAddress } from '@/services/request/zipcode';

// const exampleHref = 'http://onassets.weixin-jp.com/assets/waybills-import.xlsx';
const rightHeader = [
  '交易号',
  '收件人地址',
  '收件人城市',
  '收件人姓名',
  '收件人省份',
  '收件人邮编',
  '翻译后收件人地址',
  '翻译后收件人城市',
  '翻译后收件人省份',
];

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
      收件人地址: res[index]['address'],
      翻译后收件人地址: res[index]['add3'],
      翻译后收件人城市: res[index]['add2'],
      翻译后收件人省份: res[index]['add1'],
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

export interface WashAddressProps {
  payload?: any;
  onUpload?: () => void;
}

const WashAddress: React.FC<WashAddressProps> = (props) => {
  async function onUpload(jsonArr: any[]) {
    try {
      let data = fixItemToObj(jsonArr) as any[];
      const res = await washAddress({
        originalAdds: data?.map((item) => ({
          address: item['收件人地址'],
          zip: item['收件人邮编'],
        })),
      });
      handleExportXlsx(data, res);
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
        text="Wash Address"
        rightHeader={rightHeader}
      />
    </Space>
  );
};

export default WashAddress;
