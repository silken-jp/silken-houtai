import { useState } from 'react';
import { Modal, Descriptions, Radio, Input, Space, Button, Card, Row } from 'antd';
import { useKeyPress } from 'ahooks';

export interface SearchModalProps {
  value?: any;
  onChange?: (e: any) => void;
  onOk?: (v: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [changeType, setChangeType] = useState(0);
  const [dataResult, setDateResult] = useState<any>({
    show: false,
    ImpCode: '',
    ImpName: '',
    Tel: '',
    Zip: '',
    IAD: '',
  });
  useKeyPress('f2', () => {
    setVisible(true);
  });
  useKeyPress('1', () => {
    setChangeType(1);
  });
  useKeyPress('2', () => {
    setChangeType(2);
  });
  useKeyPress('3', () => {
    setChangeType(3);
  });
  function handleOK() {
    props?.onOk?.(dataResult);
    setVisible(false);
  }
  function handleCancel() {
    setVisible(false);
    setDateResult({
      show: false,
      ImpCode: '',
      ImpName: '',
      Tel: '',
      Zip: '',
      IAD: '',
    });
  }
  function handleSearch() {
    setDateResult({
      show: true,
      ImpCode: '10100010545470',
      ImpName: 'BUCKMAN LABORATORIES,K.K.',
      Tel: '0351172337',
      Zip: '1040033',
      IAD: 'TOKYO TO CHUO KU SHINKAWA 2-12-15',
    });
  }
  function changeTarget(values: any[]) {
    if (values.includes(changeType)) {
      return { background: '#1890ff', color: '#fff' };
    }
    return {};
  }
  return (
    <Modal
      destroyOnClose
      width={1000}
      title="輸入者情報"
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Row justify="space-between">
          {dataResult.show && (
            <Space>
              <span>変更項目選択：</span>
              <Radio.Group size="middle" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
                <Radio value={1}>1: 輸入者コード + 輸入者名</Radio>
                <Radio value={2}>2: Tel + Zip + IAD</Radio>
                <Radio value={3}>3: ALL</Radio>
              </Radio.Group>
            </Space>
          )}
          <Space>
            <Button size="middle" onClick={handleCancel}>
              Cancel（ESC）
            </Button>
            <Button size="middle" type="primary" onClick={handleOK}>
              Accept（F9）
            </Button>
          </Space>
        </Row>
      }
    >
      <Space direction="vertical">
        <Input.Search onSearch={handleSearch} size="large" defaultValue={'BUCKMAN LABORATORIES,K.K.'} autoFocus />
        <Space align="start">
          <Card title="現在のデータ" bordered={false}>
            <Descriptions column={1}>
              <Descriptions.Item contentStyle={changeTarget([1, 3])} label="9.輸入者コード">
                10100010545470
              </Descriptions.Item>
              <Descriptions.Item contentStyle={changeTarget([1, 3])} label="10.輸入者名">
                BUCKMAN LABORATORIES,K.K.
              </Descriptions.Item>
              <Descriptions.Item contentStyle={changeTarget([2, 3])} label="16.輸入者電話番号">
                0351172337
              </Descriptions.Item>
              <Descriptions.Item contentStyle={changeTarget([2, 3])} label="11.郵便番号">
                1040033
              </Descriptions.Item>
              <Descriptions.Item contentStyle={changeTarget([2, 3])} label="17.住所">
                TOKYO TO CHUO KU SHINKAWA 2-12-15
              </Descriptions.Item>
            </Descriptions>
          </Card>
          {dataResult.show && (
            <Card size="small" title="検索結果(1/10)" actions={[<a>Previous（P）</a>, <a>Next（N）</a>]}>
              <Descriptions column={1}>
                {dataResult.ImpCode && (
                  <Descriptions.Item contentStyle={changeTarget([1, 3])} label={<>9.輸入者コード</>}>
                    {dataResult.ImpCode}
                  </Descriptions.Item>
                )}
                {dataResult.ImpName && (
                  <Descriptions.Item contentStyle={changeTarget([1, 3])} label={<>10.輸入者名</>}>
                    {dataResult.ImpName}
                  </Descriptions.Item>
                )}
                {dataResult.Tel && (
                  <Descriptions.Item contentStyle={changeTarget([2, 3])} label={<>16.輸入者電話番号</>}>
                    {dataResult.Tel}
                  </Descriptions.Item>
                )}
                {dataResult.Zip && (
                  <Descriptions.Item contentStyle={changeTarget([2, 3])} label={<>11.郵便番号</>}>
                    {dataResult.Zip}
                  </Descriptions.Item>
                )}
                {dataResult.IAD && (
                  <Descriptions.Item contentStyle={changeTarget([2, 3])} label={<>17.住所</>}>
                    {dataResult.IAD}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Space>
      </Space>
    </Modal>
  );
};

export default SearchModal;
