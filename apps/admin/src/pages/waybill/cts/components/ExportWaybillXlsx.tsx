import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
////
import { getAllWaybills } from '@/services/request/waybill';

export interface ExportWaybillXlsxProps {
  disabled?: boolean;
  dataSource?: any;
  refresh?: () => void;
}

const ExportWaybillXlsx: React.FC<ExportWaybillXlsxProps> = (props) => {
  const { loading, run } = useRequest(
    async () => {
      if (props.dataSource.waybillCount > 500) {
        let list: any = [];
        const pageNum = props.dataSource.waybillCount / 500;
        for (let page = 0; page < pageNum; page++) {
          const data = await getAllWaybills({
            page,
            perPage: 500,
            MAB: props?.dataSource.mab,
          });
          list = [...list, ...data.waybills];
        }
        return { total: props.dataSource.waybillCount, list };
      } else {
        const data = await getAllWaybills({
          page: 0,
          perPage: 50000,
          sortField: 'modified_fields',
          sortOrder: -1,
          MAB: props?.dataSource.mab,
        });
        return { total: data?.totalCount, list: data?.waybills };
      }
    },
    {
      manual: true,
      ready: !!props.dataSource?.NOCount && !!props?.dataSource?.mab,
      onSuccess: async (result) => {
        handleExport(result?.list);
        // if (props?.MAB) {
        //   await deleteALLWaybillsByMAWB({ mawb: props.MAB });
        //   props?.refresh?.();
        // }
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  const handleExport = (data: any[]) => {
    // 修正数据格式

    const fixExportData = data
      ?.sort((a, b) => (a?.waybill_status > b?.waybill_status ? -1 : 1))
      ?.map((d: any) => {
        return {
          holdMemo: d?.holdMemo,
          modified_fields: d?.modified_fields,
          waybill_status: ['other', 'normal', 'hold', 'sendBack'][
            d?.waybill_status
          ],
          LS: d?.LS,
          // VSN: d?.VSN,
          VSN: d?.flight_no,
          DATE: dayjs(d?.DATE).format('YYYYMMDD'),
          ARR: d?.ARR,
          MAB: d?.MAB,
          HAB: d?.HAB,
          PCS: d?.PCS,
          GW: d?.GW,
          GWT: d?.GWT,
          CMN: d?.CMN,
          SKB: d?.SKB,
          ImpName: d?.ImpName,
          // ImpNameJP: d?.ImpNameJP,
          IAD: d?.IAD,
          // IADJP: d?.IADJP,
          Zip: d?.Zip,
          Tel: d?.Tel,
          EPN: d?.EPN,
          EAD: d?.EAD,
          EPY_Zip: d?.EPY_Zip,
          EPO: d?.EPO,
          DST: d?.DST,
          PSC: d?.PSC,
          OR: d?.OR,
          IP1: d?.IP1,
          IP2: d?.IP2,
          IP3: d?.IP3,
          IP4: d?.IP4,
          NT1: d?.NT1,
          FR1: d?.FR1,
          FR2: d?.FR2,
          FR3: d?.FR3,
          IN1: d?.IN1,
          IN2: d?.IN2,
          IN3: d?.IN3,
        };
      });

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
    a.download = `${props?.dataSource.mab}_CB.xls`;
    a.click();
  };

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={run}
      disabled={props?.disabled}
    >
      エクスポート
    </Button>
  );
};

export default ExportWaybillXlsx;
