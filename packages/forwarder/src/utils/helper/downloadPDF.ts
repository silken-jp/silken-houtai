import JSZip from 'jszip';
import FileSaver from 'file-saver';

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
  const zip = new JSZip();
  if (data.length === 0) return;
  if (data.length === 1) {
    FileSaver.saveAs(
      handleArrayBufferToBlob(data?.[0]?.PER_image?.data),
      `${data?.[0]?._id}.pdf`,
    );
  } else {
    for (let i = 0; i < data.length; i++) {
      const ele = data[i];
      zip.file(
        `${ele?._id}.pdf`,
        handleArrayBufferToBlob(ele?.PER_image?.data),
      );
    }
    zip
      .generateAsync({ type: 'blob' })
      .then((res) => {
        FileSaver.saveAs(res, fileName ? fileName : '压缩包.zip');
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
