import { useMemo, useEffect } from 'react';
import { Checkbox, Col, Row, Space, Drawer } from 'antd';
import { useSelections, useBoolean } from 'ahooks';

export interface CheckBoxGroupProps {
  name: string;
  cityCode: string;
  dataSource: any[];
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

  // 去除city
  const fixSelected = selected.filter((s) => s !== props.cityCode);
  // data format
  const name =
    options?.length > 1
      ? `${props.name}（${fixSelected?.length}/${options?.length - 1}）`
      : `${props.name}`;

  // effect
  // 通过双向绑定,向父组件返回组件的selected值
  useEffect(() => {
    // 没有第三级
    if (options?.length === 1) {
      return props.onChange(selected);
    }
    // 有第三级，由fixSelected长度决定是否返回city
    if (fixSelected.length > 0) {
      return props.onChange([...fixSelected, props.cityCode]);
    }
    return props.onChange([]);
  }, [selected]);

  return (
    <div>
      <Space>
        <Checkbox
          checked={allSelected}
          onClick={toggleAll}
          indeterminate={partiallySelected}
        />
        {options.length > 1 ? <a onClick={setTrue}>{name}</a> : name}
      </Space>
      <Drawer
        title={name}
        visible={visible}
        width={400}
        closable={false}
        onClose={setFalse}
      >
        <Row style={{ padding: '10px 0' }}>
          {props.dataSource?.map((item) => {
            return (
              <Col span={!item?.address ? 0 : 24} key={item.zipcode}>
                <Checkbox
                  key={item.zipcode}
                  checked={isSelected(item.zipcode)}
                  onClick={() => toggle(item.zipcode)}
                >
                  {item?.address}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      </Drawer>
    </div>
  );
};

export default CheckBoxGroup;
