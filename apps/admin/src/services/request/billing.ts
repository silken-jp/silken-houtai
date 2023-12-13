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

// 获取单个billing GET /api/billings/tabs//:billingId
interface GetBillingById {
  billingId: API.ID;
}
export async function getBillingTabs(params?: GetBillingById) {
  return request<any>(ApiURL + '/billings/tabs/' + params?.billingId);
}

// 创建billing POST /api/billings
interface CreateBilling {
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

// 创建billing POST /api/billings
interface CreateAllPrice {
  billingId: API.ID;
}
export async function createAllPrice(params: CreateAllPrice) {
  return request<any>(ApiURL + '/billings/create-all-price', {
    method: 'POST',
    data: {
      ...params,
    },
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

// 创建立替項目 POST /api/billings/irregular
interface BillingIrregular {
  billingId: API.ID;
}
export async function billingIrregular(params: BillingIrregular) {
  return request<any>(ApiURL + '/billings/irregular', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建立替項目 POST /api/billings/delivery
interface BillingDelivery {
  billingId: API.ID;
}
export async function billingDelivery(params: BillingDelivery) {
  return request<any>(ApiURL + '/billings/delivery', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取详细 POST /api/billings/get-waybills
interface GetBillingWaybills {
  agent: API.ID;
  start_date: string;
  end_date: string;
}
export async function getBillingWaybills(params: GetBillingWaybills) {
  return request<any>(ApiURL + '/billings/get-waybills', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取二次上屋，通关详细 POST /api/waybills/by-billing
interface GetWaybillsByBillingId {
  billingId: string;
}
export async function getWaybillsByBillingId(params: GetWaybillsByBillingId) {
  return request<any>(ApiURL + '/billings/get-waybills-by-billing', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取保管详细 POST /api/billings/get-storage-by-billing
interface GetStorageByBillingId {
  billingId: string;
}
export async function getStorageByBillingId(params: GetStorageByBillingId) {
  return request<any>(ApiURL + '/billings/get-storage-by-billing', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取税関検査详细 POST /api/billings/get-inspection-by-billing
interface GetInspectionByBillingId {
  billingId: string;
}
export async function getInspectionByBillingId(
  params: GetInspectionByBillingId,
) {
  return request<any>(ApiURL + '/billings/get-inspection-by-billing', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取详细 POST /api/billings/get-mabs
interface GetBillingMABs {
  agent: API.ID;
  start_date: string;
  end_date: string;
}
export async function getBillingMABs(params: GetBillingMABs) {
  return request<any>(ApiURL + '/billings/get-mabs', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
