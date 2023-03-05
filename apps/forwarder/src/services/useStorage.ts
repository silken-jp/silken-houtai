import { utils } from '@silken-houtai/core';

const loginKey = utils.STORAGE_KEY + 'agentLogin';

/**
 *
 * 通过param进行登陆判定
 * @param {*} userLogin
 * @returns isLogin: boolean
 */
export function checkUserLogin(Key: string) {
  let isLogin = false;
  const userLogin = JSON.parse(localStorage.getItem(Key) || '{}');
  try {
    const { _id, expiryDate } = userLogin;
    isLogin = !!_id && _id !== 'null';
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

export function setAgentInfo(data: any) {
  localStorage.setItem(loginKey, JSON.stringify(data));
}

export function removeAgentInfo() {
  localStorage.removeItem(loginKey);
}

export function getAgentInfo(): agentLogin {
  return JSON.parse(localStorage.getItem(loginKey) || '{}');
}
