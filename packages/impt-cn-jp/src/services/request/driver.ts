import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有司机 GET /api/drivers
interface GetAllDrivers {}
export async function getAllDrivers(params?: GetAllDrivers) {
  return request<any>(ApiURL + '/drivers', {
    method: 'GET',
  });
}

// 获取单个司机 GET /api/drivers/:id
interface GetDriver {
  driverId: API.ID;
}
export async function getDriver(params: GetDriver) {
  return request<any>(ApiURL + '/drivers' + params.driverId, {
    method: 'GET',
  });
}

// 创建司机 POST /api/drivers
interface CreateDriver extends API.Driver {}
export async function createDriver(params: CreateDriver) {
  return request<any>(ApiURL + '/drivers', {
    method: 'POST',
    data: {
      name: params.name,
      tel: params.tel,
      password: params.password,
    },
  });
}

// 更新司机 PATCH /api/drivers/:id
interface UpdateDriver extends API.Driver {
  driverId: API.ID;
}
export async function updateDriver(params: UpdateDriver) {
  return request<any>(ApiURL + '/drivers/' + params.driverId, {
    method: 'PATCH',
    data: {
      name: params.name,
      tel: params.tel,
      password: params.password,
    },
  });
}

// 删除司机 DELETE /api/drivers/:id
interface DeleteByDriverId {
  driverId: API.ID;
}
export async function deleteByDriverId(params: DeleteByDriverId) {
  return request<any>(ApiURL + '/drivers/' + params.driverId, {
    method: 'DELETE',
  });
}
