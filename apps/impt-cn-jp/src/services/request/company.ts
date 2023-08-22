import { request } from 'umi';

const { ApiURL } = process.env;

// 获取公司信息 GET /api/company
interface GetCompany extends API.Company {
  page: number;
  perPage: number;
}
export async function getCompany(params?: GetCompany) {
  return request<any>(ApiURL + '/company', {
    method: 'GET',
    params,
  });
}

// 更新公司信息 PATCH /api/company/:id
interface UpdateCompany extends API.Company {
  companyId: API.ID;
}
export async function updateCompany(params: UpdateCompany) {
  return request<any>(ApiURL + '/company/' + params.companyId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 通用配送料上传 POST /agents/import-delivery
interface ImportDeliveryPrice {
  deliveryKey: string;
  deliveryPriceArray: any[];
}
export async function importDeliveryPrice(params: ImportDeliveryPrice) {
  return request<any>(ApiURL + '/company/import-delivery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
