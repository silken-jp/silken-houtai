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
interface UploadEDIs {}
export async function uploadEDIs(params: UploadEDIs) {
  return request<any>(ApiURL + '/edi-puts/put_delivery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
