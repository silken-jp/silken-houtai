import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有HS code GET /api/waybills
interface GetAllHScodes extends Partial<API.HScodes> {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: number;
}
export async function getAllHScodes(params?: GetAllHScodes) {
  return request<any>(ApiURL + '/hscodes', {
    method: 'GET',
    params,
  });
}

// 批量创建导入 POST /api/hscodes/import
interface ImportMultiHScodes {
  hscodesArray: API.HScodes[];
}
export async function importHScodes(params: ImportMultiHScodes) {
  return request<any>(ApiURL + '/hscodes/import', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除HS code DELETE /api/hscodes/:id
interface DeleteHscodesById {
  hscodeId: API.ID;
}
export async function deleteHscodesById(params: DeleteHscodesById) {
  return request<any>(ApiURL + '/hscodes/' + params.hscodeId, {
    method: 'DELETE',
  });
}
