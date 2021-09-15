import React from 'react';
import { Form, Input, Space } from 'antd';

const MICForm: React.FC = (props) => {
  const manifestItems = [
    [
      { no: 32, limit: 20, name: 'HAB', holder: 'ＨＡＷＢ番号' },
      // { no: 33, limit: 20, name: 'MAB', holder: 'ＭＡＷＢ番号' },
      // { no: 5, limit: 1, name: 'SKB', holder: '識別符号' }, formtype to
      { no: 34, limit: 6, name: 'NO', holder: '貨物個数' },
      { no: 35, limit: 8, name: 'GW', holder: '貨物重量' },
      { no: 39, limit: 5, name: 'PSC', holder: '積出地コード' },
      { no: 38, limit: 3, name: 'DST', holder: '取卸港コード' },
      // { no: 36, limit: 12, name: 'VSN', holder: '積載機名' },
      // { no: 37, limit: 8, name: 'ARR', holder: '入港年月日' },
    ],
    [],
    [
      // { no: 2, limit: 11, name: 'ICN', holder: '申告番号' },
      // { no: 3, limit: 1, name: 'JYO', holder: '申告条件' },
      // { no: 4, limit: 1, name: 'IC1', holder: '申告先種別コード' },
      { no: 9, limit: 17, name: 'ImpCode', holder: '輸入者コード' },
      { no: 10, limit: 70, name: 'ImpName', holder: '輸入者名' },
      { no: 16, limit: 11, name: 'Tel', holder: '輸入者電話番号' },
    ],
    [
      { no: 11, limit: 7, name: 'Zip', holder: '郵便番号' },
      { no: 12, limit: 15, name: 'Add1', holder: '住所１（都道府県）' },
      {
        no: 13,
        limit: 35,
        name: 'Add2',
        holder: '住所２（市区町村（行政区名））',
      },
      { no: 14, limit: 35, name: 'Add3', holder: '住所３（町域名・番地）' },
      { no: 15, limit: 70, name: 'Add4', holder: '住所４（ビル名ほか）' },
    ],
    [{ no: 17, limit: 105, name: 'IAD', holder: '輸入者住所' }],
    [],
    [
      // { no: 21, limit: 5, name: 'ST', holder: '通関予定蔵置場コード' },
      // { no: 22, limit: 5, name: 'TTC', holder: '検査立会者' },
      { no: 23, limit: 12, name: 'EPC', holder: '仕出人コード' },
      { no: 24, limit: 70, name: 'EPN', holder: '仕出人名' },
    ],
    [
      {
        no: 29,
        limit: 9,
        name: 'EPY_Zip',
        holder: '郵便番号（Postcode identification）',
      },
      {
        no: 25,
        limit: 35,
        name: 'EPA',
        holder: '住所１（Street and number/P.O.BOX）',
      },
      {
        no: 26,
        limit: 35,
        name: 'EP2',
        holder: '住所２（Street and number/P.O.BOX）',
      },
      { no: 27, limit: 35, name: 'EP3', holder: '住所３（City name）' },
      {
        no: 28,
        limit: 35,
        name: 'EP4',
        holder: '住所４（Country sub-entity,name）',
      },
      { no: 30, limit: 2, name: 'EPO', holder: '国名コード（Country,coded）' },
    ],
    [{ no: 31, limit: 105, name: 'EAD', holder: '仕出人住所' }],
    [],
    [
      { no: 50, limit: 40, name: 'CMN', holder: '品名' },
      { no: 51, limit: 2, name: 'OR', holder: '原産地コード' },
    ],
    [
      { no: 40, limit: 1, name: 'IP1', holder: 'インボイス価格区分コード' },
      { no: 41, limit: 3, name: 'IP2', holder: 'インボイス価格条件コード' },
      { no: 42, limit: 3, name: 'IP3', holder: 'インボイス通貨コード' },
      { no: 43, limit: 13, name: 'IP4', holder: 'インボイス価格' },
    ],
    [
      { no: 44, limit: 1, name: 'FR1', holder: '運賃区分コード' },
      { no: 45, limit: 3, name: 'FR2', holder: '運賃通貨コード' },
      { no: 46, limit: 11, name: 'FR3', holder: '運賃' },
      { no: 47, limit: 1, name: 'IN1', holder: '保険区分コード' },
      { no: 48, limit: 3, name: 'IN2', holder: '保険通貨コード' },
      { no: 49, limit: 9, name: 'IN3', holder: '保険金額' },
    ],
    [{ no: 52, limit: 6, name: 'DPR', holder: '課税価格' }],
    [],
    [
      { no: 53, limit: 35, name: 'NT1', holder: '記事' },
      { no: 54, limit: 20, name: 'NSC', holder: '荷主セクションコード' },
      { no: 55, limit: 35, name: 'NRN', holder: '荷主リファレンスナンバー' },
      { no: 56, limit: 20, name: 'REF', holder: '社内整理用番号' },
    ],
    [
      { no: 18, limit: 17, name: 'ZJY', holder: '税関事務管理人コード' },
      { no: 19, limit: 10, name: 'ZJJ', holder: '税関事務管理人受理 番号' },
      { no: 20, limit: 70, name: 'ZJN', holder: '税関事務管理人名' },
    ],
  ];

  return (
    <Space direction="vertical">
      {manifestItems?.map((row, key) => (
        <Space key={key} align="start" wrap>
          {row?.length === 0 && <hr color="#eee" />}
          {row?.map((item) => (
            <Form.Item
              key={item?.no}
              style={{ marginBottom: 0 }}
              label={`${item?.no}.${item?.name}`}
              name={item?.name}
            >
              {item?.limit > 106 ? (
                <Input.TextArea
                  placeholder={item?.holder}
                  style={{
                    width: item?.limit * 5 + 50,
                    fontFamily: 'monospace',
                  }}
                  autoSize={{ minRows: 2, maxRows: 2 }}
                />
              ) : (
                <Input
                  style={{
                    width: item?.limit * 10 + 50,
                    fontFamily: 'monospace',
                  }}
                  placeholder={item?.holder}
                />
              )}
            </Form.Item>
          ))}
        </Space>
      ))}
    </Space>
  );
};

export default MICForm;
