import { request } from 'umi';

// 获取某个省的所有分区数据 GET /api/get_state_zipcodes
interface GetStateZipcodes {
  state: string;
}
export async function getZipcodesByState(option: GetStateZipcodes) {
  return request<any>('/api/zipcodes', {
    method: 'GET',
    params: {
      state: option.state,
    },
  });
}
