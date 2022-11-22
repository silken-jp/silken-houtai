import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有フォワーダー GET /api/issues
interface GetAllIssues extends Partial<API.Issue> {
  page: number;
  perPage: number;
}
export async function getAllIssues(params?: GetAllIssues) {
  return request<any>(ApiURL + '/issues', {
    method: 'GET',
    params,
  });
}

// 创建フォワーダー POST /api/issues
interface CreateIssue extends Partial<API.Issue> {}
export async function createIssue(params: CreateIssue) {
  return request<any>(ApiURL + '/issues', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新フォワーダー PATCH /api/issues/:id
interface UpdateIssue extends Partial<API.Issue> {
  issueId: API.ID;
}
export async function updateIssue(params: UpdateIssue) {
  return request<any>(ApiURL + '/issues/' + params.issueId, {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}

// 删除フォワーダー DELETE /api/issues/:id
interface DeleteIssueById {
  issueId: API.ID;
}
export async function deleteIssueById(params: DeleteIssueById) {
  return request<any>(ApiURL + '/issues/' + params.issueId, {
    method: 'DELETE',
  });
}

// 获取单个フォワーダー GET /api/issues/:id
interface GetIssue {
  issueId: API.ID;
}
export async function getIssue(params: GetIssue) {
  return request<API.Issue>(ApiURL + '/issues/' + params.issueId, {
    method: 'POST',
  });
}

// 生成通关问题
interface GenIssueType {
  status: 'status1' | 'status2';
}
export async function genIssueType1(params: GenIssueType) {
  return request<API.Issue>(ApiURL + '/issues/gen_type1_' + params.status, {
    method: 'POST',
  });
}

// 生成仓库问题
export async function genIssueType2() {
  return request<API.Issue>(ApiURL + '/issues/gen_type2', {
    method: 'POST',
  });
}

// 生成海关检查问题
export async function genIssueType3() {
  return request<API.Issue>(ApiURL + '/issues/gen_type3', {
    method: 'POST',
  });
}

// 生成货物发送问题
export async function genIssueType4(params: GenIssueType) {
  return request<API.Issue>(ApiURL + '/issues/gen_type4_' + params.status, {
    method: 'POST',
  });
}
