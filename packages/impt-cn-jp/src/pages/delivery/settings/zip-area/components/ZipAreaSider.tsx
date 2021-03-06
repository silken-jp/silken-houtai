import { Menu, Button, Spin } from 'antd';

export interface ZipAreaSiderProps {
  zipAreasApi: any;
  onAdd: (v: any) => void;
  onChange: (v: any) => void;
}

const ZipAreaSider: React.FC<ZipAreaSiderProps> = (props) => {
  // props
  const { data, loading, error } = props?.zipAreasApi;

  if (error) return <>error</>;
  return (
    <Spin spinning={loading}>
      <Button size="large" type="dashed" onClick={props.onAdd} block>
        新規
      </Button>
      <Menu mode="inline">
        {data?.map((area: any) => (
          <Menu.Item key={area._id} onClick={() => props.onChange(area)}>
            <span>{area.name}</span>
          </Menu.Item>
        ))}
      </Menu>
    </Spin>
  );
};

export default ZipAreaSider;
