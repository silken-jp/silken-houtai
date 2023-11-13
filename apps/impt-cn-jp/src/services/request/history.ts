import { request } from 'umi';

const { ApiURL } = process.env;

// 获取waybill备份数据 GET /api/histories/waybills
interface GetWaybillsHistories extends API.Waybill {
  page: number;
  perPage: number;
}
export async function getWaybillsHistories(params?: GetWaybillsHistories) {
  return request<any>(ApiURL + '/histories/waybills', {
    method: 'GET',
    params,
  });
}

// 获取Tracks备份数据 GET /api/histories/tracks
interface GetTracksHistories extends API.Track {
  page: number;
  perPage: number;
}
export async function getTracksHistories(params?: GetTracksHistories) {
  return request<any>(ApiURL + '/histories/tracks', {
    method: 'GET',
    params,
  });
}

// 获取Trackings备份数据 GET /api/histories/trackings
interface GetTrackingsHistories extends API.Tracking {
  page: number;
  perPage: number;
}
export async function getTrackingsHistories(params?: GetTrackingsHistories) {
  return request<any>(ApiURL + '/histories/trackings', {
    method: 'GET',
    params,
  });
}
