import { useState } from 'react';
import { Form, Input, Space, Tooltip, AutoComplete } from 'antd';

import { CODE_SOURCE } from '@/utils/constant';

export interface CheckFormProps {
  dataSource: any[][];
}

const ToolTipInput: React.FC<any> = (props) => {
  const [options, setOptions] = useState<any[]>([]);
  const onSearch = (searchText: string) => {
    const source = CODE_SOURCE?.[props?.name];
    if (!searchText || !source) return setOptions([]);
    setOptions(
      source
        ?.filter(
          (item: any) =>
            item?.code?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
            item?.name?.toLowerCase()?.includes(searchText?.toLowerCase()),
        )
        .map((item) => ({ value: item?.code, label: `${item?.code}: ${item?.name}` })),
    );
  };
  return (
    <Tooltip trigger={['focus']} title={props?.holder} placement="topLeft">
      <AutoComplete
        value={props?.value}
        onChange={props?.onChange}
        options={options}
        onSearch={onSearch}
        placeholder={props?.holder}
        dropdownMatchSelectWidth={300}
      >
        {props?.limit > 106 ? (
          <Input.TextArea
            style={{
              width: props?.limit * 5 + 50,
              fontFamily: 'monospace',
            }}
            autoSize={{ minRows: 2, maxRows: 2 }}
          />
        ) : (
          <Input
            style={{
              width: props?.limit * 10 + (props?.limit > 20 ? 50 : 20),
              fontFamily: 'monospace',
            }}
          />
        )}
      </AutoComplete>
    </Tooltip>
  );
};

const CheckForm: React.FC<CheckFormProps> = (props) => {
  return (
    <Space direction="vertical">
      {props?.dataSource?.map((row, key) => (
        <Space key={key} align="start" wrap>
          {row?.length === 0 && <hr color="#eee" />}
          {row?.map((item: any) => (
            <Form.Item
              className="form-hidden-message"
              key={item?.no}
              style={{ marginBottom: 0 }}
              label={`${item?.no}.${item?.name}`}
              name={item?.name}
              rules={[{ max: item?.limit, message: ' ' }]}
            >
              <ToolTipInput {...item} />
            </Form.Item>
          ))}
        </Space>
      ))}
    </Space>
  );
};

export default CheckForm;
