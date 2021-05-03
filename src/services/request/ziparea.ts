import { request } from 'umi';
import Mock from 'mockjs';

// 创建区域 POST /api/zip_areas
interface CreateZipArea {
  name: string;
}
export async function createZipArea(params: CreateZipArea) {
  return request<any>('/api/zip_areas', {
    method: 'POST',
    data: {
      name: params.name,
    },
  });
}

// 修改区域名字 PATCH /api/zip_areas/:id
interface UpdateNameByZipAreaId {
  id: string;
  name: string;
}
export async function updateNameByZipAreaId(params: UpdateNameByZipAreaId) {
  return request<any>('/api/zip_areas/' + params.id, {
    method: 'PATCH',
    data: {
      name: params.name,
    },
  });
}

// 修改区域名字 DELETE /api/zip_areas/:id
interface DeleteByZipAreaId {
  id: string;
}
export async function deleteByZipAreaId(params: DeleteByZipAreaId) {
  return request<any>('/api/zip_areas/' + params.id, {
    method: 'DELETE',
  });
}

// 区域划分首页数据获取 GET /api/zip_areas
export async function getZipAreas() {
  return request<any>('/api/zip_areas', {
    method: 'GET',
  });
}

// 获取某个区域包含的分区邮编 GET /api/get_state_zip_area_codes
interface GetStateZipAreaCodes {
  state: string;
  zip_area: string;
}
export async function getStateZipAreaCodes(params: GetStateZipAreaCodes) {
  // console.log('getStateZipAreaCodes', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@range(10)'));
    }, 500);
  });
}

// 更新区域包含的邮编 GET /api/update_zip_area_codes
interface UpdateZipAreaCodes {
  state: string;
  zip_area: string;
  zipcodes: { state: String; city: String; zipcode: String; address: String }[];
}
export async function updateZipCodesByZipAreaId(params: UpdateZipAreaCodes) {
  // console.log('updateZipAreaCodes', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'result|1': true,
        }),
      );
    }, 1000);
  });
}
