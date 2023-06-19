import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有フォワーダー GET /api/hab-setting-groups
interface GetAllHAWBGroups extends API.HAWBGroup {
  page: number;
  perPage: number;
}
export async function getAllHAWBGroups(params?: GetAllHAWBGroups) {
  return request<any>(ApiURL + '/hab-setting-groups', {
    method: 'GET',
    params,
  });
}

// 获取单个フォワーダー GET /api/hab-setting-groups/:id
interface GetHAWBGroup {
  HAWBGroupId: API.ID;
}
export async function getHAWBGroup(params: GetHAWBGroup) {
  return request<API.HAWBGroup>(
    ApiURL + '/hab-setting-groups/' + params.HAWBGroupId,
    {
      method: 'GET',
    },
  );
}

// 创建フォワーダー POST /api/hab-setting-groups
interface CreateHAWBGroup extends API.HAWBGroup {}
export async function createHAWBGroup(params: CreateHAWBGroup) {
  return request<any>(ApiURL + '/hab-setting-groups', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建フォワーダー POST /api/hab-setting-groups/auto
interface AutoHAWBGroup extends Partial<API.AgentHAWB> {
  hab_setting_group: API.ID;
}
export async function autoHAWBGroup(params: AutoHAWBGroup) {
  return request<any>(ApiURL + '/hab-setting-groups/auto', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新フォワーダー PATCH /api/hab-setting-groups/:id
interface UpdateHAWBGroup extends API.HAWBGroup {
  HAWBGroupId: API.ID;
}
export async function updateHAWBGroup(params: UpdateHAWBGroup) {
  return request<any>(ApiURL + '/hab-setting-groups/' + params.HAWBGroupId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除フォワーダー DELETE /api/hab-setting-groups/:id
interface DeleteHAWBGroupById {
  HAWBGroupId: API.ID;
}
export async function deleteHAWBGroupById(params: DeleteHAWBGroupById) {
  return request<any>(ApiURL + '/hab-setting-groups/' + params.HAWBGroupId, {
    method: 'DELETE',
  });
}
