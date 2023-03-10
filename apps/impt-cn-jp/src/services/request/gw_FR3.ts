import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有FR3价格对应表 GET /api/gwfr3-setting
interface GetAllGW_FR3s extends API.GW_FR3 {
  page: number;
  perPage: number;
}
export async function getAllGW_FR3s(params?: GetAllGW_FR3s) {
  return request<any>(ApiURL + '/gwfr3-setting', {
    method: 'GET',
    params,
  });
}

// 获取单个FR3价格对应表 GET /api/gwip4-setting/:id
interface GetGW_IP4 {
  GW_FR3Id: API.ID;
}
export async function getGW_IP4(params: GetGW_IP4) {
  return request<API.GW_IP4>(ApiURL + '/gwip4-setting/' + params.GW_FR3Id, {
    method: 'GET',
  });
}

// 创建FR3价格对应表 POST /api/gwfr3-setting
interface CreateGW_FR3 extends API.GW_FR3 {}
export async function createGW_FR3(params: CreateGW_FR3) {
  return request<any>(ApiURL + '/gwfr3-setting', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新FR3价格对应表 PATCH /api/gwfr3-setting/:id
interface UpdateGW_FR3 extends API.GW_FR3 {
  GW_FR3Id: API.ID;
}
export async function updateGW_FR3(params: UpdateGW_FR3) {
  return request<any>(ApiURL + '/gwfr3-setting/' + params.GW_FR3Id, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除FR3价格对应表 DELETE /api/gwfr3-setting/:id
interface DeleteGW_FR3ById {
  GW_FR3Id: API.ID;
}
export async function deleteGW_FR3ById(params: DeleteGW_FR3ById) {
  return request<any>(ApiURL + '/gwfr3-setting/' + params.GW_FR3Id, {
    method: 'DELETE',
  });
}
