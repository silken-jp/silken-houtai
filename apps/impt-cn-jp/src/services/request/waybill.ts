import { request } from 'umi';

const { ApiURL2: ApiURL } = process.env;

// 获取所有运单 GET /api/waybills
interface GetAllWaybills extends Partial<API.Waybill> {
  page?: number;
  perPage?: number;
}
export async function getAllWaybills(params?: GetAllWaybills) {
  return request<any>(ApiURL + '/waybills', {
    method: 'GET',
    params,
  });
}

// 获取所有运单许可书 POST /waybills/per_download
interface GetAllPERImagesByWaybillIds extends Partial<API.Waybill> {
  waybillIds: API.ID[];
}
export async function getAllPERImagesByWaybillIds(
  params?: GetAllPERImagesByWaybillIds,
) {
  return request<any>(ApiURL + '/waybills/per_download', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 计算运单数量 GET /api/waybills/meta
interface CountWaybills extends Partial<API.Waybill> {
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
interface CreateWaybill extends Partial<API.Waybill> {}
export async function createWaybill(params: CreateWaybill) {
  return request<any>(ApiURL + '/waybills', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 批量创建导入 POST /api/waybills/import-multi
interface ImportMultiWaybill {
  waybills: API.Waybill[];
  user?: API.ID;
  uploader: API.ID;
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
interface UpdateWaybill extends Partial<API.Waybill> {
  waybillId: API.ID;
  // [ , clean , brock , create]
  user?: string;
  process_type?: 0 | 1 | 2 | 3;
}
export async function updateWaybill(params: UpdateWaybill) {
  const { waybillId, ...data } = params;
  return request<any>(ApiURL + '/waybills/' + params.waybillId, {
    method: 'PATCH',
    data: {
      ...data,
      _GW: +(data?.GW || 0),
      _IP4: +(data?.IP4 || 0),
      _FR3: +(data?.FR3 || 0),
      _IN3: +(data?.IN3 || 0),
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

// 按MAWB删除运单 DELETE /api/waybills/mawb
interface DeleteALLWaybillsByMAWB {
  mawb: string;
}
export async function deleteALLWaybillsByMAWB(params: DeleteALLWaybillsByMAWB) {
  return request<any>(ApiURL + '/waybills/mawb/' + params.mawb, {
    method: 'DELETE',
  });
}

// 批量创建导入 POST /api/waybills/move
interface MoveWaybill {
  move: number;
  current_processor: string;
  check_type: string;
  waybill?: string;
}
export async function moveWaybill(params: MoveWaybill) {
  return request<any>(ApiURL + '/waybills/move', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 批量创建导入 POST /api/waybills/move
interface UpdateMAB {
  oldMab: string;
  MAB: string;
  PSC: string;
  flight_no: string;
  VSN: string;
  ARR: string;
  DATE: string;
}
export async function updateMAB(params: UpdateMAB) {
  return request<any>(ApiURL + '/waybills/update_mab', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取所有MAB运单 GET /api/waybills/mawbs
interface GetStatusInquiry extends Partial<API.Waybill> {
  page: number;
  perPage: number;
}
export async function getStatusInquiry(params?: GetStatusInquiry) {
  return request<any>(ApiURL + '/waybills/mawbs', {
    method: 'GET',
    params,
  });
}

// 获取所有MAB运单 GET /api/waybills/mawbs
interface GetStatusInquiry extends Partial<API.Waybill> {
  page: number;
  perPage: number;
}
export async function getSimpleStatusInquiry(params?: GetStatusInquiry) {
  return request<any>(ApiURL + '/waybills/mawbs-simple', {
    method: 'GET',
    params,
  });
}

// 获取运单的自定义搜索 GET /api/waybills/advance
interface GetAllWaybillsAdvance extends Partial<API.Waybill> {
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

// 获取所有MAB月度统计 GET /api/waybills/month_stat
interface GetMonthStat {
  agentId?: API.ID;
}
export async function getMonthStat(
  params?: GetMonthStat,
): Promise<API.WaybillMonthStat> {
  return request<any>(ApiURL + '/waybills/month_stat', {
    method: 'GET',
    params,
  });
}

// 获取waybills统计 GET /api/waybills/month_stat
interface GetDateStat {
  agentId?: API.ID;
  startDate: Date;
  endDate: Date;
  displayType: string;
  waybill_type?: string;
}
export async function getDateStat(
  params?: GetDateStat,
): Promise<API.WaybillDateStat> {
  return request<any>(ApiURL + '/waybills/date_stat', {
    method: 'GET',
    params,
  });
}

// 获取waybills统计 GET /api/waybills/creating
interface Creating extends Partial<API.Waybill> {
  filter: any;
  creatorId: API.ID;
}
export async function creating(params?: Creating): Promise<any> {
  return request<any>(ApiURL + '/waybills/creating', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取机场分类count GET /api/dst_by_date
interface GetDstByDate {
  agentId?: API.ID;
  startDate?: string;
  endDate?: string;
}
export async function getDstByDate(params?: GetDstByDate) {
  return request<any>(ApiURL + '/waybills/dst_by_date', {
    method: 'GET',
    params,
  });
}

// 获取机场分类count GET /api/dst_by_date
interface GetWeekByDate {
  agentId?: API.ID;
  startDate?: Date;
  endDate?: Date;
}
export async function getWeekByDate(params?: GetWeekByDate) {
  return request<any>(ApiURL + '/waybills/dst_week_by_date', {
    method: 'GET',
    params,
  });
}

// 获取机场分类count GET /api/dst_by_date
interface GetDstByDate {}
export async function getAgentStat(params?: GetDstByDate) {
  return request<any>(ApiURL + '/waybills/forwarder_by_date', {
    method: 'GET',
    params,
  });
}

// 获取所有绑定track等完整数据的运单 GET /api/waybills
interface GetAllWaybillsForwarder extends API.Waybill {
  agent: string;
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: number;
}
export async function getAllWaybillsForwarder(
  params?: GetAllWaybillsForwarder,
) {
  return request<any>(ApiURL + '/waybills/forwarder', {
    method: 'GET',
    params,
  });
}
