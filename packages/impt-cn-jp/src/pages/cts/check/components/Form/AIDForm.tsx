import CheckFormBasic from './CheckFormBasic';
import FormGroupModel from '../Modal/FormGroupModal';

export interface AIDFormProps {
  disabled: boolean;
}

const AIDForm: React.FC<AIDFormProps> = (props) => {
  const AIDItems = [
    [
      { no: 7, limit: 1, name: 'SKB', holder: '識別符号' },
      // Todo: to IDA create
      // { no: 10, limit: 2, name: 'CHH', holder: '特例申告あて先官署 コード ' },
      // { no: 11, limit: 2, name: 'CHT', holder: '特例申告あて先部門 コード' },
      // Todo: to create
      //   { no: 26, limit: 5, name: 'ICC', holder: '申告等予定者コード' },
      { no: 38, limit: 20, name: 'BL_', holder: 'Ｂ／Ｌ番号／ＡＷＢ 番号' }, // 海上の時　X５
      { no: 39, limit: 8, name: 'NO', holder: '貨物個数', ruleType: 'number' },
      { no: 40, limit: 3, name: 'NOT', holder: '個数単位コード' },
      {
        no: 41,
        limit: 10,
        name: 'GW',
        holder: '貨物重量（グロス）',
        ruleType: 'number',
      },
      { no: 42, limit: 3, name: 'GWT', holder: '重量単位コード（グ ロス）' },
    ],
    [],
    [
      { no: 13, limit: 17, name: 'ImpCode', holder: '輸入者コード' },
      { no: 15, limit: 7, name: 'Zip', holder: '郵便番号' },
      { no: 20, limit: 11, name: 'Tel', holder: '輸入者電話番号' },
    ],
    // [
    //   {
    //     type: 'text',
    //     no: 10,
    //     limit: 70,
    //     name: 'ImpNameJP',
    //     holder: '輸入者名',
    //   },
    // ],
    [{ no: 10, limit: 70, name: 'ImpName', holder: '輸入者名' }],
    [{ type: 'text', no: 17, limit: 105, name: 'IADJP', holder: '輸入者住所' }],
    [
      { no: 16, limit: 15, name: 'Add1', holder: '住所１（都道府県）' },
      {
        no: 17,
        limit: 35,
        name: 'Add2',
        holder: '住所２（市区町村 （行政区名））',
      },
      { no: 18, limit: 35, name: 'Add3', holder: '住所３（町域名・番 地）' },
      { no: 19, limit: 70, name: 'Add4', holder: '住所４（ビル名ほ か）' },
    ],
    [],

    [
      { no: 27, limit: 17, name: 'NMC', holder: '輸入取引者コード' },
      { no: 28, limit: 70, name: 'NMN', holder: '輸入取引者名' },
    ],
    [
      { no: 29, limit: 12, name: 'EPC', holder: '仕出人コード' },
      { no: 30, limit: 70, name: 'EPN', holder: '仕出人名' },
    ],
    [{ type: 'text', no: 31, limit: 105, name: 'EAD', holder: '仕出人住所' }],
    [
      {
        no: 31,
        limit: 35,
        name: 'EPA',
        holder: '住所１（Street and number/P.O.BOX）',
      },
      {
        no: 32,
        limit: 35,
        name: 'EP2',
        holder: '住所２（Street and number/P.O.BOX） ',
      },
      { no: 33, limit: 35, name: 'EP3', holder: '住所３（City name）' },
      {
        no: 34,
        limit: 35,
        name: 'EP4',
        holder: '住所４（Country sub-entity,name）',
      },
      {
        no: 35,
        limit: 9,
        name: 'EPY(Zip)',
        holder: '郵便番号（Postcode identification）',
      },
      { no: 36, limit: 2, name: 'EPO', holder: '国名コード （Country,coded）' },
      { no: 37, limit: 5, name: 'TTC', holder: '検査立会者' },
    ],
    // Todo: 按键展示（1） 海上组
    // [],
    // [
    //   { no: 44, limit: 9, name: 'VSC', holder: '積載船舶コード' },
    //   { no: 51, limit: 3, name: 'COC', holder: 'コンテナ扱い本数' },
    //   { no: 43, limit: 140, name: 'MRK', holder: '記号番号' },
    //   { no: 25, limit: 1, name: 'IKY', holder: '一括申告等識別' },
    // ],
    [],
    [
      { no: 45, limit: 35, name: 'VSN', holder: '積載船（機）名' },
      { no: 46, limit: 8, name: 'ARR', holder: '入港年月日' },
      { no: 47, limit: 3, name: 'DST', holder: '船（取）卸港コード' },
    ],
    [
      { no: 48, limit: 5, name: 'PSC', holder: '積出地コード' },
      { no: 49, limit: 20, name: 'PSN', holder: '積出地名' },
    ],
    [
      { no: 50, limit: 3, name: 'BOK', holder: '貿易形態別符号' }, // Todo: default:118
      { no: 55, limit: 1, name: 'N4', holder: '内容点検等結果' },
    ],
    // Todo: 按键展示（2） 卫生组
    // [
    //   { no: 52, limit: 1, name: 'RTD', holder: '戻税申告識別' },
    //   { no: 53, limit: 1, name: 'WU', holder: '輸入貿易管理令第３条等識別' },
    //   { no: 54, limit: 1, name: 'IL', holder: '輸入承認証添付識別' },
    //   { no: 57, limit: 2, name: 'OL_', holder: '他法令コード' },
    //   { no: 58, limit: 10, name: 'KNO', holder: '共通管理番号' },
    //   { no: 59, limit: 1, name: 'FD', holder: '食品衛生証明識別' },
    //   { no: 60, limit: 1, name: 'PL', holder: '植物防疫証明識別' },
    //   { no: 61, limit: 1, name: 'AN', holder: '動物検疫証明識別' },
    // ],
    //   10组
    // [
    //   { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
    //   { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
    // ],
    // [
    //   { no: 65, limit: 10, name: 'IV2', holder: '電子インボイス受付番号' },
    //   { no: 66, limit: 35, name: 'IV3', holder: 'インボイス番号' },
    // ],
    [
      { no: 64, limit: 1, name: 'IV1', holder: 'インボイス識別' },
      { no: 67, limit: 1, name: 'IP1', holder: 'インボイス価格区分コード' },
      { no: 68, limit: 3, name: 'IP2', holder: 'インボイス価格条件コード' },
      { no: 69, limit: 3, name: 'IP3', holder: 'インボイス通貨コード ' },
      {
        no: 70,
        limit: 18,
        name: 'IP4',
        holder: 'インボイス価格',
        ruleType: 'number',
      },
      { no: 94, limit: 70, name: 'NT2', holder: '記事（通関業者用）' },
    ],
    [
      { no: 71, limit: 1, name: 'FR1', holder: '運賃区分コード' },
      { no: 72, limit: 3, name: 'FR2', holder: '運賃通貨コード' },
      { no: 73, limit: 16, name: 'FR3', holder: '運賃', ruleType: 'number' },
      { no: 74, limit: 1, name: 'IN1', holder: '保険区分コード' },
      { no: 75, limit: 3, name: 'IN2', holder: '保険通貨コード' },
      {
        no: 76,
        limit: 14,
        name: 'IN3',
        holder: '保険金額',
        ruleType: 'number',
      },
      { no: 77, limit: 8, name: 'IN4', holder: '包括保険番号' },
    ],
    [
      { no: 78, limit: 1, name: 'VD1', holder: '評価区分コード' },
      { no: 79, limit: 12, name: 'VN_', holder: '包括評価申告受理番号' },
      { no: 80, limit: 3, name: 'VL1', holder: '評価補正区分コード' },
      { no: 81, limit: 3, name: 'VL2', holder: '評価補正基礎額通貨コード ' },
      { no: 82, limit: 18, name: 'VL3', holder: '評価補正基礎額' },
      { no: 83, limit: 11, name: 'VL4', holder: '評価補正補正式' },
      { no: 84, limit: 7, name: 'JKH_', holder: '事前教示（評価） ' },
    ],
    [{ no: 85, limit: 18, name: 'TP', holder: '課税価格按分係数合計' }],
    [
      { no: 86, limit: 8, name: 'ISD', holder: '最初蔵入等承認年月日' },
      { no: 87, limit: 5, name: 'SMC', holder: '蔵入等先保税地域コード' },
      { no: 88, limit: 1, name: 'EN', holder: '納期限延長コード' },
      { no: 89, limit: 2, name: 'BP', holder: 'ＢＰ申請事由コード' },
      { no: 90, limit: 1, name: 'NOF', holder: '納付方法識別' },
      { no: 91, limit: 14, name: 'PF', holder: '口座番号' },
      { no: 92, limit: 9, name: 'SC_', holder: '担保登録番号' },
    ],
    // Todo: 按键展示（3） 备注组
    // [{ no: 93, limit: 140, name: 'NT1', holder: '記事（税関用）' }],
    // [{ no: 94, limit: 70, name: 'NT2', holder: '記事（通関業者用）' }],
    // [{ no: 95, limit: 70, name: 'NT3', holder: '記事（荷主用）' }],
    // [],
    // [
    //   { no: 21, limit: 17, name: 'ZJY', holder: '税関事務管理人コー ド' },
    //   { no: 22, limit: 10, name: 'ZJJ', holder: '税関事務管理人受理 番号' },
    //   { no: 23, limit: 70, name: 'ZJN', holder: '税関事務管理人名' },
    //   { no: 56, limit: 5, name: 'CI', holder: '税関調査用符号' },
    // ],
    // [],
    // [
    //   { no: 96, limit: 20, name: 'NSC', holder: '荷主セクションコード ' },
    //   { no: 97, limit: 35, name: 'NRN', holder: '荷主リファレンスナンバー ' },
    //   { no: 98, limit: 20, name: 'REF', holder: '社内整理用番号' },
    // ],
    // Todo: popup 重复组 max（99）
    // [],
    // [
    //   { no: 99, limit: 9, name: 'CMD', holder: '品目コード' },
    //   { no: 100, limit: 1, name: 'CM2', holder: 'ＮＡＣＣＳ用コード' },
    //   { no: 101, limit: 40, name: 'CMN', holder: '品名' },
    //   { no: 102, limit: 2, name: 'OR', holder: '原産地コード' },
    //   { no: 103, limit: 4, name: 'ORS', holder: '原産地証明書識別' },
    // ],
    // [
    //   { no: 104, limit: 12, name: 'QN1', holder: '数量（１）' },
    //   { no: 105, limit: 4, name: 'QT1', holder: '数量単位コード （１）' },
    //   { no: 106, limit: 12, name: 'QN2', holder: '数量（２）' },
    //   { no: 107, limit: 4, name: 'QT2', holder: '数量単位コード （２）' },
    // ],
    // [
    //   { no: 108, limit: 4, name: 'IT', holder: '輸入貿易管理令別表 コード ' },
    //   { no: 109, limit: 1, name: 'RG', holder: '蔵置種別等コード' },
    //   { no: 110, limit: 18, name: 'BPR', holder: '課税価格按分係数' },
    //   { no: 111, limit: 1, name: 'FRS', holder: '運賃按分識別' },
    //   { no: 112, limit: 3, name: 'FOB', holder: 'ＦＯＢ通貨コード' },
    //   { no: 113, limit: 18, name: 'DPR', holder: '課税価格' },
    // ],
    // [
    //   { no: 114, limit: 9, name: 'JKB', holder: '事前教示（分類）' },
    //   { no: 115, limit: 7, name: 'JKO', holder: '事前教示（原産地）' },
    // ],
    // [
    //   { no: 116, limit: 5, name: 'RE', holder: '関税減免税コード' },
    //   { no: 117, limit: 11, name: 'REG', holder: '関税減税額' },
    // ],
    // [
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    // ],
    // [
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    // ],
    // [
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    //   { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    //   { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    //   { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
    // ],
  ];

  return (
    <>
      <CheckFormBasic dataSource={AIDItems} disabled={props?.disabled} />
      <FormGroupModel disabled={props?.disabled} />
    </>
  );
};

export default AIDForm;
