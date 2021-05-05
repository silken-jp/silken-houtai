import React, { useMemo, useEffect } from 'react';
import { Checkbox, Col, Row, Space, Drawer } from 'antd';
import { useSelections, useBoolean } from 'ahooks';

export interface CheckBoxGroupProps {
  name: string;
  dataSource?: any[];
  defaultSelected?: string[];
  onChange: (values: string[]) => void;
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
    selected,
  } = useSelections(options, props?.defaultSelected);

  // data format
  const name =
    props.name + `（${selected?.length}/${props?.dataSource?.length}）`;

  // effect
  // 通过双向绑定,向父组件返回组件的selected值
  useEffect(() => {
    props.onChange(selected);
  }, [selected]);

  return (
    <div>
      <Space>
        <Checkbox
          checked={allSelected}
          onClick={toggleAll}
          indeterminate={partiallySelected}
        />
        <a onClick={setTrue}>{name}</a>
      </Space>
      <Drawer
        title={name}
        visible={visible}
        width={320}
        closable={false}
        onClose={setFalse}
      >
        <Row style={{ padding: '10px 0' }}>
          {props.dataSource?.map((item) => (
            <Col span={24} key={item.zipcode}>
              <Checkbox
                checked={isSelected(item.zipcode)}
                onClick={() => toggle(item.zipcode)}
              >
                {item?.address}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Drawer>
    </div>
  );
};

export default CheckBoxGroup;
