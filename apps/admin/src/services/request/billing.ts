import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有billing GET /api/billings
interface GetAllBilling extends API.Billing {
  page: number;
  perPage: number;
}
export async function getAllBilling(params?: GetAllBilling) {
  return request<any>(ApiURL + '/billings', {
    method: 'GET',
    params,
  });
}

// 获取单个billing GET /api/billings/:billingId
interface GetBillingById {
  billingId: API.ID;
}
export async function getBillingById(params?: GetBillingById) {
  return request<any>(ApiURL + '/billings/' + params?.billingId);
}

// 创建billing POST /api/billings
interface CreateBilling extends API.Billing {
  agent: API.ID;
  start_date: string;
  end_date: string;
}
export async function createBilling(params: CreateBilling) {
  return request<any>(ApiURL + '/billings', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新billing POST /api/billings/update
interface UpdateBilling extends API.Billing {}
export async function updateBilling(params: UpdateBilling) {
  return request<any>(ApiURL + '/billings/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除フォワーダー DELETE /api/billings/:id
interface DeleteBillingById {
  billingId: API.ID;
}
export async function deleteBillingById(params: DeleteBillingById) {
  return request<any>(ApiURL + '/billings/' + params.billingId, {
    method: 'DELETE',
  });
}

// 创建一次上屋料金 POST /api/billings/first-bonded
interface BillingFirstBonded {
  billingId: API.ID;
}
export async function billingFirstBonded(params: BillingFirstBonded) {
  return request<any>(ApiURL + '/billings/first-bonded', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建二次上屋料金 POST /api/billings/second-bonded
interface BillingSecondBonded {
  billingId: API.ID;
}
export async function billingSecondBonded(params: BillingSecondBonded) {
  return request<any>(ApiURL + '/billings/second-bonded', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建通関料 POST /api/billings/clearance
interface BillingClearance {
  billingId: API.ID;
}
export async function billingClearance(params: BillingClearance) {
  return request<any>(ApiURL + '/billings/clearance', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建保管料 POST /api/billings/storage
interface BillingStorage {
  billingId: API.ID;
}
export async function billingStorage(params: BillingStorage) {
  return request<any>(ApiURL + '/billings/storage', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建立替項目 POST /api/billings/advance
interface BillingAdvance {
  billingId: API.ID;
}
export async function billingAdvance(params: BillingAdvance) {
  return request<any>(ApiURL + '/billings/advance', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建立替項目 POST /api/billings/inspection
interface BillingInspection {
  billingId: API.ID;
}
export async function billingInspection(params: BillingInspection) {
  return request<any>(ApiURL + '/billings/inspection', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
