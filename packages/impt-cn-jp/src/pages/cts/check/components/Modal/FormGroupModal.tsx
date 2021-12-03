import { useState } from 'react';
import { Modal } from 'antd';
import { useKeyPress } from 'ahooks';

import CheckFormBasic from '../Form/CheckFormBasic';

export interface FormGroupModelProps {}

const FormGroupModel: React.FC<FormGroupModelProps> = () => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<any[][]>([[]]);

  useKeyPress(['ctrl.alt.1'], () => {
    // Todo: 按键展示（1） 海上组
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
    setVisible(true);
  });

  useKeyPress(['ctrl.alt.2'], () => {
    // Todo: 按键展示（2） 卫生组
    setDataSource([
      [
        { no: 52, limit: 1, name: 'RTD', holder: '戻税申告識別' },
        { no: 53, limit: 1, name: 'WU', holder: '輸入貿易管理令第３条等識別' },
        { no: 54, limit: 1, name: 'IL', holder: '輸入承認証添付識別' },
      ],
      [
        { no: 57, limit: 2, name: 'OL_', holder: '他法令コード' },
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
    setVisible(true);
  });

  useKeyPress(['ctrl.alt.3'], () => {
    // Todo: 按键展示（3） 备注组
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
    setVisible(true);
  });

  return (
    <Modal title="Group" width={1050} visible={visible} onCancel={() => setVisible(false)}>
      <CheckFormBasic dataSource={dataSource} />
    </Modal>
  );
};

export default FormGroupModel;
