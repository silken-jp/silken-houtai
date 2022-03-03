import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有用户 GET /api/users
interface GetAllUsers extends API.User {
  page: number;
  perPage: number;
}
export async function getAllUsers(params?: GetAllUsers) {
  return request<any>(ApiURL + '/users', {
    method: 'GET',
    params,
  });
}

// 创建用户 POST /api/users
interface CreateUser extends API.User {}
export async function createUser(params: CreateUser) {
  return request<any>(ApiURL + '/users', {
    method: 'POST',
    data: {
      name: params?.name,
      tel: params?.tel,
      password: params?.password,
      is_cleanser: params?.is_cleanser,
      is_broker: params?.is_broker,
    },
  });
}

// 创建用户 POST /api/users
interface UserSingIn extends API.User {}
export async function userSingIn(params: UserSingIn) {
  return request<any>(ApiURL + '/auth-users/signin', {
    method: 'POST',
    data: {
      tel: params?.tel,
      password: params?.password,
    },
  });
}

// 更新用户 PATCH /api/users/:id
interface UpdateUser extends API.User {
  userId: API.ID;
}
export async function UpdateUser(params: UpdateUser) {
  return request<any>(ApiURL + '/users/' + params.userId, {
    method: 'PATCH',
    data: {
      name: params?.name,
      tel: params?.tel,
      password: params?.password,
      is_cleanser: params?.is_cleanser,
      is_broker: params?.is_broker,
    },
  });
}

// 删除用户 DELETE /api/users/:id
interface DeleteByUserId {
  userId: API.ID;
}
export async function deleteByUserId(params: DeleteByUserId) {
  return request<any>(ApiURL + '/users/' + params.userId, {
    method: 'DELETE',
  });
}
