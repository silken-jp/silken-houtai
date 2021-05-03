import { request } from 'umi';
import Mock from 'mockjs';

// 获取某个省的所有分区数据 GET /api/get_state_zipcodes
interface GetStateZipcodes {
  state: string;
}
export async function getZipcodesByState(option: GetStateZipcodes) {
  // console.log('getStateZipcodes', params);
  return request<any>('/api/zipcodes', {
    method: 'GET',
    params: {
      state: option.state,
    },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'zipcodes|300': [
            {
              state: '东京',
              zipcode: '@zip',
              city: '@city',
              'address|1': ['@county', '@county', '@county', '@county', ''],
            },
          ],
        }),
      );
    }, 500);
  });
}
