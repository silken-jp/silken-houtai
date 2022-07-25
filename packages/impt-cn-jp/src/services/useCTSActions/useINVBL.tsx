import { useRef, useState } from 'react';
import { Descriptions, Space, Modal, Button, Typography, message } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const useINVBL = () => {
  function pdfPrint() {
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
    });
    html2canvas(elem, { scale: 2 }).then(function (canvas) {
      const dataURI = canvas.toDataURL('image/jpeg');
      const width = doc.internal.pageSize.width;
      doc.addImage(dataURI, 'JPEG', 0, 0, width, 0);
      // doc.save(`${props?.dataSource?.HAB}_${viewType}.pdf`);
    });
  }
  function compressAndDownload(data: any[], fileName?: string) {
    if (data.length === 0) {
      message.warn('ダンロード項目を選択してください');
    } else {
      const zip = new JSZip();
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        const ele = data[i];
        if (ele?.PER_image?.data) {
          zip.file(`${ele?.HAB}.pdf`);
          count++;
        }
      }
      if (count > 0) {
        zip
          .generateAsync({ type: 'blob' })
          .then((res) => {
            FileSaver.saveAs(res, fileName ? fileName : '压缩包.zip');
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        message.warn('ダンロードできる項目が見つかりません。');
      }
    }
  }
};

export default useINVBL;
