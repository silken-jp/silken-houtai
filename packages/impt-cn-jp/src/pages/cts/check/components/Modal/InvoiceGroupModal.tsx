import { Modal, Button, Space } from 'antd';
import { useKeyPress, useDynamicList, useBoolean } from 'ahooks';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
////
import CheckFormBasic from '../Form/CheckFormBasic';

export interface InvoiceGroupModelProps {}

const dataSource = [
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
];

const dataSource2 = [
  [
    { no: 62, limit: 4, name: 'S_', holder: '輸入承認証等識別' },
    { no: 63, limit: 20, name: 'N_', holder: '輸入承認証番号等' },
  ],
];

const DeepList: React.FC<{ cardKey: number }> = (props) => {
  const deepList = useDynamicList<any>([0, 1]);
  const DeepListItem = (index: number, item: any) => (
    <Space key={deepList.getKey(index)}>
      <div>{index + 1}</div>
      <CheckFormBasic dataSource={dataSource2} basicName={['invoice']} />
      {deepList.list.length > 1 && (
        <Button
          type="text"
          onClick={() => {
            deepList.remove(index);
          }}
        >
          <MinusCircleOutlined />
        </Button>
      )}
      {deepList.list.length < 6 && (
        <Button
          type="text"
          onClick={() => {
            deepList.insert(index + 1, '');
          }}
        >
          <PlusCircleOutlined />
        </Button>
      )}
    </Space>
  );

  return (
    <Space direction="vertical">
      {deepList.list.map((ele, i) => DeepListItem(i, ele))}
    </Space>
  );
};

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
        title="インボイス＆他法令"
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
        <br />
        <DeepList cardKey={0} />
      </Modal>
      <Button type="dashed" onClick={setTrue}>
        インボイス＆他法令 (F2, 2)
      </Button>
    </>
  );
};

export default InvoiceGroupModel;
