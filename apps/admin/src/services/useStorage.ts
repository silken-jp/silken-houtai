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
  const userLogin = getUserInfo();
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

export function setUserInfo(data: any) {
  localStorage.setItem(loginKey, JSON.stringify(data));
}

export function removeUserInfo() {
  localStorage.removeItem(loginKey);
}

export function getUserInfo(): userLogin {
  return JSON.parse(localStorage.getItem(loginKey) || '{}');
}

export function setSearchParams(LS: string, data: any) {
  localStorage.setItem(`sk-waybill-search-${LS}`, JSON.stringify(data));
}

export function removeSearchParams(LS: string) {
  localStorage.removeItem(`sk-waybill-search-${LS}`);
}

export function getSearchParams(LS?: string) {
  if (!LS) return {};
  return JSON.parse(localStorage.getItem(`sk-waybill-search-${LS}`) || '{}');
}

export function setSelectedParams(LS: string, data: any) {
  sessionStorage.setItem(`sk-waybill-selected-${LS}`, JSON.stringify(data));
}

export function removeSelectedParams(LS: string) {
  sessionStorage.removeItem(`sk-waybill-selected-${LS}`);
}

export function getSelectedParams(LS?: string | null) {
  if (!LS) return {};
  return JSON.parse(
    sessionStorage.getItem(`sk-waybill-selected-${LS}`) || '{}',
  );
}
