import { useState } from 'react';
import { message, Button } from 'antd';
import { useLocation } from 'umi';
import { useRequest } from 'ahooks';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import { DownloadOutlined } from '@ant-design/icons';
////
import { getAllWaybills } from '@/services/request/waybill';
import EDIPrint from './components/EDIPrint';

export interface SagawaEDIProps {}

async function handleZip(data: any[], filename: string = '压缩包') {
  const zip = new JSZip();
  for (const item of data) {
    const ele = item?.[0];
    const target = document.getElementById(ele?._id) as HTMLCanvasElement;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [100.2, 150.2],
    });
    const dataURI = target?.toDataURL('image/png', 1.0);
    doc.addImage(dataURI, 'PNG', 0.1, 0.1, 100, 150);
    if (target && ele?.EDI_code?.arr_code1 && ele?.EDI_code?.arr_code2) {
      zip.file(`${ele?.HAB}.pdf`, doc.output('blob'));
    } else {
      zip.file(`Error_${ele?.HAB}.pdf`, doc.output('blob'));
    }
  }
  const res = await zip.generateAsync({ type: 'blob' });
  FileSaver.saveAs(res, filename + '.zip');
}

const SagawaEDI: React.FC<SagawaEDIProps> = () => {
  // state
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlParams = Object.fromEntries(new URLSearchParams(location.search));

  // api
  const printApi = useRequest(
    async () =>
      await getAllWaybills({
        ...urlParams,
        page: 0,
        perPage: 100000,
      }),
    {
      onSuccess: (res) => {
        if (res?.waybills?.length > 0) {
        } else {
          message.error('条件を満たすHABを見つかりません。');
        }
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  if (printApi?.loading) return <>loading...</>;

  const d: API.Waybill[] = printApi?.data?.waybills || [];
  let dataSource: API.Waybill[][] = [];
  for (let index = 0; index < d.length; index += 12) {
    dataSource.push(d.slice(index, index + 12));
  }
  const length = Math.ceil(dataSource.length / 300);

  // action
  async function pdfPrint() {
    try {
      setLoading(true);
      // 分片打包下载
      const promiseArr = Array.from({ length }, (_, i) => {
        if (i + 1 < length) {
          return {
            data: dataSource.slice(i * 300, (i + 1) * 300),
            filename: `${urlParams?.MAB}_${i + 1}`,
          };
        } else {
          return {
            data: dataSource.slice(i * 300),
            filename: `${urlParams?.MAB}_${i + 1}`,
          };
        }
      });
      for await (const { data, filename } of promiseArr) {
        console.log(filename);
        await handleZip(data, filename);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        {dataSource?.map((item: API.Waybill[], key) => {
          return (
            <EDIPrint
              key={key}
              dataSource={item}
              page={`${key + 1}/${dataSource.length}`}
            />
          );
        })}
      </div>
      <div style={{ position: 'fixed', bottom: 20, right: 50 }}>
        <Button
          type="primary"
          loading={loading}
          shape="round"
          onClick={pdfPrint}
          icon={<DownloadOutlined />}
          size="large"
        >
          Download({length})
        </Button>
      </div>
    </div>
  );
};

export default SagawaEDI;
