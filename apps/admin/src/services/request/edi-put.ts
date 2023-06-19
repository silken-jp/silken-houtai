import { request } from 'umi';

const { ApiURL } = process.env;

// 生成西濃運輸edi txt文件 GET /api/edi-puts/gen_txt
interface GetAllEDIs {
  mawbs: string;
  EXA_DIS_in: string;
}
export async function genEDITexts(params?: GetAllEDIs) {
  return request<any>(ApiURL + '/edi-puts/gen_txt', {
    method: 'GET',
    params,
  });
}

// 生成西濃運輸edi txt文件 GET /api/edi-puts/gen_seino_txt
interface GetAllEDIs {
  mawbs: string;
  EXA_DIS_in: string;
}
export async function genSeinoEDITexts(params?: GetAllEDIs) {
  return request<any>(ApiURL + '/edi-puts/gen_seino_txt', {
    method: 'GET',
    params,
  });
}

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
  agent?: string;
  EXA_DIS_in?: string;
  userId?: string;
  putTo: 'sagawa' | 'seino';
  file: File;
}
export async function uploadEDIs(params: UploadEDIs) {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('agent', params.agent || '');
  formData.append('EXA_DIS_in', params.EXA_DIS_in || '');
  formData.append('MAB', params.MAB || '');
  formData.append('userId', params.userId || '');
  formData.append('put_to', params.putTo || '');
  return request<any>(ApiURL + '/edi-puts/put_delivery', {
    method: 'POST',
    body: formData,
    requestType: 'form',
  });
}
