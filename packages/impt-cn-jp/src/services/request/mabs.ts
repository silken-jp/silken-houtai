import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有フォワーダー GET /api/mabs/gen-mabs
interface GenMabs extends Partial<API.Waybill> {
  agentId?: API.ID;
  flightStartDate?: string;
  flightEndDate?: string;
}
export async function genMabs(params?: GenMabs) {
  return request<any>(ApiURL + '/mabs/gen-mabs', {
    method: 'GET',
    params,
  });
}

// 获取所有フォワーダー GET /api/issues
interface GetMabs extends Partial<API.Waybill> {
  page: number;
  perPage: number;
  agentId?: API.ID;
}
export async function getMabs(params?: GetMabs) {
  return request<any>(ApiURL + '/mabs', {
    method: 'GET',
    params,
  });
}

// 获取所有フォワーダー GET /api/issues
interface GetMonthStat {
  agentId?: API.ID;
  flightStartDate?: string;
  flightEndDate?: string;
}
export async function getMonthStat(params?: GetMonthStat) {
  return request<any>(ApiURL + '/mabs/month-stat', {
    method: 'GET',
    params,
  });
}

// 获取机场分类count GET /api/dst_by_date
interface GetWeekByDate {
  agentId?: API.ID;
  flightStartDate?: string;
  flightEndDate?: string;
}
export async function getWeekByDate(params?: GetWeekByDate) {
  return request<any>(ApiURL + '/mabs/dst_week_by_date', {
    method: 'GET',
    params,
  });
}
