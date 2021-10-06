import React, { useState } from 'react';
import { Modal, Descriptions } from 'antd';
import { useKeyPress } from 'ahooks';

export interface SearchModalProps {
  value?: any;
  onChange?: (e: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const [visible, setVisible] = useState(false);
  useKeyPress('f2', () => {
    setVisible(true);
  });
  useKeyPress('esc', () => {
    setVisible(false);
  });
  return (
    <Modal title="輸入者情報" visible={visible}>
      <Descriptions title="Form Data">
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
        <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
        <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
        <Descriptions.Item label="Usage Time" span={2}>
          2019-04-24 18:00:00
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default SearchModal;
