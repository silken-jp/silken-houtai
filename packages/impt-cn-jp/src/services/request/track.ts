import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有追踪数据 GET /api/tracks
interface GetAllTracks extends API.Track {
  page: number;
  perPage: number;
}
export async function getAllTracks(params?: GetAllTracks) {
  return request<any>(ApiURL + '/tracks', {
    method: 'GET',
    params,
  });
}

// 创建追踪数据 POST /api/tracks
// interface ImportMultiTracks extends API.Track {}
export async function importMultiTracks() {
  return request<any>(ApiURL + '/tracks', {
    method: 'POST',
  });
}

// 获取所有追踪数据 GET /api/tracks
interface GetAllMABTracks extends API.Track {
  page: number;
  perPage: number;
}
export async function getAllMABTracks(params?: GetAllMABTracks) {
  return request<any>(ApiURL + '/tracks/mab', {
    method: 'GET',
    params,
  });
}
