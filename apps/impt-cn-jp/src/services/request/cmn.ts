import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有cmn-setting GET /api/cmn-setting
interface GetAllCMNs extends API.CMN {
  page: number;
  perPage: number;
}
export async function getAllCMNs(params?: GetAllCMNs) {
  return request<any>(ApiURL + '/cmn-setting', {
    method: 'GET',
    params,
  });
}

// 创建cmn-setting POST /api/cmn-setting
interface CreateCMN extends API.CMN {}
export async function createCMN(params: CreateCMN) {
  return request<any>(ApiURL + '/cmn-setting', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新cmn-setting POST /api/cmn-setting/update
interface UpdateCMN extends API.CMN {
  before_origin_CMN?: string;
  after_origin_CMN?: string;
  before_modifed_CMN?: string;
  after_modifed_CMN?: string;
}
export async function updateCMN(params: UpdateCMN) {
  return request<any>(ApiURL + '/cmn-setting/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除cmn-setting POST /api/cmn-setting
interface DeleteCMN extends API.CMN {}
export async function deleteCMN(params: DeleteCMN) {
  return request<any>(ApiURL + '/cmn-setting/delete', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
