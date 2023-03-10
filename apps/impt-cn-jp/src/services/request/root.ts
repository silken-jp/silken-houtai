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
