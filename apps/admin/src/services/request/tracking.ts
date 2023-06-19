import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有追踪数据 GET /api/trackings
interface GetAllTrackings extends API.Tracking {
  page: number;
  perPage: number;
}
export async function getAllTrackings(params?: GetAllTrackings) {
  return request<any>(ApiURL + '/trackings', {
    method: 'GET',
    params,
  });
}
