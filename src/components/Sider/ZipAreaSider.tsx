import React from 'react';
import { useRequest } from 'ahooks';
import { Menu, Button, Spin } from 'antd';

import { getAllZipAreaNames } from '@/services/request/ziparea';

export interface ZipAreaSiderProps {
  onChange: (v: any) => void;
}

const ZipAreaSider: React.FC<ZipAreaSiderProps> = (props) => {
  const { data, loading, error } = useRequest<any>(getAllZipAreaNames);
  if (loading) return <Spin />;
  if (error) return <>error</>;
  return (
    <>
      <Button block>添加</Button>
      <Menu mode="inline">
        {data?.zipAreas?.map((area: any) => (
          <Menu.Item key={area._id} onClick={() => props.onChange(area)}>
            {area.name}
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default ZipAreaSider;
