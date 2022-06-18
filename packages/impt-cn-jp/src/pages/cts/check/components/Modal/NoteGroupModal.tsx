import { Modal, Button } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
////
import CheckFormBasic from '../Form/CheckFormBasic';

export interface InvoiceGroupModelProps {}

const dataSource = [
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
];

const InvoiceGroupModel: React.FC<InvoiceGroupModelProps> = (props) => {
  // state
  const [visible, { setFalse, setTrue }] = useBoolean(false);

  // key press
  useKeyPress('ctrl.F9', () => {
    visible && setFalse();
  });

  return (
    <>
      <Modal
        title="記事"
        width={1200}
        visible={visible}
        onCancel={setFalse}
        footer={
          <Button type="primary" onClick={setFalse}>
            確定(ctrl + F9)
          </Button>
        }
      >
        <CheckFormBasic dataSource={dataSource} />
      </Modal>
      <Button type="dashed" onClick={setTrue}>
        記事 (F2, 3)
      </Button>
    </>
  );
};

export default InvoiceGroupModel;
