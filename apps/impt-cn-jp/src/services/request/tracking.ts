import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有追踪数据 GET /api/trackings
interface GetAllTrackings extends API.Tracking {
  page: number;
  perPage: number;
  BL_: any;
}
export async function getAllTrackings(params?: GetAllTrackings) {
  return request<any>(ApiURL + '/trackings', {
    method: 'GET',
    params,
  });
}

// 获取所有追踪数据 GET /api/trackings
interface GetAllTrackingsFull extends API.Tracking {
  MAB: string;
  category: string;
}
export async function getAllTrackingsFull(params?: GetAllTrackingsFull) {
  return request<any>(ApiURL + '/trackings/full', {
    method: 'GET',
    params,
  });
}
