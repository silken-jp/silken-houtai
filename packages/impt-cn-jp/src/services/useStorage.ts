import { utils } from '@silken-houtai/core';

const loginKey = utils.STORAGE_KEY + 'userLogin';

/**
 *
 * 通过param进行登陆判定
 * @param {*} userLogin
 * @returns isLogin: boolean
 */
export function checkUserLogin() {
  let isLogin = false;
  const userLogin = JSON.parse(localStorage.getItem(loginKey) || '{}');
  try {
    const { token, expiryDate } = userLogin;
    isLogin = !!token && token !== 'null';
    if (!isLogin) {
      console.log('请登录');
    } else if (expiryDate && new Date(expiryDate) <= new Date()) {
      console.log('token已过期');
      isLogin = false;
    }
  } catch (err) {
    console.log(err);
  }
  return isLogin;
}

export function removeUserInfo() {
  localStorage.getItem(loginKey);
}

export function getUserInfo(): userLogin {
  return JSON.parse(localStorage.getItem(loginKey) || '{}');
}
