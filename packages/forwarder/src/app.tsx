import { history } from 'umi';

import { utils } from '@silken-houtai/core';
import { checkUserLogin } from '@/services/useStorage';

const loginKey = utils.STORAGE_KEY + 'agentLogin';

/**
 *
 * 路由权限判定, 每次切换路由都会触发
 */
export function onRouteChange() {
  const { pathname } = history.location;
  //初始化localStorage中的登陆信息
  const isLogin = checkUserLogin(loginKey);

  //清除错误登陆信息
  if (!isLogin) {
    localStorage.removeItem(loginKey);
  }

  //路由登陆判定
  if (pathname !== '/login' && !isLogin) {
    return history.replace('/login');
  }
  //重定向
  if (isLogin) {
    const pathNames = ['/', '/login'];
    if (pathNames.some((p) => pathname === p)) {
      return history.replace('/home');
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
