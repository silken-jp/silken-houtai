import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有EDI GET /api/edi-puts/
interface GetAllEDIs {}
export async function getAllEDIs(params?: GetAllEDIs) {
  return request<any>(ApiURL + '/edi-puts', {
    method: 'GET',
    params,
  });
}

// 上传EDI POST /api/edi-puts/put_delivery
interface UploadEDIs {
  MAB?: string;
  userId?: string;
  file: File;
}
export async function uploadEDIs(params: UploadEDIs) {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('MAB', params.MAB || '');
  formData.append('userId', params.userId || '');
  return request<any>(ApiURL + '/edi-puts/put_delivery', {
    method: 'POST',
    body: formData,
    requestType: 'form',
  });
}
