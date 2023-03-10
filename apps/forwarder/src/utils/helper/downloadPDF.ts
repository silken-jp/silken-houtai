import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { message } from 'antd';

export const handleBase64ToBuffer = (data: any) => {
  const binaryString = window.atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // const url = window.URL.createObjectURL(
  //   new Blob([bytes], { type: 'application/pdf' }),
  // );
  return new Blob([bytes], { type: 'application/pdf' });
};

export const handleArrayBufferToBlob = (data: any) => {
  const bytes = new Uint8Array(data);
  return new Blob([bytes], { type: 'application/pdf' });
};

export const compressAndDownload = (data: any[], fileName?: string) => {
  if (data.length === 0) {
    message.warn('ダンロード項目を選択してください');
  } else if (data.length === 1) {
    if (data[0]?.PER_image?.data) {
      FileSaver.saveAs(
        handleArrayBufferToBlob(data?.[0].PER_image.data),
        `${data?.[0]?.HAB}.pdf`,
      );
    }
  } else {
    const zip = new JSZip();
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      if (ele?.PER_image?.data) {
        zip.file(
          `${ele?.HAB}.pdf`,
          handleArrayBufferToBlob(ele.PER_image.data),
        );
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
};
