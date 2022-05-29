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
