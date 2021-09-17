// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ID = string;
  type ZipCode = {
    _id?: ID;
    state?: String;
    city?: String;
    zipcode?: String;
    address?: String;
  };
  type Driver = {
    _id?: ID;
    name?: string;
    tel?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  type Flight = {
    _id?: ID;
    flight_no?: string;
    jp_depart_time?: number;
    arrive_time?: number;
    clearance_time?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  type Waybill = {
    _id?: ID;
    mawb_no?: string;
    hawb_no?: string;
    jp_delivery_no?: string;
    cn_delivery_no?: string;
    jp_delivery_company?: string;
    cn_delivery_company?: string;
    flight_no?: string;
    waybill_input_time?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
