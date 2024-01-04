import jsPDF from 'jspdf';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import renderINV from './renderINV';
import renderBL from './renderBL';
import renderINV2 from './renderINV2';

export async function renderMutiINV(data: any) {
  const zip = new JSZip();
  const canvas = document.createElement('canvas');
  canvas.width = 2480;
  canvas.height = 3508;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw '';
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const isIDA = element.waybill_type === 'IDA';
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

    if (isIDA) {
      const dataINV2s = await renderINV2(ctx, element);
      if (dataINV2s) {
        for (let index = 0; index < dataINV2s?.length; index++) {
          const dataURI = dataINV2s[index];
          doc.addImage(dataURI, 'jpeg', 0, 0, w, h);
          doc.addPage('a4', 'p');
        }
      }
    }

    await renderBL(ctx, element);
    const dataBL = canvas.toDataURL('image/jpeg', 1.0);
    doc.addImage(dataBL, 'jpeg', 0, 0, w, h);

    zip.file(`${element?.ID || '*'}-${element?.HAB}.pdf`, doc.output('blob'));
  }

  zip
    .generateAsync({ type: 'blob' })
    .then((res) => {
      FileSaver.saveAs(res, data?.MAB || '压缩包.zip');
    })
    .catch((error) => {
      console.log(error);
    });
}
