import { request } from 'umi';

const { ApiURL } = process.env;

// 获取某个省的所有分区数据 GET /api/get_state_zipcodes
interface GetStateZipcodes {
  state: string;
}
export async function getZipcodesByState(params: GetStateZipcodes) {
  return request<any>(ApiURL + '/zipcodes', {
    method: 'GET',
    params: {
      state: params.state,
    },
  });
}

// 转换地址 POST /api/zipcodes/wash-address
interface WashAddress {
  originalAdds: { address: string; zip: string }[];
}
export async function washAddress(params: WashAddress) {
  return request<any>(ApiURL + '/zipcodes/wash-address', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
