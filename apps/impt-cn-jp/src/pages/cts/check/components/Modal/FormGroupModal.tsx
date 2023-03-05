import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useKeyPress } from 'ahooks';
////
import CheckFormBasic from '../Form/CheckFormBasic';

export interface FormGroupModelProps {
  disabled: boolean;
}

const FormGroupModel: React.FC<FormGroupModelProps> = (props) => {
  const [dataSource, setDataSource] = useState<any[][]>([[]]);
  const [state, setState] = useState({
    title: 'Group',
    width: 1800,
    visible: false,
  });

  useEffect(() => {
    let channel = new window.BroadcastChannel('sk_focus');
    channel.onmessage = (e) => {
      if (e.data?.modal === '1') set1();
      if (e.data?.modal === '2') set2();
      if (e.data?.modal === '3') set3();
      if (e.data?.modal === '4') set4();
    };
    channel.onmessageerror = (ev) => {
      throw new Error(
        'BroadcastChannel Error while deserializing: ' + ev.origin,
      );
    };
    return () => channel?.close();
  }, []);
  // Todo: 按键展示（1） HS品目コード组
  function set1() {
    setDataSource([
      [
        { no: 99, limit: 9, name: 'CMD', holder: '品目コード' },
        { no: 100, limit: 1, name: 'CM2', holder: 'NACCS用コード' },
        { no: 101, limit: 40, name: 'CMN', holder: '品名' },
        { no: 102, limit: 2, name: 'OR', holder: '原産地コード' },
        { no: 103, limit: 4, name: 'ORS', holder: '原産地証明書識別' },
      ],
      [
        { no: 104, limit: 12, name: 'QN1', holder: '数量（１）' },
        { no: 105, limit: 4, name: 'QT1', holder: '数量単位コード （１）' },
        { no: 106, limit: 12, name: 'QN2', holder: '数量（２）' },
        { no: 107, limit: 4, name: 'QT2', holder: '数量単位コード （２）' },
        { no: 108, limit: 4, name: 'IT', holder: '輸入貿易管理令別表 コード ' },
        { no: 109, limit: 1, name: 'RG', holder: '蔵置種別等コード' }, // 海上only
      ],
      [
        { no: 110, limit: 18, name: 'BPR', holder: '課税価格按分係数' },
        { no: 111, limit: 1, name: 'FRS', holder: '運賃按分識別' },
        // { no: 112, limit: 3, name: 'FOB', holder: 'ＦＯＢ通貨コード' },
        { no: 113, limit: 18, name: 'DPR', holder: '課税価格' },
      ],
      [
        { no: 114, limit: 9, name: 'JKB', holder: '事前教示（分類）' },
        { no: 115, limit: 7, name: 'JKO', holder: '事前教示（原産地）' },
      ],
      [
        { no: 116, limit: 5, name: 'RE', holder: '関税減免税コード' },
        { no: 117, limit: 11, name: 'REG', holder: '関税減税額' },
      ],
      [
        { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
        { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
        { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
      ],
      [
        { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
        { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
        { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
      ],
    ]);
    setState({
      title: 'HSコード繰返部',
      width: 1300,
      visible: true,
    });
  }
  // Todo: 按键展示（2） インボイス组
  function set2() {
    setDataSource([
      [
        { no: 52, limit: 1, name: 'RTD', holder: '戻税申告識別' },
        { no: 53, limit: 1, name: 'WU', holder: '輸入貿易管理令第３条等識別' },
        { no: 54, limit: 1, name: 'IL', holder: '輸入承認証添付識別' },
      ],
      [
        { no: 57, limit: 2, name: 'OL_', holder: '他法令コード' }, // x5
        { no: 58, limit: 10, name: 'KNO', holder: '共通管理番号' },
      ],
      [
        { no: 59, limit: 1, name: 'FD', holder: '食品衛生証明識別' },
        { no: 60, limit: 1, name: 'PL', holder: '植物防疫証明識別' },
        { no: 61, limit: 1, name: 'AN', holder: '動物検疫証明識別' },
        { no: 65, limit: 10, name: 'IV2', holder: '電子インボイス受付番号' },
      ],
      [{ no: 66, limit: 35, name: 'IV3', holder: 'インボイス番号' }],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
      [
        { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
        { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
      ],
    ]);
    setState({
      title: 'インボイス＆他法令',
      width: 600,
      visible: true,
    });
  }
  // Todo: 按键展示（3） Note组
  function set3() {
    setDataSource([
      [
        { no: 93, limit: 140, name: 'NT1', holder: '記事（税関用）' },
        { no: 56, limit: 5, name: 'CI', holder: '税関調査用符号' },
      ],
      [{ no: 94, limit: 70, name: 'NT2', holder: '記事（通関業者用）' }],
      [{ no: 95, limit: 70, name: 'NT3', holder: '記事（荷主用）' }],
      [],
      [
        { no: 96, limit: 20, name: 'NSC', holder: '荷主セクションコード ' },
        { no: 97, limit: 35, name: 'NRN', holder: '荷主リファレンスナンバー ' },
        { no: 98, limit: 20, name: 'REF', holder: '社内整理用番号' },
      ],
      [],
      [
        { no: 21, limit: 17, name: 'ZJY', holder: '税関事務管理人コー ド' },
        { no: 22, limit: 10, name: 'ZJJ', holder: '税関事務管理人受理 番号' },
        { no: 23, limit: 70, name: 'ZJN', holder: '税関事務管理人名' },
      ],
    ]);
    setState({
      title: 'Note',
      width: 1200,
      visible: true,
    });
  }
  // Todo: 按键展示（4） 海上组
  function set4() {
    setDataSource([
      [
        { no: 25, limit: 1, name: 'IKY', holder: '一括申告等識別' },
        { no: 51, limit: 3, name: 'COC', holder: 'コンテナ扱い本数' },
      ],
      [
        { no: 43, limit: 140, name: 'MRK', holder: '記号番号' },
        { no: 44, limit: 9, name: 'VSC', holder: '積載船舶コード' },
      ],
    ]);
    setState({
      title: '海上',
      width: 1200,
      visible: true,
    });
  }

  function handleCancel() {
    setState({ ...state, visible: false });
  }

  useKeyPress('ctrl.F9', () => {
    state.visible && handleCancel();
  });

  return (
    <Modal
      {...state}
      onCancel={handleCancel}
      footer={
        <Button type="primary" onClick={handleCancel}>
          確定(Ctrl + F9)
        </Button>
      }
    >
      <CheckFormBasic dataSource={dataSource} disabled={props?.disabled} />
    </Modal>
  );
};

export default FormGroupModel;
