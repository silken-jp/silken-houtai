import { request } from 'umi';

const { ApiURL } = process.env;

// 获取所有司机 GET /api/drivers
interface GetDeliveries {
  truckId: String;
  createdBefore: any;
  createdAfter: any;
}
export async function getDeliveries(params?: GetDeliveries) {
  return request<any>(ApiURL + '/deliveries', {
    method: 'GET',
  });
}

interface GetDeliveryById {
  deliveryId: String;
}
export const getDeliveryById = async (params: GetDeliveryById) => {
  return request<any>(ApiURL + '/deliveries/' + params?.deliveryId, {
    method: 'GET',
  });
};

// interface CreateDelivery {
//   status: '1';
//   datetime: any;
//   jp_delivery_no: String;
//   truckId: String;
// }
// export const createDelivery = async (params: CreateDelivery) => {
//   try {
//     const data = await Api.post(`/deliveries`, params);
//     return { data };
//   } catch (error) {
//     return { error };
//   }
// };

// interface UpdateDelivery {
//   deliveryId: String;
//   status: '2' | '3';
//   datetime: any;
// }
// export const updateDelivery = async (params: UpdateDelivery) => {
//   try {
//     const data = await Api.patch(`/deliveries/${params?.deliveryId}`, params);
//     return { data };
//   } catch (error) {
//     return { error };
//   }
// };
