import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有航班 GET /api/flights
interface GetAllFlights {}
export async function getAllFlights(params?: GetAllFlights) {
  return request<any>(ApiURL + '/flights', {
    method: 'GET',
  });
}

// 获取所有航班 GET /api/flights/:id
interface GetFlight {
  flightId: API.ID;
}
export async function getFlight(params: GetFlight) {
  return request<any>(ApiURL + '/flights' + params.flightId, {
    method: 'GET',
  });
}

// 创建航班 POST /api/flights
interface CreateFlight extends API.Flight {}
export async function createFlight(params: CreateFlight) {
  return request<any>(ApiURL + '/flights', {
    method: 'POST',
    data: {
      flight_no: params.flight_no,
      jp_depart_time: params.jp_depart_time,
      arrive_time: params.arrive_time,
      clearance_time: params.clearance_time,
    },
  });
}

// 更新航班 PATCH /api/flights/:id
interface UpdateFlight extends API.Flight {
  flightId: API.ID;
}
export async function updateFlight(params: UpdateFlight) {
  return request<any>(ApiURL + '/flights/' + params.flightId, {
    method: 'PATCH',
    data: {
      flight_no: params?.flight_no,
      jp_depart_time: params?.jp_depart_time,
      arrive_time: params?.arrive_time,
      clearance_time: params?.clearance_time,
    },
  });
}

// 删除航班 DELETE /api/flights/:id
interface DeleteByFlightId {
  flightId: API.ID;
}
export async function deleteByFlightId(params: DeleteByFlightId) {
  return request<any>(ApiURL + '/flights/' + params.flightId, {
    method: 'DELETE',
  });
}
