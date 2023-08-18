import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有フォワーダー GET /api/hab-settings
interface GetAllAgentHAWBs extends API.AgentHAWB {
  page: number;
  perPage: number;
}
export async function getAllAgentHAWBs(params?: GetAllAgentHAWBs) {
  return request<any>(ApiURL + '/hab-settings', {
    method: 'GET',
    params,
  });
}

// 获取单个フォワーダー GET /api/hab-settings/:id
interface GetAgentHAWB {
  agentHAWBId: API.ID;
}
export async function getAgentHAWB(params: GetAgentHAWB) {
  return request<API.AgentHAWB>(
    ApiURL + '/hab-settings/' + params.agentHAWBId,
    {
      method: 'GET',
    },
  );
}

// 创建フォワーダー POST /api/hab-settings
interface CreateAgentHAWB extends API.AgentHAWB {}
export async function createAgentHAWB(params: CreateAgentHAWB) {
  return request<any>(ApiURL + '/hab-settings', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新フォワーダー PATCH /api/hab-settings/:id
interface UpdateAgentHAWB extends API.AgentHAWB {
  agentHAWBId: API.ID;
}
export async function updateAgentHAWB(params: UpdateAgentHAWB) {
  return request<any>(ApiURL + '/hab-settings/' + params.agentHAWBId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除フォワーダー DELETE /api/hab-settings/:id
interface DeleteAgentHAWBById {
  agentHAWBId: API.ID;
}
export async function deleteAgentHAWBById(params: DeleteAgentHAWBById) {
  return request<any>(ApiURL + '/hab-settings/' + params.agentHAWBId, {
    method: 'DELETE',
  });
}

// 再分配可用HAWB POST /api/hab-settings
interface MoveAgentHAWB extends API.AgentHAWB {
  _id: string;
  agent: string;
  start_hab: string;
  count: number;
}
export async function moveAgentHAWB(params: MoveAgentHAWB) {
  return request<any>(ApiURL + '/hab-settings/move', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
