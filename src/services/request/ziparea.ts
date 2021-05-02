import { request } from 'umi';
import Mock from 'mockjs';

// /** 获取当前的用户 GET /api/currentUser */
// export async function queryCurrentUser(options?: { [key: string]: any }) {
//   return request<API.CurrentUser>('/api/currentUser', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// 区域划分首页数据获取 GET /api/get_all_zip_area_names
export async function getAllZipAreaNames() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'zipAreas|10': [
            {
              _id: '@id',
              name: '@word',
              'cities|10-20': [
                {
                  state: '东京',
                  city: '@city',
                },
              ],
            },
          ],
        }),
      );
    }, 100);
  });
}

// 获取某个省的所有分区数据 GET /api/get_state_zipcodes
interface getStateZipcodes {
  state: string;
}
export async function getStateZipcodes(params: getStateZipcodes) {
  // console.log('getStateZipcodes', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'zipcodes|30': [
            {
              state: '东京',
              zipcode: '@zip',
              city: '@city',
              'address|1': ['@county', ''],
            },
          ],
        }),
      );
    }, 500);
  });
}

// 获取某个区域包含的分区邮编 GET /api/get_state_zip_area_codes
interface getStateZipAreaCodes {
  state: string;
  zip_area: string;
}
export async function getStateZipAreaCodes(params: getStateZipAreaCodes) {
  // console.log('getStateZipAreaCodes', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'zipcodes|30': ['@zip'],
        }),
      );
    }, 500);
  });
}

// 更新区域包含的邮编 GET /api/update_zip_area_codes
interface updateZipAreaCodes {
  state: string;
  zip_area: string;
  zipcodes: { state: String; city: String; zipcode: String; address: String }[];
}
export async function updateZipAreaCodes(params: updateZipAreaCodes) {
  // console.log('updateZipAreaCodes', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Mock.mock({
          'result|1': true,
        }),
      );
    }, 1000);
  });
}
