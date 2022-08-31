import { useState, useRef, useEffect } from 'react';
import { Form, Input, Space, Tooltip, AutoComplete } from 'antd';

import { CODE_SOURCE } from '@/utils/constant';

// IP3 = FR2 = IN2
export interface CheckFormProps {
  dataSource: any[][];
  disabled?: boolean;
  basicName?: any[];
}

interface ToolTipInputProps {
  no?: string;
  name?: string;
  value: string;
  holder?: string;
  limit: number;
  source: any[];
  disabled?: boolean;
  onChange: (v: any) => void;
}
export const ToolTipInput: React.FC<ToolTipInputProps> = (props) => {
  const ref = useRef<any>();
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    let channel = new window.BroadcastChannel('sk_focus');
    channel.onmessage = (e) => {
      e.data?.blur && ref.current?.blur();
      if (e.data?.no === props?.no + '.') {
        ref.current?.focus();
        ref.current?.select();
      }
    };
    channel.onmessageerror = (ev) => {
      throw new Error(
        'BroadcastChannel Error while deserializing: ' + ev.origin,
      );
    };
    return () => channel?.close();
  }, []);

  const onSearch = (searchText: string) => {
    if (!searchText || props?.source?.length === 0) return setOptions([]);
    setOptions(
      props.source
        ?.filter(
          (item: any) =>
            item?.value?.toUpperCase()?.includes(searchText?.toUpperCase()) ||
            item?.label?.toUpperCase()?.includes(searchText?.toUpperCase()),
        )
        .map((item: any) => ({
          ...item,
          label: `${item?.value}: ${item?.label}`,
        })),
    );
  };

  let dropdownMatchSelectWidth = 300;
  if (props?.name === 'BOK') dropdownMatchSelectWidth = 780;
  if (props?.name === 'BP') dropdownMatchSelectWidth = 400;
  if (props?.name === 'IT') dropdownMatchSelectWidth = 400;

  let limit = props?.limit;
  if (props?.name === 'CMN') {
    limit = 250;
  }

  return (
    <Tooltip trigger={['focus']} title={props?.holder} placement="bottomLeft">
      <AutoComplete
        value={props?.value}
        onChange={props?.onChange}
        options={options}
        onSearch={onSearch}
        disabled={props?.disabled}
        placeholder={props?.holder}
        dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      >
        {limit > 106 ? (
          <Input.TextArea
            ref={ref}
            data-no={props?.no}
            style={{
              width: limit * 5 + 50,
              fontFamily: 'monospace',
            }}
            disabled={props?.disabled}
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        ) : (
          <Input
            ref={ref}
            data-no={props?.no}
            disabled={props?.disabled}
            style={{
              width: limit * 10 + (limit > 20 ? 50 : 20),
              fontFamily: 'monospace',
            }}
          />
        )}
      </AutoComplete>
    </Tooltip>
  );
};

const FormText: React.FC<any> = (props) => {
  return <>{props?.value}</>;
};

const CheckForm: React.FC<CheckFormProps> = (props) => {
  return (
    <Space direction="vertical">
      {props?.dataSource?.map((row, key) => (
        <Space key={key} align="start" wrap>
          {row?.length === 0 && <hr color="#eee" />}
          {row?.map((item: any) => {
            const source = CODE_SOURCE?.[item?.name] || [];
            const arr = source?.map((s: any) => s.value);
            let rules: any[] = [{ required: item?.required }];
            if (item?.ruleType === 'number') {
              rules.push({
                validator: async (_: any, value: any) => {
                  // const reg = "^[0-9]+(.[0-9]{1})?$"
                  if (value) {
                    return Promise.resolve();
                  }
                },
              });
            } else if (arr.length > 0) {
              rules.push({ type: 'enum', enum: ['', ...arr] });
            } else {
              rules.push({ max: item?.limit });
            }
            const name = [...(props?.basicName || []), item?.name];
            if (item?.type === 'text') {
              return (
                <Form.Item
                  className="form-hidden-message"
                  key={item?.no}
                  style={{ marginBottom: 0 }}
                  dependencies={[item?.name]}
                >
                  {({ getFieldValue }) => (
                    <label>
                      <span
                        style={{ color: '#bfbfbf' }}
                      >{`${item?.no}.${item?.name}：`}</span>
                      {getFieldValue(item?.name)}
                    </label>
                  )}
                </Form.Item>
              );
            } else
              return (
                <Form.Item
                  className="form-hidden-message"
                  key={item?.no}
                  style={{ marginBottom: 0 }}
                  label={`${item?.no}.${item?.name}`}
                  name={name}
                  rules={rules}
                >
                  <ToolTipInput
                    {...item}
                    source={source}
                    disabled={props?.disabled}
                  />
                </Form.Item>
              );
          })}
        </Space>
      ))}
    </Space>
  );
};

export default CheckForm;
