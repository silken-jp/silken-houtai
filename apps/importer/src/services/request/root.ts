import { request } from 'umi';

const { ApiURL } = process.env;

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

// 转换名字 POST /api/wash-name
interface WashAll {
  originalData: any[];
  isWashName: boolean;
  isNameReverse: boolean;
  isWashIAD: boolean;
}
export async function washAll(params: WashAll) {
  return request<any>(ApiURL + '/wash-all', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 转换地址 GET /api/gen-impname/:num
interface GenImpName {
  num: number;
}
export async function genImpName(params: GenImpName) {
  return request<any>(ApiURL + '/gen-impname/' + params.num, {
    method: 'GET',
  });
}
