import { Modal, Button } from 'antd';
import { useKeyPress, useBoolean } from 'ahooks';
////
import CheckFormBasic from '../Form/CheckFormBasic';

export interface InvoiceGroupModelProps {}

const dataSource = [
  [
    { no: 25, limit: 1, name: 'IKY', holder: '一括申告等識別' },
    { no: 51, limit: 3, name: 'COC', holder: 'コンテナ扱い本数' },
  ],
  [
    { no: 43, limit: 140, name: 'MRK', holder: '記号番号' },
    { no: 44, limit: 9, name: 'VSC', holder: '積載船舶コード' },
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
        title="海上"
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
        海上部
      </Button>
    </>
  );
};

export default InvoiceGroupModel;
