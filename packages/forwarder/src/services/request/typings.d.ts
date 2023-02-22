// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ID = string;
  type Agent = {
    _id?: ID;
    name?: string;
    account?: string;
    password?: string;
    SHN?: string;
    SHA?: string;
    STL?: string;
    AGT_CD?: string;
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
  type Company = {
    _id?: ID;
    company_name?: string;
    company_name_en?: string;
    company_add?: string;
    company_add_en?: string;
    company_tel?: string;
    url?: string;
    office_name?: string;
    office_name_en?: string;
    office_add?: string;
    office_add_en?: string;
    office_zip?: string;
    office_tel?: string;
    office_fax?: string;
    user_code?: string;
    system_category?: string;
    industry_category?: string;
    broker_code?: string;
    BW_code?: string;
    BW_add?: string;
    BW_add_en?: string;
    BW_tel?: string;
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
  type Issue = {
    // -----------自社填写内容-------------
    waybill: Waybill;
    agent: Agent;
    created_user: ID;
    updated_user: ID;
    createdAt?: string;
    updatedAt?: string;
    // // 通知人
    // receive_user: ID;
    // 問題該当
    issue_category: string;
    // 問題详情
    issue_detail: string;
    // 状态
    status: string;
    // 退货状态
    cargo_status: string;
    // -----------代理店填写内容-------------
    // 科目
    reply_subject: string;
    // 回答日
    reply_date: string;
    // 内容
    reply_content: string;
    // 收件人
    receiver_name: string;
    // 收件人电话
    receiver_tel: string;
    // 收件人邮编
    receiver_zip: string;
    // 收件人地址
    receiver_add: string;
    // 品名
    CMN: string;
    // -----------自社填写内容-------------
    // 发送日
    send_date: string;
    // 新派送单号
    new_tracking_no: string;
    // 对应方式: E-Mail, TEL, FAX
    solve_method: string;
    // 处理日
    solve_date: string;
    price_projects: {
      // 滅却費用、貨物点検
      name: string;
      price: string;
    }[];
    // 備考
    solve_note: string;
  };
  type MICkeys = {
    _id?: ID;
    words?: string;
    price?: string;
    waybill_type: 0 | 1; // ["IDA","MIC"]
    LS?: 'L' | 'S';
    waybill_status: 0 | 1 | 2 | 3; // ["other","normal","hold","sendBack"]
  };
  type Track = {
    waybill?: string;
    agent?: string;
    // お問い合わせ送り状NO: 361190298405(27,39)
    HAB?: string;
    // 出荷日: 20220517(19,27)
    delivery_day?: Date;
    // 個数：F1,H1,L1,M1,N1(77,81)
    no?: string;
    // 集荷営業所：F1(52,58)
    pickup_office?: string;
    // 集荷電話：F1(88,100)
    pickup_tel?: string;
    // 集荷FAX：F1(102,114)
    pickup_fax?: string;
    // 配達営業所：M1(52,58)
    delivery_office?: string;
    // 配達電話：M1(88,100)
    delivery_tel?: string;
    // 配達FAX：M1(102,114)
    delivery_fax?: string;
    // 配達情報(M1): 0300(159, 163)
    delivery_code?: string;
    filename?: string;
    history?: Array<{
      // レコード: M1(0,2)
      record_id?: string;
      // 担当営業所: (52,58)
      office?: string;
      // 集配区分: 4(209)
      category?: string;
      // 集配区分: 日文解释
      category_jp?: string;
      // 集配状態: 0413(210, 214)
      code?: string;
      // 集配状態: 日文解释
      code_jp?: string;
      // 報告時間: 121800(76,82) 報告日: 20220522(214,222)
      datetime?: Date;
    }>;
  };
  type Tracking = {
    waybill?: string;
    // 輸出入区分
    DAT_TPE?: string;
    // MAWBNO
    MAWB_NO?: string;
    // Ｂ／Ｌ番号／ＡＷＢ 番号
    BL_?: string;
    // 識別(MIC/IDA)
    MIC_IDA?: string;
    trackingHistory?: Array<{
      // 作成日時
      INS_DT?: string;
      // トラッキングコード
      TKG_CD?: string;
      // トラッキング発生日時
      TKG_DT?: string;
      RAW_XML?: string;
    }>;
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
    // ---------------------------开发用------------------------------
    // フォワーダー
    agent?: ID;
    // 进出口类型{0: 进口, 1: 出口}
    io_type: number;
    // IDA or MIC
    waybill_type: string;
    // IDA类型
    IDA_type: string;
    // {0: other, 1: normal, 2: hold, 3: sendBack}
    waybill_status: number;
    // {0: wait cleansing, 1: doing cleasing, 2: done cleansing, 3: doing broker check, 4: done broker check, 5: done created}
    process_status: number;
    current_processor: string;
    //  process_histories?: ProcessHistory[];
    cleanser?: ID;
    cleanserName: string;
    clsDate: Date;
    broker?: ID;
    brokerName: string;
    brcDate: Date;
    creator?: ID;
    creatorName: string;
    crtDate: Date;
    // 航班日期flghtDate
    DATE: Date;
    holdMemo: string;
    todo_memo: string;
    sendbackMemo: string;
    holdFeedbackMemo: string;
    sendbackFeedbackMemo: string;
    // 韓進专用字段
    REFNO: string;
    // ---------------------------日本側------------------------------
    // L,S,M
    LS: string;
    ICN: string; //申告番号(MIC)
    ID: string; //申告等番号(IDA)
    JYO: string; //申告条件
    IC1: string; //申告先種別コード
    IC2: string; //申告貨物識別(IDA)
    ICB: string; //申告等種別コード(IDA)
    SKB: string; //識別符号
    CH: string; //あて先官署コード
    CHB: string; //あて先部門コード
    CHH: string; //特例申告あて先官署コード(IDA)
    CHT: string; //特例申告あて先部門コード(IDA)
    ICD: string; //申告予定年月日
    ZJY: string; //税関事務管理人コード
    ZJJ: string; //税関事務管理人受理番号
    ZJN: string; //税関事務管理人名
    ST: string; //通関予定蔵置場コード
    IKY: string; //一括申告等識別(IDA+海のみ)
    ICC: string; //申告等予定者コード(IDA)
    NMC: string; //輸入取引者コード(IDA)
    NMN: string; //輸入取引者名(IDA)
    NOT: string; //個数単位コード(IDA+海のみ)
    MRK: string; //記号番号(IDA+海のみ)
    VSC: string; //積載船舶コード(IDA+海のみ)
    BOK: string; //貿易形態別符号(IDA)
    COC: string; //コンテナ扱い本数(IDA+海のみ)
    RTD: string; //戻税申告識別(IDA)
    WU: string; //輸入貿易管理令第３条等識別(IDA)
    IL: string; //輸入承認証添付識別(IDA)
    N4: string; //内容点検等結果(IDA)
    CI: string; //税関調査用符号(IDA)
    OL_: string; //他法令コード(IDA)
    KNO: string; //共通管理番号(IDA)
    FD: string; //食品衛生証明識別(IDA)
    PL: string; //植物防疫証明識別(IDA)
    AN: string; //動物検疫証明識別(IDA)
    S_: string; //輸入承認証等識別(IDA)
    N_: string; //輸入承認証番号等(IDA)
    IV1: string; //インボイス識別(IDA)
    IV2: string; //電子インボイス受付番号(IDA)
    TTC: string; //検査立会者
    FR1: string; //運賃区分コード
    DPR: number; //課税価格
    NT1: string; //記事
    NT3: string; //記事
    NSC: string; //荷主セクションコード
    NRN: string; //荷主リファレンスナンバー
    REF: string; //社内整理用番号
    // ---------------------------配達関連------------------------------
    track_status: number;
    //  track_history: TrackHistory[];
    jp_delivery_no: string;
    cn_delivery_no: string;
    jp_delivery_company: string;
    cn_delivery_company: string;
    //实际收货人
    receiver_name: string;
    //实际收货人电话
    receiver_tel: string;
    //实际收货人邮编
    receiver_zip: string;
    //实际收货地址
    receiver_add: string;
    driver?: ID;
    //日中用
    flight_no: string;
    waybill_input_time: Date;
    // ***********************************上海側***********************************
    // -----------------------輸入者-----------------------
    // 輸入者コード
    ImpCode: string;
    // 輸入者名
    ImpName: string;
    // 輸入者名日文
    ImpNameJP: string;
    // 郵便番号
    Zip: string;
    // 住所１（都道府県）
    Add1: string;
    // 住所２（市区町村行政区名）
    Add2: string;
    // 住所３（町域名・番地）
    Add3: string;
    // 住所４（ビル名ほか）
    Add4: string;
    // 輸入者電話番号
    Tel: string;
    // 輸入者住所（一括）
    IAD: string;
    // 輸入者住所（一括）日文
    IADJP: string;
    // -----------------------仕出人-----------------------
    // 仕出人コード
    EPC: string;
    // 仕出人名
    EPN: string;
    // 住所１（Street and number/P.O.BOX）
    EPA: string;
    // 住所２（Street and number/P.O.BOX）
    EP2: string;
    // 住所３（City name）
    EP3: string;
    // 住所４（Countrysub-entity,name）
    EP4: string;
    // 郵便番号（Postcode identification）
    EPY_Zip: string;
    // 国名コード（Country,coded）
    EPO: string;
    // 仕出人住所 (一括）
    EAD: string;
    // -----------------------その他-----------------------
    // ＨＡＷＢ番号（MIC用）
    HAB: string;
    // Ｂ／Ｌ番号／ＡＷＢ 番号（IDA用）
    BL_: string;
    // MＡＷＢ番号（MIC用）
    MAB: string;
    // 積載機名
    VSN: string;
    // 入港年月日
    ARR: string;
    // 取卸港コード
    DST: string;
    // 積出地コード
    PSC: string;
    // 積出地名
    PSN: string;
    // インボイス番号(IDA)
    IV3: string;
    // インボイス価格区分コード
    IP1: string;
    // インボイス価格条件コード
    IP2: string;
    // インボイス通貨コード
    IP3: string;
    // インボイス価格
    IP4: string;
    // originalインボイス価格
    _NT1: number;
    // インボイス価格_number
    _IP4: number;
    // 運賃通貨コード
    FR2: string;
    // 運賃
    FR3: string;
    // 運賃_number
    _FR3: number;
    // 保険区分コード
    IN1: string;
    // 保険通貨コード
    IN2: string;
    // 保険金額
    IN3: string;
    // 保険金額_number
    _IN3: number;
    // 品目コード
    CMD: string;
    // NACCS用コード
    CM2: string;
    // 品名
    CMN: string;
    // 貨物個数
    NO: number;
    // PCS
    PCS: number;
    // 貨物重量
    GW: string;
    // 貨物重量_number
    _GW: number;
    // 重量単位コード（グロス）
    GWT: string;
    // 原産地コード
    OR: string;
    createdAt?: string;
    updatedAt?: string;
    EDI_code?: {
      arr_code1: string;
      arr_code2: string;
      zipcode: string;
    };
    HSRepeat?: {
      CMD?: string;
      CM2?: string;
      CMN?: string;
      OR?: string;
      ORS?: string;
      QN1?: string;
      QT1?: string;
      QN2?: string;
      QT2?: string;
      IT?: string;
      RG?: string;
      BPR?: string;
      FRS?: string;
      DPR?: string;
      JKB?: string;
      JKO?: string;
      RE?: string;
      REG?: string;
    }[];
  };
  type ZipCode = {
    _id?: ID;
    state?: String;
    city?: String;
    zipcode?: String;
    address?: String;
  };
  type Result<T = any> = {
    total: number;
    list: T[];
  };
}
