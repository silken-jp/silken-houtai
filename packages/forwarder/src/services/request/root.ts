import { request } from 'umi';

const { ApiURL } = process.env;

// 转换名字 POST /api/wash-name
interface WashName {
  ImpNameJPs: string[];
}
export async function washName(params: WashName) {
  return request<any>(ApiURL + '/wash-ImpNameJP', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 转换地址 POST /api/wash-address-en-jp
interface WashAddressEN2JP {
  originalData: any[];
}
export async function washAddressEN2JP(params: WashAddressEN2JP) {
  return request<any>(ApiURL + '/wash-address-en-jp', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
