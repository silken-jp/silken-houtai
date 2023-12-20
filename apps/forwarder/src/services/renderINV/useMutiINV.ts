import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { message } from 'antd';
import FileSaver from 'file-saver';
import { useRequest } from 'ahooks';

import { getAllWaybillsForwarder } from '../request/waybill';
import renderINV from './renderINV';
import renderBL from './renderBL';
import renderINV2 from './renderINV2';

interface UseMutiINV {
  params: any;
}

export function useMutiINV(opt: UseMutiINV) {
  const downloadINVApi = useRequest(
    async () =>
      await getAllWaybillsForwarder({
        ...opt?.params,
        page: 0,
        perPage: 100000000,
      }),
    {
      manual: true,
      onError: (err) => {
        message.error(err?.message);
      },
      onSuccess: async (data) => {
        const zip = new JSZip();
        const canvas = document.createElement('canvas');
        canvas.width = 2480;
        canvas.height = 3508;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw '';
        for (let index = 0; index < data.waybills.length; index++) {
          const element = data.waybills[index];
          const doc = new jsPDF({
            orientation: 'p',
            format: 'a4',
          });
          const w = doc.internal.pageSize.width;
          const h = doc.internal.pageSize.height;
          await renderINV(ctx, element);
          const dataINV = canvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(dataINV, 'jpeg', 0, 0, w, h);
          doc.addPage('a4', 'p');

          await renderINV2(ctx, element);
          const dataINV2 = canvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(dataINV2, 'jpeg', 0, 0, w, h);
          doc.addPage('a4', 'p');

          await renderBL(ctx, element);
          const dataBL = canvas.toDataURL('image/jpeg', 1.0);
          doc.addImage(dataBL, 'jpeg', 0, 0, w, h);
          zip.file(`${element?.HAB}.pdf`, doc.output('blob'));
        }
        zip
          .generateAsync({ type: 'blob' })
          .then((res) => {
            FileSaver.saveAs(res, data?.MAB || '压缩包.zip');
          })
          .catch((error) => {
            console.log(error);
          });
      },
    },
  );

  return downloadINVApi;
}
