import { Form, Input, Space, Tooltip } from 'antd';

export interface CheckFormProps {
  dataSource: any[][];
}

const ToolTipInput: React.FC<any> = (props) => {
  return (
    <Tooltip trigger={['focus']} title={props?.holder} placement="topLeft">
      {props?.limit > 106 ? (
        <Input.TextArea
          placeholder={props?.holder}
          value={props?.value}
          onChange={props?.onChange}
          style={{
            width: props?.limit * 5 + 50,
            fontFamily: 'monospace',
          }}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
      ) : (
        <Input
          style={{
            width: props?.limit * 10 + 50,
            fontFamily: 'monospace',
          }}
          value={props?.value}
          onChange={props?.onChange}
          placeholder={props?.holder}
        />
      )}
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
            <Form.Item key={item?.no} style={{ marginBottom: 0 }} label={`${item?.no}.${item?.name}`} name={item?.name}>
              <ToolTipInput {...item} />
            </Form.Item>
          ))}
        </Space>
      ))}
    </Space>
  );
};

export default CheckForm;
