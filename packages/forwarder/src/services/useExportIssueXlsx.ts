import XLSX from 'xlsx';
import { message } from 'antd';
import { useRequest } from 'ahooks';
////
import { dayFormat } from '@/utils/helper/day';
import { getAllIssues } from '@/services/request/issue';

const handleExportXlsx = (data: any[], userOptions: any[]) => {
  if (data?.length > 0) {
    // 修正数据格式
    const fixExportData = data?.map((d: any, i: any) => ({
      HAWB番号: d?.waybill?.HAB,
      MAWB番号: d?.waybill?.MAB,
      伝票番号: d?.waybill?.HAB,
      新伝票番号: d?.new_tracking_no,
      連絡日: dayFormat(d?.createdAt, 'YYYY/MM/DD'),
      問題該当: d?.issue_category,
      返品状態: d?.cargo_status,
      問題詳細: d?.issue_detail,
      状態: d?.status,
      // 通知者: "",
      回答日: dayFormat(d?.reply_date, 'YYYY/MM/DD'),
      科目: d?.reply_subject,
      内容: d?.reply_content,
      受取人住所: d?.receiver_add,
      受取人郵便番号: d?.receiver_zip,
      受取人電話番号: d?.receiver_tel,
      受取人: d?.receiver_name,
      品名: d?.CMN,
      個数: d?.waybill?.NO,
      重量: d?.waybill?.GW,
      発送日: dayFormat(d?.send_date, 'YYYY/MM/DD'),
      処理日: dayFormat(d?.solve_date, 'YYYY/MM/DD'),
      // 料金科目: "",
      // 請求年月: "",
      対応方法: d?.solve_method,
      備考: d?.solve_note,
      登録者: userOptions?.find((item) => item?.value === d?.created_user)
        ?.label,
      登録日時: dayFormat(d?.createdAt),
      最後更新者: userOptions?.find((item) => item?.value === d?.updated_user)
        ?.label,
      更新日時: dayFormat(d?.updatedAt),
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

const useExportIssueXlsx = (dataSource: any, userOptions: any[]) => {
  const exportIssuesApi = useRequest(
    async (params: any) =>
      await getAllIssues({
        ...params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onSuccess: (result) => {
        handleExportXlsx(result?.data, userOptions);
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );
  const handleExportIssues = () => {
    handleExportXlsx(dataSource, userOptions);
  };
  return {
    exportIssuesApi,
    handleExportIssues,
  };
};

export default useExportIssueXlsx;
