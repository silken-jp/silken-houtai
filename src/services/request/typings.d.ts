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
  type Driver = {};
  type Flight = {
    _id?: ID;
    flight_no: string;
    jp_depart_time: number;
    arrive_time: number;
    clearance_time: number;
  };
  type Waybills = {};
}
