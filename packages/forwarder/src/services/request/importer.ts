import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有司机 GET /api/drivers
interface GetImportersByFilter extends API.Importer {}
export async function getImportersByFilter(params?: GetImportersByFilter) {
  return request<any>(ApiURL + '/importers/by_filter', {
    method: 'POST',
    params,
  });
}
