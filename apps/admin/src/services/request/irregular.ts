import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有irregular GET /api/irregulars
interface GetAllIrregular extends API.Irregular {
  page: number;
  perPage: number;
}
export async function getAllIrregular(params?: GetAllIrregular) {
  return request<any>(ApiURL + '/irregulars', {
    method: 'GET',
    params,
  });
}

// 更新irregular PATCH /api/irregulars/:id
interface UpdateIrregular extends Partial<API.Irregular> {
  irregularId: API.ID;
}
export async function updateIrregular(params: UpdateIrregular) {
  return request<any>(ApiURL + '/irregulars/' + params.irregularId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除irregular DELETE /api/irregulars/:id
interface DeleteIrregularById {
  irregularId: API.ID;
}
export async function deleteIrregularById(params: DeleteIrregularById) {
  return request<any>(ApiURL + '/irregulars/' + params.irregularId, {
    method: 'DELETE',
  });
}

// 返送再発送irregular POST /irregulars/import-return
interface ImportReturnIrregulars {
  irregularArray: any[];
}
export async function importReturnIrregulars(params: ImportReturnIrregulars) {
  return request<any>(ApiURL + '/irregulars/import-return', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// irregular POST /irregulars/import-other
interface ImportOtherIrregulars {
  irregularArray: any[];
}
export async function importOtherIrregulars(params: ImportOtherIrregulars) {
  return request<any>(ApiURL + '/irregulars/import-other', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
