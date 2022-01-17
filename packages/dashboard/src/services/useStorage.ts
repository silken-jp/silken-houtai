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
