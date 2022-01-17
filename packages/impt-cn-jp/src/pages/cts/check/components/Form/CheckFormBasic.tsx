import { useState, useRef, useEffect } from 'react';
import { Form, Input, Space, Tooltip, AutoComplete } from 'antd';

import { CODE_SOURCE } from '@/utils/constant';

// IP3 = FR2 = IN2
export interface CheckFormProps {
  dataSource: any[][];
}

const ToolTipInput: React.FC<any> = (props) => {
  const ref = useRef<any>();
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    let channel = new window.BroadcastChannel('sk_focus');
    channel.onmessage = (e) => {
      e.data?.no === props?.no + '.' && ref.current?.focus();
    };
    channel.onmessageerror = (ev) => {
      throw new Error('BroadcastChannel Error while deserializing: ' + ev.origin);
    };
    return () => channel?.close();
  }, []);

  const onSearch = (searchText: string) => {
    const source = CODE_SOURCE?.[props?.name];
    if (!searchText || !source) return setOptions([]);
    setOptions(
      source
        ?.filter(
          (item: any) =>
            item?.code?.toUpperCase()?.includes(searchText?.toUpperCase()) ||
            item?.name?.toUpperCase()?.includes(searchText?.toUpperCase()),
        )
        .map((item) => ({ value: item?.code, label: `${item?.code}: ${item?.name}` })),
    );
  };
  function handleChange(e: any) {
    props?.onChange(props?.name?.startsWith('NT') ? e : e?.toUpperCase());
  }
  return (
    <Tooltip trigger={['focus']} title={props?.holder} placement="topLeft">
      <AutoComplete
        value={props?.value}
        onChange={handleChange}
        options={options}
        onSearch={onSearch}
        placeholder={props?.holder}
        dropdownMatchSelectWidth={300}
      >
        {props?.limit > 106 ? (
          <Input.TextArea
            ref={ref}
            data-no={props?.no}
            style={{
              width: props?.limit * 5 + 50,
              fontFamily: 'monospace',
            }}
            autoSize={{ minRows: 2, maxRows: 2 }}
          />
        ) : (
          <Input
            ref={ref}
            data-no={props?.no}
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
