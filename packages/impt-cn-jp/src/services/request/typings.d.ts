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
  type Agent = {
    _id?: ID;
    name?: string;
    account?: string;
    password?: string;
  };
  type User = {
    _id?: ID;
    name?: string;
    initialName?: string;
    tel?: string;
    email?: string;
    password?: string;
    is_cleanser?: boolean;
    is_broker?: boolean;
    is_creator?: boolean;
  };
  type Currency = {
    _id?: ID;
    country_name?: string;
    currency_name?: string;
    ISO?: string;
    per_jpy?: string;
    hundred_jpy?: string;
    updatedAt?: string;
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
  type WaybillMonthStat = {
    mawbThisMonthCount: number;
    mawbLastMonthCount: number;
    mawbTodayCount: number;
    waybillThisMonthCount: number;
    waybillLastMonthCount: number;
    waybillTodayCount: number;
    NOThisMonthCount: number;
    NOLastMonthCount: number;
    NOTodayCount: number;
    GWThisMonthCount: number;
    GWLastMonthCount: number;
    GWTodayCount: number;
  };
  type WaybillDateStat = Array<{
    sum: number;
    s0: number;
    s1: number;
    s2: number;
    s3: number;
    name: string;
  }>;
  type Waybill = {
    _id?: ID;
    mawb_no?: string;
    hawb_no?: string;
    jp_delivery_no?: string;
    cn_delivery_no?: string;
    jp_delivery_company?: string;
    cn_delivery_company?: string;
    flight_no?: string;
    receiver_name?: string;
    receiver_add?: string;
    receiver_tel?: string;
    receiver_zip?: string;
    track_history?: any[];
    createdAt?: string;
    updatedAt?: string;
    current_processor?: string;
    io_type: 0 | 1; // 进出口类型{0: 进口, 1: 出口}
    waybill_type: 0 | 1; // IDA or MIC{0: IDA, 1: MIC}
    IDA_type: string; // IDA类型
    process_status: number; // {0: wait cleansing, 1: doing cleasing, 2: done cleansing, 3: doing broker check, 4: done broker check, 5: done created}
    waybill_input_time?: string;
    waybill_status: number; // {0: other, 1: normal, 2: hold, 3: sendBack}

    flightNo?: string;
    LS?: 'L' | 'S' | 'M';
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
    ImpCode?: string;
    ImpName?: string;
    Tel?: string;
    Zip?: string;
    IAD?: string;
    Add1?: string;
    Add2?: string;
    Add3?: string;
    Add4?: string;
  };
  type MICkeys = {
    _id?: ID;
    words?: string;
    price?: string;
    waybill_type: 0 | 1; // ["IDA","MIC"]
    LS?: 'L' | 'S';
    waybill_status: 0 | 1 | 2 | 3; // ["other","normal","hold","sendBack"]
  };
  type Result<T = any> = {
    total: number;
    list: T[];
  };
}
