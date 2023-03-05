import { Modal, Button, Card, Space, Form } from 'antd';
import { useKeyPress, useDynamicList, useBoolean } from 'ahooks';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
////
import CheckFormBasic from '../Form/CheckFormBasic';

export interface HSCodeGroupModelProps {}

const dataSource = [
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
];

const dataSource2 = [
  [
    { no: 118, limit: 10, name: 'TX_', holder: '内国消費税等種別 コード' },
    { no: 119, limit: 3, name: 'TR_', holder: '内国消費税等減免税 コード' },
    { no: 120, limit: 11, name: 'TG_', holder: '内国消費税等減税等' },
  ],
];

const DeepList: React.FC<{ cardKey: number; defaultValue: any[] }> = (
  props,
) => {
  const defaultValue = props?.defaultValue || [];
  const deepList = useDynamicList<any>(
    defaultValue?.length > 0 ? defaultValue : [0, 1],
  );
  const DeepListItem = (index: number, item: any) => (
    <Space key={deepList.getKey(index)}>
      <div>{index + 1}</div>
      <CheckFormBasic
        dataSource={dataSource2}
        basicName={[
          'HSRepeat',
          props?.cardKey,
          'TX_TR_TG',
          deepList.getKey(index),
        ]}
      />
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

const HSCodeGroupModel: React.FC<HSCodeGroupModelProps> = (props) => {
  // state
  const form = Form.useFormInstance();
  const [visible, { setFalse, setTrue }] = useBoolean(false);
  const HSRepeat = form.getFieldValue('HSRepeat') || [];
  const cardList = useDynamicList<any>(
    HSRepeat?.length > 0 ? HSRepeat : [0, 1],
  );

  const CardListItem = (index: number, item: any) => (
    <Card
      type="inner"
      key={cardList.getKey(index)}
      style={{ marginBottom: 12 }}
      title={`繰返部 ${index + 1}/${cardList?.list?.length}`}
      extra={
        <div>
          {cardList.list.length > 1 && (
            <Button
              type="text"
              onClick={() => {
                cardList.remove(index);
              }}
            >
              <MinusCircleOutlined />
            </Button>
          )}
          {cardList.list.length < 99 && (
            <Button
              type="text"
              onClick={() => {
                cardList.insert(index + 1, '');
              }}
            >
              <PlusCircleOutlined />
            </Button>
          )}
        </div>
      }
    >
      <CheckFormBasic
        dataSource={dataSource}
        basicName={['HSRepeat', cardList.getKey(index)]}
      />
      <DeepList
        defaultValue={cardList?.list?.[index]?.TX_TR_TG}
        cardKey={cardList.getKey(index)}
      />
    </Card>
  );
  // key press
  useKeyPress('ctrl.F9', () => {
    visible && setFalse();
  });

  return (
    <>
      <Modal
        title="HSコード繰返部"
        width={1200}
        visible={visible}
        onCancel={setFalse}
        footer={
          <Button type="primary" onClick={setFalse}>
            確定(ctrl + F9)
          </Button>
        }
      >
        {cardList?.list?.map((ele, index) => CardListItem(index, ele))}
      </Modal>
      <Button type="dashed" onClick={setTrue}>
        HSコード繰返部
      </Button>
    </>
  );
};

export default HSCodeGroupModel;
