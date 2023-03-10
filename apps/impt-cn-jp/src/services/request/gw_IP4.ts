import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有IP4价格对应表 GET /api/gwip4-setting
interface GetAllGW_IP4s extends API.GW_IP4 {
  page: number;
  perPage: number;
}
export async function getAllGW_IP4s(params?: GetAllGW_IP4s) {
  return request<any>(ApiURL + '/gwip4-setting', {
    method: 'GET',
    params,
  });
}

// 获取单个IP4价格对应表 GET /api/gwip4-setting/:id
interface GetGW_IP4 {
  GW_IP4Id: API.ID;
}
export async function getGW_IP4(params: GetGW_IP4) {
  return request<API.GW_IP4>(ApiURL + '/gwip4-setting/' + params.GW_IP4Id, {
    method: 'GET',
  });
}

// 创建IP4价格对应表 POST /api/gwip4-setting
interface CreateGW_IP4 extends API.GW_IP4 {}
export async function createGW_IP4(params: CreateGW_IP4) {
  return request<any>(ApiURL + '/gwip4-setting', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新IP4价格对应表 PATCH /api/gwip4-setting/:id
interface UpdateGW_IP4 extends API.GW_IP4 {
  GW_IP4Id: API.ID;
}
export async function updateGW_IP4(params: UpdateGW_IP4) {
  return request<any>(ApiURL + '/gwip4-setting/' + params.GW_IP4Id, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除IP4价格对应表 DELETE /api/gwip4-setting/:id
interface DeleteGW_IP4ById {
  GW_IP4Id: API.ID;
}
export async function deleteGW_IP4ById(params: DeleteGW_IP4ById) {
  return request<any>(ApiURL + '/gwip4-setting/' + params.GW_IP4Id, {
    method: 'DELETE',
  });
}
