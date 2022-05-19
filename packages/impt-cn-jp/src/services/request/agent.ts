import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有フォワーダー GET /api/agents
interface GetAllAgents extends API.Agent {
  page: number;
  perPage: number;
}
export async function getAllAgents(params?: GetAllAgents) {
  return request<any>(ApiURL + '/agents', {
    method: 'GET',
    params,
  });
}

// 创建フォワーダー POST /api/agents
interface CreateAgent extends API.Agent {}
export async function createAgent(params: CreateAgent) {
  return request<any>(ApiURL + '/agents', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// フォワーダーlogin POST /auth-agents/signin
interface AgentSingIn extends API.Agent {}
export async function userSingIn(params: AgentSingIn) {
  return request<any>(ApiURL + '/auth-agents/signin', {
    method: 'POST',
    data: {
      account: params?.account,
      password: params?.password,
    },
  });
}

// 更新フォワーダー PATCH /api/agents/:id
interface UpdateAgent extends API.Agent {
  agentId: API.ID;
}
export async function updateAgent(params: UpdateAgent) {
  return request<any>(ApiURL + '/agents/' + params.agentId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除フォワーダー DELETE /api/agents/:id
interface DeleteAgentById {
  agentId: API.ID;
}
export async function deleteAgentById(params: DeleteAgentById) {
  return request<any>(ApiURL + '/agents/' + params.agentId, {
    method: 'DELETE',
  });
}

// 获取单个フォワーダー GET /api/agents/:id
interface GetAgent {
  agentId: API.ID;
}
export async function getAgent(params: GetAgent) {
  return request<API.Agent>(ApiURL + '/agents/' + params.agentId, {
    method: 'GET',
  });
}
