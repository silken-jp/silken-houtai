import React, { useMemo } from 'react';
import { Checkbox, Col, Row, Space, Modal } from 'antd';
import { useSelections, useBoolean } from 'ahooks';

export interface CheckBoxGroupProps {
  name: string;
  dataSource?: any[];
  defaultSelected?: string[];
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = (props) => {
  // state
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const options = useMemo(() => {
    return props?.dataSource?.map((i) => i.zipcode) || [];
  }, props.dataSource);
  const {
    allSelected,
    isSelected,
    toggle,
    toggleAll,
    partiallySelected,
  } = useSelections(options, props?.defaultSelected);

  return (
    <div>
      <Space>
        <Checkbox
          checked={allSelected}
          onClick={toggleAll}
          indeterminate={partiallySelected}
        />
        <a onClick={setTrue}>{props.name}</a>
      </Space>
      <Modal
        centered
        title={props.name}
        visible={visible}
        onOk={setFalse}
        onCancel={setFalse}
      >
        <Row style={{ padding: '10px 0' }}>
          {props.dataSource?.map((item) => (
            <Col span={12} key={item.zipcode}>
              <Checkbox
                checked={isSelected(item.zipcode)}
                onClick={() => toggle(item.zipcode)}
              >
                {item?.address}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default CheckBoxGroup;
