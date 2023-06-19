import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有汇率 GET /api/currencies
interface GetCurrencies {}
export async function getCurrencies(params?: GetCurrencies) {
  return request<API.Currency[]>(ApiURL + '/currencies', {
    method: 'GET',
    params,
  });
}

// 批量创建导入汇率 POST /api/currencies/import
interface ImportCurrency {
  currencies: API.Currency[];
}
export async function importMultiCurrency(params: ImportCurrency) {
  return request<any>(ApiURL + '/currencies/import', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
