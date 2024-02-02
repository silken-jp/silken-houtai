import { request } from 'umi';

const { ApiURL2: ApiURL } = process.env;

// 获取所有运单 GET /api/waybills
interface GetAllWaybillHSCODEs extends Partial<API.Waybill> {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: number;
}
export async function getAllWaybillHSCODEs(params?: GetAllWaybillHSCODEs) {
  return request<any>(ApiURL + '/waybill-hscodes', {
    method: 'GET',
    params,
  });
}

// 获取所有运单 GET /api/waybills
interface GetAllWaybillHSCODEsCSV {}
export async function getAllWaybillHSCODEsCSV(
  params?: GetAllWaybillHSCODEsCSV,
) {
  return request<any>(ApiURL + '/waybill-hscodes/csv', {
    method: 'GET',
    params,
  });
}

// 上传更新HSCODE数据 GET /api/waybill-hscodes/import
interface ImportMultiWaybillHSCODE {
  waybillHscodesArray: any[];
}
export async function importMultiWaybillHSCODE(
  params?: ImportMultiWaybillHSCODE,
) {
  return request<any>(ApiURL + '/waybill-hscodes/import', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除hscode DELETE /api/waybills/:id
interface DeleteByWaybillHSCODEId {
  waybillHSCODEId: API.ID;
}
export async function deleteByWaybillHSCODEId(params: DeleteByWaybillHSCODEId) {
  return request<any>(ApiURL + '/waybill-hscodes/' + params.waybillHSCODEId, {
    method: 'DELETE',
  });
}
