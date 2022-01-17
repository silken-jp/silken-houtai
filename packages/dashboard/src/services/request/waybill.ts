import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有运单 GET /api/waybills
interface GetAllWaybills extends API.Waybill {}
export async function getAllWaybills(params?: GetAllWaybills) {
  return request<any>(ApiURL + '/waybills', {
    method: 'GET',
    params,
  });
}

// 获取单个运单 GET /api/waybills/:id
interface GetWaybill {
  waybillId: API.ID;
}
export async function getWaybill(params: GetWaybill) {
  return request<any>(ApiURL + '/waybills/' + params.waybillId, {
    method: 'GET',
  });
}

// 创建运单 POST /api/waybills
interface CreateWaybill extends API.Waybill {}
export async function createWaybill(params: CreateWaybill) {
  return request<any>(ApiURL + '/waybills', {
    method: 'POST',
    data: {
      mawb_no: params?.mawb_no,
      hawb_no: params?.hawb_no,
      jp_delivery_no: params?.jp_delivery_no,
      cn_delivery_no: params?.cn_delivery_no,
      jp_delivery_company: params?.jp_delivery_company,
      cn_delivery_company: params?.cn_delivery_company,
      flight_no: params?.flight_no,
      waybill_input_time: params?.waybill_input_time,
    },
  });
}

// 批量创建导入 POST /api/waybills/import-multi
interface ImportMultiWaybill extends API.Waybill {}
export async function importMultiWaybill(params: ImportMultiWaybill) {
  return request<any>(ApiURL + '/waybills/import-multi', {
    method: 'POST',
    data: {
      waybills: params,
    },
  });
}

// 批量创建导入 POST /api/waybills/multi
interface CreateMultiWaybill extends API.Waybill {}
export async function createMultiWaybill(params: CreateMultiWaybill) {
  return request<any>(ApiURL + '/waybills/multi', {
    method: 'POST',
    data: {
      waybills: params,
    },
  });
}

// 批量更新导入 POST /api/waybills/update-multi
interface UpdateMultiWaybill extends API.Waybill {}
export async function updateMultiWaybill(params: UpdateMultiWaybill) {
  return request<any>(ApiURL + '/waybills/update-multi', {
    method: 'POST',
    data: {
      waybills: params,
    },
  });
}

// 更新运单 PATCH /api/waybills/:id
interface UpdateWaybill extends API.Waybill {
  waybillId: API.ID;
}
export async function updateWaybill(params: UpdateWaybill) {
  return request<any>(ApiURL + '/waybills/' + params.waybillId, {
    method: 'PATCH',
    data: {
      mawb_no: params?.mawb_no,
      hawb_no: params?.hawb_no,
      jp_delivery_no: params?.jp_delivery_no,
      cn_delivery_no: params?.cn_delivery_no,
      jp_delivery_company: params?.jp_delivery_company,
      cn_delivery_company: params?.cn_delivery_company,
      flight_no: params?.flight_no,
      waybill_input_time: params?.waybill_input_time,
    },
  });
}

// 删除运单 DELETE /api/waybills/:id
interface DeleteByWaybillId {
  waybillId: API.ID;
}
export async function deleteByWaybillId(params: DeleteByWaybillId) {
  return request<any>(ApiURL + '/waybills/' + params.waybillId, {
    method: 'DELETE',
  });
}
