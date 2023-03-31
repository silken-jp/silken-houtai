import { history, RequestConfig } from 'umi';

import { checkUserLogin, removeUserInfo } from '@/services/useStorage';

const { ApiKey } = process.env;

/**
 *
 * 路由权限判定, 每次切换路由都会触发
 */
export function onRouteChange() {
  const { pathname } = history.location;
  //初始化localStorage中的登陆信息
  const isLogin = checkUserLogin();

  //清除错误登陆信息
  if (!isLogin) {
    removeUserInfo();
  }

  //路由登陆判定
  if (pathname !== '/login' && !isLogin) {
    return history.replace('/login');
  }
  //重定向
  if (isLogin) {
    const pathNames = ['/', '/login'];
    if (pathNames.some((p) => pathname === p)) {
      return history.replace('/importer');
    }
  }
}

/**
 *
 * 初始化应用store，返回数据至useModel('@@initialState')
 * @returns { userLogin }
 */
export async function getInitialState() {
  //初始化登陆数据,获取访问权限等
  return {};
}

export const request: RequestConfig = {
  headers: {
    'api-key': ApiKey || '',
  },
};
