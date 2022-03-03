import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有运单 GET /api/waybills
interface GetAllWaybills extends API.Waybill {
  page: number;
  perPage: number;
}
export async function getAllWaybills(params?: GetAllWaybills) {
  return request<any>(ApiURL + '/waybills', {
    method: 'GET',
    params,
  });
}

// 计算运单数量 GET /api/waybills/meta
interface CountWaybills extends API.Waybill {
  page: number;
  perPage: number;
}
export async function countWaybills(params?: CountWaybills) {
  return request<any>(ApiURL + '/waybills/meta', {
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
interface ImportMultiWaybill {
  waybills: API.Waybill[];
}
export async function importMultiWaybill(params: ImportMultiWaybill) {
  return request<any>(ApiURL + '/waybills/import-multi', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更新运单 PATCH /api/waybills/:id
interface UpdateWaybill extends API.Waybill {
  waybillId: API.ID;
  // [ , clean , brock , create]
  process_type?: 0 | 1 | 2 | 3;
}
export async function updateWaybill(params: UpdateWaybill) {
  const { waybillId, ...data } = params;
  return request<any>(ApiURL + '/waybills/' + params.waybillId, {
    method: 'PATCH',
    data: {
      ...data,
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

// 批量创建导入 POST /api/waybills/move
interface MoveWaybill {
  move: number;
  type: number;
  waybill?: string;
  MAB: string;
  LS: string;
  current_processor: string;
  waybill_status: number;
}
export async function moveWaybill(params: MoveWaybill) {
  return request<any>(ApiURL + '/waybills/move', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取所有MAB运单 GET /api/waybills/mawbs
interface GetStatusInquiry extends API.Waybill {
  page: number;
  perPage: number;
}
export async function getStatusInquiry(params?: GetStatusInquiry) {
  return request<any>(ApiURL + '/waybills/mawbs', {
    method: 'GET',
    params,
  });
}

// 获取运单的自定义搜索 GET /api/waybills/advance
interface GetAllWaybillsAdvance extends API.Waybill {
  page: number;
  perPage: number;
  cleaners?: string[];
  ctsStartDate?: Date;
  ctsEndDate?: Date;
  blockers?: string[];
  brcStartDate?: Date;
  brcEndDate?: Date;
  creators?: string[];
  crtStartDate?: Date;
  crtEndDate?: Date;
  mawbs?: string;
  hawbs?: string;
  status?: number;
}
export async function getAllWaybillsAdvance(params?: GetAllWaybillsAdvance) {
  return request<any>(ApiURL + '/waybills/advance', {
    method: 'GET',
    params,
  });
}
