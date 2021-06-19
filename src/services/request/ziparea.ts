import { request } from 'umi';

const { ApiURL } = process.env;

// 区域划分首页数据获取 GET /api/zip_areas/with_cities
export async function getZipAreas() {
  return request<any>(ApiURL + '/zip_areas/with_cities', {
    method: 'GET',
  });
}

// 获取某个区域包含的分区邮编 GET /api/zip_areas/by_state
interface getZipAreaCodesByState {
  zipAreaId: API.ID;
  state: string;
}
export async function getZipAreaCodesByState(params: getZipAreaCodesByState) {
  return request<any>(ApiURL + '/zip_areas/by_filter', {
    method: 'GET',
    params: {
      _id: params.zipAreaId,
      state: params.state,
    },
  });
}

// 创建区域 POST /api/zip_areas
interface CreateZipArea {
  name: string;
}
export async function createZipArea(params: CreateZipArea) {
  return request<any>(ApiURL + '/zip_areas', {
    method: 'POST',
    data: {
      name: params.name,
    },
  });
}

// 修改区域名字 PATCH /api/zip_areas/:id
interface UpdateNameByZipAreaId {
  zipAreaId: API.ID;
  name: string;
}
export async function updateNameByZipAreaId(params: UpdateNameByZipAreaId) {
  return request<any>(ApiURL + '/zip_areas/' + params.zipAreaId, {
    method: 'PATCH',
    data: {
      name: params.name,
    },
  });
}

// 删除区域名字 DELETE /api/zip_areas/:id
interface DeleteByZipAreaId {
  zipAreaId: API.ID;
}
export async function deleteByZipAreaId(params: DeleteByZipAreaId) {
  return request<any>(ApiURL + '/zip_areas/' + params.zipAreaId, {
    method: 'DELETE',
  });
}

// 更新区域包含的邮编 GET /api/zip_areas/update_zipcodes/
interface UpdateZipAreaCodes {
  zipAreaId: API.ID;
  state: string;
  zipcodes: API.ZipCode[];
}
export async function updateZipCodesByZipAreaId(params: UpdateZipAreaCodes) {
  return request<any>(
    ApiURL + '/zip_areas/update_zipcodes/' + params.zipAreaId,
    {
      method: 'PUT',
      data: {
        state: params.state,
        zipcodes: params.zipcodes,
      },
    },
  );
}
