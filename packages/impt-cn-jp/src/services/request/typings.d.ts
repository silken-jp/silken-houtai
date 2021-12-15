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

    VSN?: string;
    ARR?: string;
    MAB?: string;
    HAB?: string;
    PCS?: string;
    GW?: string;
    GWT?: string;
    CMN?: string;
    ImpName?: string;
    IAD?: string;
    Add1?: string;
    Add2?: string;
    Add3?: string;
    Add4?: string;
    Tel?: string;
    EPN?: string;
    EAD?: string;
    EPA?: string;
    EP2?: string;
    EP3?: string;
    EP4?: string;
    EPO?: string;
    DST?: string;
    PSC?: string;
    OR?: string;
    IP1?: string;
    IP2?: string;
    IP3?: string;
    IP4?: string;
    FR2?: string;
    FR3?: string;
    IN1?: string;
    IN2?: string;
    IN3?: string;
    Zip?: string;
    receiver_name?: string;
    receiver_add?: string;
    receiver_tel?: string;
    receiver_zip?: string;
    track_history?: any[];
    io_type: 0 | 1;
    waybill_type: 0 | 1;
    LS?: 'L' | 'S';
  };
  type Importer = {
    _id?: ID;
    code?: string;
    company_name_en?: string;
    company_name_jp?: string;
    address_en?: string;
    address_jp?: string;
    zip?: string;
    phone?: string;
    imp_code?: string;
    add1?: string;
    add2?: string;
    add3?: string;
    add4?: string;
  };
  type MICkeys = {
    _id?: ID;
    words?: string;
    price?: string;
    waybill_type: 0 | 1; // ["IDA","MIC"]
    LS?: 'L' | 'S';
    waybill_status: 0 | 1 | 2 | 3; // ["other","normal","hold","sendBack"]
  };
}
