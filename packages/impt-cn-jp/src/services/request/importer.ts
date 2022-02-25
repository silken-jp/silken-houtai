import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有司机 GET /api/drivers
interface GetImportersByFilter extends API.Importer {
  page: number;
  perPage: number;
}
export async function getImporters(params?: GetImportersByFilter) {
  return request<any>(ApiURL + '/importers', {
    method: 'GET',
    params,
  });
}

// 获取所有司机 GET /api/drivers
interface GetImportersByFilter extends API.Importer {}
export async function getImportersByFilter(data?: GetImportersByFilter) {
  return request<any>(ApiURL + '/importers/by_filter', {
    method: 'POST',
    data,
  });
}
